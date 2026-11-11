"""Review-only guards for the verified Mahamana Supabase security proposal.

These tests read source files only. They NEVER connect to Supabase or change
any production data.
"""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
FILE = ROOT / "sql" / "approval_required" / "mahamana_verified_rls_hardening_DRY_RUN_ONLY.sql"
TABLES = ("activities", "blogs", "donations", "events", "gallery",
          "members", "news", "pages", "store", "users", "videos")
SEQUENCES = tuple(f"{table}_id_seq" for table in TABLES if table != "users")


class VerifiedRlsReviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sql = FILE.read_text()
        cls.lower = cls.sql.lower()

    def test_proposal_is_not_runnable_without_staging_guard(self):
        self.assertIn("app.mahamana_staging_review", self.sql)
        self.assertIn("is distinct from 'confirmed'", self.lower)
        self.assertNotIn("set local app.mahamana_staging_review = 'confirmed'", self.lower)

    def test_hardening_sql_must_roll_back(self):
        self.assertRegex(self.lower, r"(?m)^begin;\s*$")
        self.assertTrue(self.sql.rstrip().lower().endswith("rollback;"))
        self.assertIsNone(re.search(r"(?im)^\s*commit\s*;", self.sql))

    def test_rls_enabled_for_all_verified_tables(self):
        for name in TABLES:
            with self.subTest(table=name):
                self.assertIn(
                    f"alter table public.{name} enable row level security;",
                    self.lower,
                )
        self.assertIn("from anon, authenticated;", self.lower)
        self.assertIn("revoke all privileges on table", self.lower)

    def test_verified_sequences_revoked_and_service_role_preserved(self):
        self.assertEqual(len(SEQUENCES), 10)
        self.assertIn("revoke all privileges on sequence", self.lower)
        for name in SEQUENCES:
            self.assertIn(f"public.{name}", self.lower)
        self.assertNotIn("from service_role", self.lower)
        self.assertIn("has_table_privilege('service_role'", self.lower)
        self.assertIn("rolbypassrls", self.lower)

    def test_future_default_grants_need_review_too(self):
        for owner in ("postgres", "supabase_admin"):
            self.assertIn(
                f"alter default privileges for role {owner} in schema public",
                self.lower,
            )
        self.assertIn("revoke all on tables from anon, authenticated", self.lower)
        self.assertIn("revoke all on sequences from anon, authenticated", self.lower)

    def test_no_sensitive_record_queries(self):
        # This file validates relation/role metadata, not application row contents.
        self.assertNotIn("select * from public.users", self.lower)
        self.assertNotIn("select * from public.donations", self.lower)
        self.assertNotIn("password_hash", self.lower)


if __name__ == "__main__":
    unittest.main()
