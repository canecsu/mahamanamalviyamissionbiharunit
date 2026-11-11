"""Non-invasive checks for backend readiness, authentication configuration and UI.

Run: python3 -m unittest tests.test_backend_configuration -v
These tests do not connect to Supabase, Render, or real user accounts.
"""
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
BACKEND = ROOT / "backend" / "main.py"
SRC = ROOT / "frontend" / "src"

class BackendConfigurationTests(unittest.TestCase):
    def test_service_secrets_require_environment(self):
        source = BACKEND.read_text()
        for key in ("SUPABASE_URL", "SUPABASE_KEY", "SECRET_KEY"):
            self.assertIn(f'{key} = os.environ.get("{key}")', source)
            self.assertIn(f'not {key}', source)
        self.assertIn("len(SECRET_KEY) < 32", source)

    def test_liveness_is_not_a_fake_db_check(self):
        source = BACKEND.read_text()
        self.assertIn('def health():', source)
        self.assertIn('"database": "not_checked"', source)
        self.assertIn('def readiness():', source)
        self.assertIn('supabase.table("users").select("id").limit(1).execute()', source)
        self.assertIn('status_code=503', source)
        self.assertNotIn('"database": "Supabase Connected"', source)

    def test_frontend_uses_one_backend_origin(self):
        cfg = (SRC / "lib" / "apiConfig.js").read_text()
        self.assertIn("REACT_APP_ADMIN_API_URL", cfg)
        self.assertIn("export function apiUrl", cfg)
        for path in ("lib/contentApi.js", "admin/api.js", "contexts/AuthContext.jsx"):
            content = (SRC / path).read_text()
            self.assertIn("apiUrl", content, path)
            self.assertNotIn('const API_BASE_URL = "https://', content, path)
        self.assertNotIn("import.meta.env", (SRC / "lib" / "apiConfig.js").read_text())

    def test_authentication_does_not_discard_session_on_5xx(self):
        source = (SRC / "contexts" / "AuthContext.jsx").read_text()
        self.assertIn("response.status === 401 || response.status === 403", source)
        self.assertIn("A transient 5xx is not proof", source)

    def test_auth_page_has_bilingual_labels(self):
        import json
        for lang in ("en", "hi"):
            obj = json.loads((SRC / "locales" / lang / "translation.json").read_text())
            self.assertTrue(obj["auth"]["signInTitle"])
            self.assertTrue(obj["auth"]["createTitle"])
        auth_page = (SRC / "pages" / "AuthPage.jsx").read_text()
        self.assertIn("useTranslation", auth_page)

if __name__ == "__main__":
    unittest.main()
