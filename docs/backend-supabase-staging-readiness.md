# Backend / Supabase readiness — staging checklist (11 Nov 2026)

> **Review only.** PR #3 is stacked on PR #2, which is stacked on PR #1. Do not merge or deploy to production without the owner's final approval. No production credentials should be committed to GitHub.

## What PR #3 changes

1. A single React backend origin via `frontend/src/lib/apiConfig.js`. Login, Admin CRUD and public content use the same `REACT_APP_ADMIN_API_URL`.
2. Frontend authentication no longer discards stored tokens on transient network/5xx errors. Confirmed 401/403 failures still clear invalid sessions.
3. `/healthz` is clearly a liveness check, without claiming database success.
4. New `/readyz` checks a read-only query on the `users` table. It returns 503 if unavailable and does not expose database details or records.
5. All Supabase and JWT signing credentials must come from Render environment variables (no placeholder defaults). `SECRET_KEY` must have at least 32 characters.
6. Authentication page is translated in Hindi and English.
7. Member application email draft gets real newline separators.
8. Read-only automated regression tests added.

## Findings / access status

- Current GitHub repo: `canecsu/mahamanamalviyamissionbiharunit`.
- Vercel production: `main` (not changed by any preview PR).
- Existing Render URL from code: `https://mahamanamalviyamissionbiharunit.onrender.com`.
- Render connector is not connected, so **Render logs, environment variables, deployments and current live service health remain unverified**.
- Connected Supabase projects are labelled Samuchabihar, Sumirayan Design website, and a generic Sumirayan project. The mission's backend project has **not been conclusively identified**. The generic project's schema query timed out; do not use or mutate it on this assumption.
- `/healthz` read-only remote probe could not be completed reliably. Network timeout from a test environment is not proof of production outage.
- These proposed backend fixes are **not reflected in the running Render service** until a separate authorized deployment.

## Staging setup needed before any backend deployment

1. Identify the specific Render web service and the correct Supabase project by checking the configured host/project reference in their official dashboards, without copying credentials into chat.
2. In a **new staging service**, set `SUPABASE_URL`, `SUPABASE_KEY` (server-side only), and a **unique random** `SECRET_KEY` of at least 32 characters.
3. Ensure this signing secret is not accidentally different from what the intended staging accounts use. **Changing the existing production secret would invalidate production JWT sessions**; rotate only with a separate approved production release plan.
4. Confirm the `users` table exists and has correct read permissions, and that the staging database is isolated from production. Do not point a staging test service at a production database for write-tests.
5. Build and deploy the backend to staging only. Call GET `/healthz` (must be liveness) and GET `/readyz` (must reflect DB readiness).
6. Verify unauthenticated requests to `GET /donations` and `GET /donations/{id}` are rejected, **without trying to enumerate donor records**.
7. Use a dedicated staging admin test account and non-sensitive data to verify role boundaries (client cannot access admin; admin can manage only intended objects).
8. Configure a branch-specific Vercel Preview environment variable `REACT_APP_ADMIN_API_URL` to target staging Render. Do not change the project's production environment variable.
9. Test login, admin, published/unpublished CMS, bilingual navigation, donation enquiry and membership email draft. Check responsive layouts in authenticated browser testing.
10. Review the security measures still needed before production: login/registration/donation rate limits, CORS allowlist, protected backup/recovery, access-token lifetime, RLS and Data API grants. A service-role key bypasses Supabase RLS, so **backend role authorization remains critical**.
11. Only after tests and explicit approval, plan a rollback-safe production release.

## Current blockers

- Correct Supabase project identity + its RLS/grants/security advisors not yet verified
- Render connector/service access missing
- Real staging backend not provisioned
- 19 missing local team-photo files and official member content not verified
- Membership application database endpoint/schema not authorized
- Browser testing behind Vercel SSO not completed

**This file contains no credentials and instructs no production changes.**
