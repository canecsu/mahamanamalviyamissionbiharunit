"""Read-only smoke checks for an ISOLATED Mahamana staging backend.

No database writes, registrations, logins, passwords, or PII downloads.
The script refuses production URLs even if called by mistake.

Required environment variables:
  CONFIRM_STAGING_ONLY=YES
  STAGING_BACKEND_URL=https://your-staging-service.onrender.com
  STAGING_SUPABASE_REF=<new non-production Supabase project ref>
Optional:
  STAGING_FRONTEND_ORIGIN=https://your-preview.vercel.app

Usage: python3 -m staging.smoke_check
"""
import json
import os
import sys
from dataclasses import dataclass
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

PROD_SUPABASE_REF = "ncqpxyiuqlrnfuurvzah"
PROD_BACKEND_HOST = "mahamanamalviyamissionbiharunit.onrender.com"
MAX_RESPONSE_BYTES = 128 * 1024


@dataclass(frozen=True)
class StagingConfig:
    backend_url: str
    project_ref: str
    frontend_origin: str = ""


def validate_configuration(env):
    if env.get("CONFIRM_STAGING_ONLY") != "YES":
        raise ValueError("Missing CONFIRM_STAGING_ONLY=YES; refusing network calls")

    ref = env.get("STAGING_SUPABASE_REF", "").strip()
    if not ref or ref == PROD_SUPABASE_REF:
        raise ValueError("A separate NON-PRODUCTION Supabase project reference is required")

    url = env.get("STAGING_BACKEND_URL", "").strip().rstrip("/")
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    is_local = host in {"127.0.0.1", "localhost"}
    safe_render = host.endswith(".onrender.com") and ("staging" in host or "preview" in host)

    if host == PROD_BACKEND_HOST or not (is_local or safe_render):
        raise ValueError("Only localhost or an explicitly named staging/preview Render service is permitted")
    if parsed.scheme != ("http" if is_local else "https") or parsed.username or parsed.password:
        raise ValueError("Unexpected staging backend URL format")
    if parsed.path not in ("", "/") or parsed.query or parsed.fragment:
        raise ValueError("Provide only the staging backend origin, with no path or query")

    origin = env.get("STAGING_FRONTEND_ORIGIN", "").strip().rstrip("/")
    if origin:
        front = urlparse(origin)
        if (front.scheme != "https"
                or front.hostname in {None, "mahamanamalviyamissionbiharunit-two.vercel.app"}
                or not front.hostname.endswith(".vercel.app")
                or front.path not in ("", "/")
                or front.query or front.fragment):
            raise ValueError("STAGING_FRONTEND_ORIGIN must be a protected Vercel Preview origin")
    return StagingConfig(url, ref, origin)


def read_endpoint(base_url, path, method="GET", headers=None):
    request = Request(base_url + path, method=method, headers=headers or {})
    try:
        with urlopen(request, timeout=12) as response:
            code = response.status
            response_headers = dict(response.headers)
            data = response.read(MAX_RESPONSE_BYTES + 1)
    except HTTPError as error:
        code = error.code
        response_headers = dict(error.headers)
        data = error.read(MAX_RESPONSE_BYTES + 1)
    except URLError as error:
        raise RuntimeError("Staging API not reachable") from error
    if len(data) > MAX_RESPONSE_BYTES:
        raise ValueError("Unexpectedly large staging response; aborting")
    return code, response_headers, data


def run_checks(config, request_fn=read_endpoint):
    checks = []

    code, _, body = request_fn(config.backend_url, "/healthz")
    checks.append(("Backend liveness", code == 200))
    if code == 200:
        try:
            checks.append(("Liveness JSON", json.loads(body).get("status") == "ok"))
        except (ValueError, AttributeError, TypeError):
            checks.append(("Liveness JSON", False))

    code, _, body = request_fn(config.backend_url, "/readyz")
    checks.append(("Staging database readiness", code == 200))
    if code == 200:
        try:
            checks.append(("Readiness JSON", json.loads(body).get("database") == "reachable"))
        except (ValueError, AttributeError, TypeError):
            checks.append(("Readiness JSON", False))

    for path in ("/donations", "/donations/1", "/admin/news"):
        code, _, _ = request_fn(config.backend_url, path)
        checks.append((f"Unauthorized request denied: {path}", code in (401, 403)))

    for path in ("/news", "/pages"):
        code, _, body = request_fn(config.backend_url, path)
        checks.append((f"Published content endpoint: {path}", code == 200))
        if code == 200:
            try:
                rows = json.loads(body)
                checks.append((f"Array response: {path}", isinstance(rows, list)))
                if isinstance(rows, list):
                    checks.append((f"No drafts: {path}",
                                   all(item.get("published") is True for item in rows
                                       if isinstance(item, dict))))
            except (ValueError, TypeError, AttributeError):
                checks.append((f"Valid JSON response: {path}", False))

    if config.frontend_origin:
        code, headers, _ = request_fn(
            config.backend_url, "/auth/login", method="OPTIONS",
            headers={"Origin": config.frontend_origin,
                     "Access-Control-Request-Method": "POST",
                     "Access-Control-Request-Headers": "authorization,content-type"})
        checks.append(("Staging-only CORS preflight", code == 200 and
                       headers.get("access-control-allow-origin", "") == config.frontend_origin))

    # Intentionally print no response rows, authentication tokens, URLs, or secrets.
    for label, success in checks:
        print(f"{'PASS' if success else 'FAIL'}: {label}")
    print(f"Verified {sum(ok for _, ok in checks)}/{len(checks)} staging checks")
    return all(success for _, success in checks)


def main():
    try:
        config = validate_configuration(os.environ)
        ok = run_checks(config)
    except (ValueError, RuntimeError) as error:
        print(f"STOP: {error}", file=sys.stderr)
        return 2
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
