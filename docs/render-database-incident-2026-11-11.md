# Mahamana Malaviya Mission, Bihar Unit — Render API incident and safe recovery plan

**Audit date:** 11 November 2026  
**Status:** Review-only Draft PR #4, stacked on Draft PR #3 → PR #2 → PR #1.  
**Production remains unchanged.**

## Confirmed observations (read-only)

- Render workspace: `tea-d7aeb52dbo4c73a5f4l0`; service `srv-d7aeumvfte5s73b3lnog` / `mahamanamalviyamissionbiharunit`.
- Service URL: `https://mahamanamalviyamissionbiharunit.onrender.com`.
- Repo: `canecsu/mahamanamalviyamissionbiharunit`; backend root directory `backend`; Python / FastAPI; last recorded Render deployment is **live** from 9 April 2026.
- **Important:** Render `autoDeploy=yes` for branch `main`; changing/merging `main` can trigger a real backend deployment. Do not merge without explicit approval.
- Application log **11 November 2026, 13:11:23 UTC**: a Supabase/PostgREST list request failed in `backend/main.py` with `httpx.ConnectError: [Errno -2] Name or service not known`. This means the runtime could not resolve an upstream hostname for that request; it does **not** establish the exact environment-variable error.
- The `/healthz` and `/news` read-only probes from a separate isolated test environment both timed out after 12 seconds. This is inconclusive as a general public availability test.
- Live production backend does **not** include Draft PR #1–#4 fixes until a separate authorized Render rollout.
- Vercel production project has verified domain `mahamanamalviyamissionbiharunit-two.vercel.app`; preview uses project-specific random `*.vercel.app` hostnames.
- Supabase linked projects identified: Samuchabihar, Sumirayan Design website and a generic Sumirayan project. **None has been verified as the mission's actual database**; the generic project query repeatedly timed out. Do not change them based on guesswork.
- No SQL writes, account changes, sensitive-data retrieval, or production deployments occurred in this audit.

## Fixes proposed in Draft PR #4

1. Stop surfacing internal Python stacktrace details in responses if `httpx.RequestError` (e.g. DNS failure, timeout) occurs while accessing Supabase. Return HTTP 503 with safe JSON message and `Retry-After: 30`.
2. Convert PostgREST `APIError` to an explicit safe HTTP 502 without exposing SQL schema or sensitive connection details.
3. Validate `SUPABASE_URL` is a real HTTPS URL and refuse short or placeholder `SUPABASE_KEY` at startup; keep the PR #3 requirement for a strong JWT `SECRET_KEY`.
4. Replace unrestricted wildcard CORS with official Vercel website origin and project-specific Vercel preview pattern. If a verified custom domain or local staging origin is needed, set `CORS_ALLOWED_ORIGINS` explicitly **on the authorized service**.
5. Add `.gitignore` and safe `.env.example` files so credentials are not accidentally committed, and keep frontend API variables separate from secret backend variables.
6. Add mock-backend tests for upstream DNS failure, CORS allow/deny, startup env validation and preexisting authorization checks.

## Next checks before doing anything on Render production

1. Open the Render service [dashboard](https://dashboard.render.com/web/srv-d7aeumvfte5s73b3lnog), inspect **Environment** values privately (do not paste values into chat).
2. Determine whether `SUPABASE_URL` references a valid existing project and the expected hostname; verify the project ID/ref from the *Supabase dashboard* rather than guessing.
3. Confirm `SUPABASE_KEY` is the appropriate server-side credential for that project, `SECRET_KEY` is strong and already deployed; note that changing a JWT signing key invalidates existing sessions.
4. In the correct **staging Supabase project**, review tables `users`, `pages`, `news`, `events`, `blogs`, `donations` and RLS plus Data API grants. Existing connected projects are not necessarily the mission database.
5. Set up a separate *non-production Render service* with isolated credentials, and change the **preview-only** Vercel `REACT_APP_ADMIN_API_URL` to point to it. Render production has no PR preview generation enabled.
6. Validate liveness `/healthz`, read-only database readiness `/readyz`, CORS, JWT login/role checks, public `published` filtering, and donor record privacy against staging only.
7. Test only synthetic data; do not run signup, donations, delete, schema migrations or other writes against production during the audit.
8. Verify Render logs/metrics, normal routes and accessibility after staging deployment. Test frontend in an authorized protected Vercel Preview browser session.
9. Obtain explicit final release approval **before** merging PR #1–#4 or changing Render/Supabase production settings.
10. Have a rollback plan. Since Render `autoDeploy=yes` on `main`, merge strategy must deliberately account for the backend deployment triggered by any main commit.

## Verification scope

- `python -m unittest tests.test_fastapi_routes tests.test_frontend_audit tests.test_backend_configuration tests.test_backend_startup` runs offline against a fake DB and isolated startup environment.
- `python -m py_compile backend/main.py` validates syntax.
- Vercel `READY` means the **frontend** compiled and deployed to Preview, not that a live database/session integration test passed.

## Important safety boundary

CORS is a browser policy, **not authorization**. Admin endpoints must still enforce server-side roles. Changing Render production environment variables or releasing the patched backend remains out of scope until authorized.
