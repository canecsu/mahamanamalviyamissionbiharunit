"""Offline invariants for Supabase SQL review files; never connects to production."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
SQL_DIR = ROOT / "sql" / "review_only"
TABLES = (
    "activities", "blogs", "donations", "events", "gallery", "members",
    "news", "pages", "store", "users", "videos"
)


class RlsReviewTests(unittest.TestCase):
    def test_readonly_inventory_has_all_expected_tables(self):
        sql = (SQL_DIR / "mahamana_rls_readonly_audit.sql").read_text()
        for name in TABLES:
            self.assertIn(f"'{name}'", sql)
        self.assertIn("has_table_privilege('anon'", sql)
        self.assertIn("pg_catalog.pg_policies", sql)
        for keyword in ("alter table", "drop table", "delete from", "update public.", "insert into"):
            self.assertNotIn(keyword, sql.lower())

    def test_dryrun_ends_in_rollback_and_never_commits(self):
        sql = (SQL_DIR / "mahamana_rls_rollback_dryrun.sql").read_text()
        self.assertTrue(sql.rstrip().endswith("rollback;"))
        self.assertRegex(sql.lower(), r"(?m)^begin;\s*$")
        self.assertIsNone(re.search(r"(?im)^\s*commit\s*;", sql))

    def test_dryrun_protects_private_and_public_tables(self):
        sql = (SQL_DIR / "mahamana_rls_rollback_dryrun.sql").read_text().lower()
        for name in TABLES:
            self.assertIn(f"alter table public.{name} enable row level security;", sql)
            self.assertIn(f"public.{name}", sql)
        self.assertIn("from anon, authenticated;", sql)
        self.assertNotIn("revoke all privileges on all tables", sql)

    def test_optional_project_ref_is_documented(self):
        backend = (ROOT / "backend" / "main.py").read_text()
        example = (ROOT / "backend" / ".env.example").read_text()
        self.assertIn("EXPECTED_SUPABASE_PROJECT_REF", backend)
        self.assertIn("EXPECTED_SUPABASE_PROJECT_REF=ncqpxyiuqlrnfuurvzah", example)


if __name__ == "__main__":
    unittest.main()
