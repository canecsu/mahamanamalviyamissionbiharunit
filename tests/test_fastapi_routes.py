"""Offline FastAPI route tests using a fake Supabase client.

Run with backend dependencies installed:
    python -m unittest tests.test_fastapi_routes -v

No Render/Supabase requests, database records, or real credentials are used.
"""
import importlib
import os
import sys
import unittest
from types import SimpleNamespace
from unittest.mock import patch

try:
    import supabase
    from fastapi.testclient import TestClient
except ImportError:
    supabase = None
    TestClient = None


class FakeQuery:
    def __init__(self, table, queries):
        self.table = table
        self.queries = queries
        self.published_only = False

    def select(self, *args, **kwargs):
        return self

    def limit(self, *args):
        return self

    def eq(self, key, value):
        if key == "published":
            self.published_only = bool(value)
        return self

    def order(self, *args, **kwargs):
        return self

    def execute(self):
        self.queries.append((self.table, self.published_only))
        return SimpleNamespace(data=[])


class FakeDB:
    def __init__(self, failing=False):
        self.queries = []
        self.failing = failing

    def table(self, name):
        if self.failing:
            raise RuntimeError("simulated DB offline; never expose this in API")
        return FakeQuery(name, self.queries)


@unittest.skipIf(TestClient is None, "FastAPI/supabase test dependencies are not installed")
class BackendRouteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        os.environ.setdefault("SUPABASE_URL", "https://fake-test-db.supabase.co")
        os.environ.setdefault("SUPABASE_KEY", "FAKE_ONLY_NO_EXTERNAL_ACCESS")
        os.environ.setdefault("SECRET_KEY", "integration-test-only-secret-not-for-production-2026")
        cls.db = FakeDB()
        with patch.object(supabase, "create_client", return_value=cls.db):
            sys.modules.pop("backend.main", None)
            cls.module = importlib.import_module("backend.main")
        cls.client = TestClient(cls.module.app)

    def setUp(self):
        self.module.supabase = self.db
        self.db.queries.clear()

    def test_liveness_does_not_query_database(self):
        res = self.client.get("/healthz")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {"status": "ok", "database": "not_checked"})
        self.assertEqual(self.db.queries, [])

    def test_readiness_only_checks_database_and_hides_rows(self):
        res = self.client.get("/readyz")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {"status": "ready", "database": "reachable"})
        self.assertEqual(self.db.queries, [("users", False)])

    def test_readiness_sanitizes_database_failure(self):
        self.module.supabase = FakeDB(failing=True)
        res = self.client.get("/readyz")
        self.assertEqual(res.status_code, 503)
        self.assertEqual(res.json(), {"detail": "Database is not ready"})

    def test_public_donor_records_reject_anonymous_users(self):
        for url in ("/donations", "/donations/1", "/admin/donations"):
            with self.subTest(url=url):
                res = self.client.get(url)
                self.assertIn(res.status_code, (401, 403))
        self.assertEqual(self.db.queries, [])

    def test_admin_api_rejects_anonymous_users(self):
        res = self.client.get("/admin/news")
        self.assertIn(res.status_code, (401, 403))
        self.assertEqual(self.db.queries, [])

    def test_public_news_and_pages_apply_publication_filter(self):
        for url, table in (("/news", "news"), ("/pages", "pages")):
            with self.subTest(url=url):
                res = self.client.get(url)
                self.assertEqual(res.status_code, 200)
                self.assertEqual(self.db.queries[-1], (table, True))


if __name__ == "__main__":
    unittest.main()
