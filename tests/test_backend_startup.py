"""Offline startup validation: reject misconfigured Render/Supabase settings.

Run: python -m unittest tests.test_backend_startup -v
No real credentials, network calls or databases are involved.
"""
import os
import pathlib
import subprocess
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]


class BackendStartupTests(unittest.TestCase):
    def _launch_with(self, overrides):
        env = dict(os.environ)
        env.update({
            "SUPABASE_URL": "https://fake-test.supabase.co",
            "SUPABASE_KEY": "FAKE_LOCAL_TEST_ONLY_NOT_REAL_KEY",
            "SECRET_KEY": "test-only-long-secret-never-use-in-production-2026",
        })
        env.update(overrides)
        return subprocess.run(
            [sys.executable, "-c", "import backend.main"],
            cwd=str(ROOT),
            env=env,
            capture_output=True,
            text=True,
            timeout=15,
            check=False,
        )

    def test_invalid_supabase_url_fails_before_connecting(self):
        result = self._launch_with({"SUPABASE_URL": "not-a-valid-url"})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("SUPABASE_URL must be a valid HTTPS service URL", result.stderr)

    def test_placeholder_supabase_key_rejected(self):
        result = self._launch_with({"SUPABASE_KEY": "YOUR_SUPABASE_SERVICE_KEY_EXAMPLE"})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("SUPABASE_KEY is missing or appears to be a placeholder", result.stderr)

    def test_short_jwt_secret_rejected(self):
        result = self._launch_with({"SECRET_KEY": "dev-key"})
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("SECRET_KEY must be configured as a strong", result.stderr)


if __name__ == "__main__":
    unittest.main()
