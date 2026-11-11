"""Offline tests: staging safety must work without creating cloud resources."""
import json
import unittest
from staging.smoke_check import validate_configuration, run_checks


class StagingSafetyTests(unittest.TestCase):
    def setUp(self):
        self.env = {
            "CONFIRM_STAGING_ONLY": "YES",
            "STAGING_BACKEND_URL": "https://mmm-bihar-staging.onrender.com",
            "STAGING_SUPABASE_REF": "staging-only-fake-ref",
            "STAGING_FRONTEND_ORIGIN": "https://mahamanamalviyamissionbiharunit-9dececu0d.vercel.app",
        }

    def test_requires_explicit_opt_in(self):
        self.env.pop("CONFIRM_STAGING_ONLY")
        with self.assertRaisesRegex(ValueError, "CONFIRM_STAGING_ONLY"):
            validate_configuration(self.env)

    def test_refuses_live_supabase_project(self):
        self.env["STAGING_SUPABASE_REF"] = "ncqpxyiuqlrnfuurvzah"
        with self.assertRaisesRegex(ValueError, "NON-PRODUCTION"):
            validate_configuration(self.env)

    def test_refuses_production_render_backend(self):
        self.env["STAGING_BACKEND_URL"] = "https://mahamanamalviyamissionbiharunit.onrender.com"
        with self.assertRaisesRegex(ValueError, "staging/preview"):
            validate_configuration(self.env)

    def test_refuses_unrecognized_external_host(self):
        self.env["STAGING_BACKEND_URL"] = "https://example.com"
        with self.assertRaises(ValueError):
            validate_configuration(self.env)

    def test_refuses_live_vercel_frontend_as_preview(self):
        self.env["STAGING_FRONTEND_ORIGIN"] = (
            "https://mahamanamalviyamissionbiharunit-two.vercel.app"
        )
        with self.assertRaisesRegex(ValueError, "Preview"):
            validate_configuration(self.env)

    def test_accepts_staging_origin(self):
        config = validate_configuration(self.env)
        self.assertEqual(config.backend_url, "https://mmm-bihar-staging.onrender.com")
        self.assertEqual(config.project_ref, "staging-only-fake-ref")

    def test_safe_readonly_checks_pass_for_mock_staging(self):
        config = validate_configuration(self.env)
        requested = []

        def fake_request(base, path, method="GET", headers=None):
            requested.append((base, path, method))
            response_headers = {}
            if method == "OPTIONS":
                response_headers["access-control-allow-origin"] = config.frontend_origin
                return 200, response_headers, b""
            if path == "/healthz":
                return 200, {}, b'{"status":"ok","database":"not_checked"}'
            if path == "/readyz":
                return 200, {}, b'{"status":"ready","database":"reachable"}'
            if path.startswith("/donations") or path.startswith("/admin"):
                return 401, {}, b'{"detail":"Unauthorized"}'
            if path in ("/news", "/pages"):
                return 200, {}, b'[{"published":true}]'
            raise AssertionError("Unrecognized path")

        self.assertTrue(run_checks(config, request_fn=fake_request))
        self.assertTrue(all(base == config.backend_url for base, _, _ in requested))
        self.assertTrue(all(method in {"GET", "OPTIONS"} for _, _, method in requested))

    def test_drafts_trigger_failure_without_exposing_content(self):
        config = validate_configuration(self.env)

        def fake_request(base, path, method="GET", headers=None):
            if method == "OPTIONS":
                return 200, {"access-control-allow-origin": config.frontend_origin}, b""
            if path == "/healthz":
                return 200, {}, b'{"status":"ok"}'
            if path == "/readyz":
                return 200, {}, b'{"database":"reachable"}'
            if path.startswith("/donations") or path.startswith("/admin"):
                return 403, {}, b""
            if path == "/pages":
                return 200, {}, b'[{"published":false,"title":"private draft"}]'
            return 200, {}, b'[]'

        self.assertFalse(run_checks(config, request_fn=fake_request))


if __name__ == "__main__":
    unittest.main()
