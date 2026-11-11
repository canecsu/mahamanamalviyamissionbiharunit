"""Read-only regression checks for Mahamana Bihar's public React frontend.

Run from repository root:
    python3 -m unittest tests.test_frontend_audit -v

No network calls, credentials, database mutations, or browser sessions are required.
"""
import json
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "frontend" / "src"


def resolve(obj, key):
    for part in key.split("."):
        if isinstance(obj, dict):
            obj = obj.get(part)
        elif isinstance(obj, list) and part.isdigit():
            index = int(part)
            obj = obj[index] if index < len(obj) else None
        else:
            return None
    return obj


class FrontendIntegrityTests(unittest.TestCase):
    def test_translations_present_in_both_languages(self):
        translations = {
            lang: json.loads((SRC / "locales" / lang / "translation.json").read_text())
            for lang in ("en", "hi")
        }
        keys = set()
        for path in [*SRC.rglob("*.js"), *SRC.rglob("*.jsx")]:
            keys.update(re.findall(r'\\bt\\(["\\\']([\\w.]+)["\\\']', path.read_text()))
        for lang, obj in translations.items():
            missing = sorted(key for key in keys if resolve(obj, key) is None)
            self.assertFalse(missing, f"{lang}: missing translation keys {missing}")

    def test_api_url_and_build_system_match(self):
        content_api = (SRC / "lib" / "contentApi.js").read_text()
        self.assertIn("REACT_APP_ADMIN_API_URL", content_api)
        self.assertNotIn("onrender.com/docs", content_api)
        for path in SRC.rglob("*.jsx"):
            self.assertNotIn("import.meta.env", path.read_text(), str(path))

    def test_no_false_membership_submission(self):
        join = (SRC / "pages" / "Join.jsx").read_text()
        self.assertNotIn("Simulate form submission", join)
        self.assertIn("mailto:mmmbiharunit@gmail.com", join)
        self.assertIn("emailDraftNotice", join)
        self.assertNotIn("toast.success(t('join.successMsg'", join)

    def test_donation_and_nav_routes_are_separate(self):
        donation = (SRC / "pages" / "donation.jsx").read_text()
        app = (SRC / "App.js").read_text()
        self.assertIn("function Donation()", donation)
        self.assertNotIn("const Activities = ", donation)
        self.assertIn('path="/objectives"', app)
        self.assertIn('path="/members"', app)
        self.assertIn('path="/donation"', app)

    def test_backend_public_filters_and_private_donor_access(self):
        backend = (ROOT / "backend" / "main.py").read_text()
        self.assertIn('table_name == "donations"', backend)
        self.assertIn('create_crud_routes("pages", "pages", PageModel, include_public_filter=True)', backend)
        self.assertNotIn("include_unpublished: bool", backend)

    def test_no_unconfirmed_future_event_in_home_ticker(self):
        home = (SRC / "pages" / "Home.jsx").read_text()
        self.assertNotIn("Annual Gathering 2026 - Registrations now open!", home)
        self.assertNotIn("Volunteer training camp scheduled for next month.", home)


if __name__ == "__main__":
    unittest.main()
