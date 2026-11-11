# Mahamana Bihar — staging launch checklist (approval required)

**Status:** preparation only; NO staging cloud resources created, NO production changes.
**Production Supabase:** `ncqpxyiuqlrnfuurvzah` (must NOT be the staging project).
**Production Render:** `srv-d7aeumvfte5s73b3lnog` / `mahamanamalviyamissionbiharunit.onrender.com` (must NOT be reused for staging).
**Staging GitHub branch:** `chore/mmm-staging-readiness-20261111`, based on Draft PR #6.

## 1 — Actual account environment checked

- Supabase organization has **two existing active projects**: Mahamana and Canecsu Project.
- Supabase `list_branches` returned **zero** branches for Mahamana.
- Supabase `list_migrations` returned **zero** migration records. A newly created **dashboard branch** may need a schema dump to reproduce the production structure, rather than replaying migration history. Verify all eleven tables and ten sequences after creation.
- Supabase live Security Advisor identified disabled RLS on **11/11** public tables. Direct `anon` and `authenticated` grants allow SELECT/INSERT/UPDATE/DELETE. This is a **confirmed critical security issue**. Existing production data and permissions must not be modified without approval and backups.
- Render workspace `tea-d7aeb52dbo4c73a5f4l0` has **one existing Free web service** linked to `main`, with auto-deploy enabled.
- Production Render service has an unresolved upstream Supabase hostname/DNS error in logs. Environment values have NOT been inspected or changed.

## 2 — Cost quotes obtained from the connected organization (do not assume free)

Quoted by Supabase's `get_cost` for organization `oeftayamehfibxcweaxt`:

| Option | Account-specific quote | Notes |
|---|---|---|
| Development branch | **USD $0.01344/hour** | Compute and other usage apply; branch must be deleted after testing. Cost needs explicit user acceptance. |
| Standalone project | **USD $0/month** | Quote is not proof that a third Free project is eligible: the org already has 2 active projects, and the current Free plan ordinarily limits 2. Confirm availability and that no tier upgrade is required before creation. |

Render: Free web services are possible but share included usage limits, and a new service must be separately authorized before creation. Do NOT create any services or enable billing automatically.

**Preferred option to request approval for:** Supabase development branch at the quoted hourly cost, plus a separate Render Free staging web service only if the service creation screen/account confirms Free availability and no additional charges. Branch data is empty by default.

## 3 — Safe setup steps AFTER the user approves costs and resources

1. Create a Supabase Development Branch named `mahamana-staging-security-review` (explicit quote acceptance first). Never use the production project ID as the staging target for SQL mutations.
2. Confirm branch gets a **different Supabase Project Ref** and has **no production rows**, no copied production storage and no public user/donor data.
3. Validate all eleven tables and ten sequences exist. Since production migrations list is empty, check schema recreation carefully; if needed, build a **schema-only, no-data** migration through a reviewed process. Do not copy users, password hashes, donation records, transactions or uploaded private files.
4. Configure a new Render Web Service **only after cost/resource approval**. Use the GitHub staging branch, `rootDir=backend`, `buildCommand=pip install -r requirements.txt`, `startCommand=uvicorn main:app --host 0.0.0.0 --port 10000`. It must **NOT** use the Production branch or Production environment variables.
5. Configure **only staging** service environment variables in Render's private Environment UI:
   - `SUPABASE_URL` = staging branch API URL (**not** production)
   - `SUPABASE_KEY` = unique staging **server-side** credential; do not paste or expose it in GitHub
   - `SECRET_KEY` = new random string of at least 32 characters; independent from Production
   - `EXPECTED_SUPABASE_PROJECT_REF` = staging branch's ref, not production ref
   - `CORS_ALLOWED_ORIGINS` = approved Vercel Preview origin(s)
6. Set Vercel `REACT_APP_ADMIN_API_URL` **only for the approved Preview branch** to the NEW staging Render URL. Never overwrite Production variable values.
7. Perform basic `GET /healthz`, `GET /readyz` and authorization read-only probes using the guarded tool in this PR.
8. Apply a reviewed **staging** migration to enable RLS, remove direct `anon` and `authenticated` grants on eleven tables and sequences, and review default grants. **DO NOT copy or blindly run the approval-required ROLLBACK review SQL in Production.** The existing SQL file is a dry-run proposal, not a deployable migration.
9. Verify donor record access is denied to anonymous users; separately test custom JWT login/admin roles using synthetic test accounts, not real members.
10. Re-check security advisors on staging, then prepare a rollback, a full backup/recovery method and an explicit Production rollout approval.

## 4 — Smoke checks packaged now (no cloud resource required)

**Tool:** `python3 -m staging.smoke_check`

Only run after the staging Backend actually exists. This tool deliberately REFUSES Production URLs and the Production Supabase Ref. Required vars:

```bash
export CONFIRM_STAGING_ONLY=YES
export STAGING_SUPABASE_REF="<DIFFERENT_STAGING_REF>"
export STAGING_BACKEND_URL="https://mmm-bihar-staging.onrender.com"
export STAGING_FRONTEND_ORIGIN="https://YOUR-APPROVED-PREVIEW.vercel.app"
python3 -m staging.smoke_check
```

The command uses only GET and OPTIONS. It checks liveness/readiness, unpublished content filtering, private donor/Admin route denial and Preview CORS. It prints only PASS/FAIL outcomes, not database rows.

**Offline safety tests:** `python3 -m unittest tests.test_staging_safety -v`.

## 5 — Blockers and confirmations

- Supabase branch cost has **not** been approved in chat: $0.01344/hour plus usage.
- Creation of a new Render service is **not** authorized yet, even if a Free plan is selectable.
- Production data is **not** to be copied to staging; synthetic records only.
- An account-specific Supabase project quote of $0/month exists, but a third free active project may be blocked; do not attempt to upgrade the account or subscribe to a plan.
- Render production has `autoDeploy=yes` on `main`; do not merge any of the stacked Draft PRs inadvertently.

Official references:
- https://supabase.com/docs/guides/deployment/branching
- https://supabase.com/docs/guides/platform/manage-your-usage/branching
- https://supabase.com/docs/guides/platform/billing-on-supabase
- https://render.com/docs/free
