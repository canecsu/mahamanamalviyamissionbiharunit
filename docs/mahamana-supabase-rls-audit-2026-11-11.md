# Mahamana Supabase RLS security audit — review-only plan

**Confirmed project:** Mahamana, Project Ref \`ncqpxyiuqlrnfuurvzah\`, organization "canecsu's Org". The user's Supabase production screenshot and read-only browser tab both confirm this identifier. This is **not** any of the other Supabase projects connected to ChatGPT.

## Confirmed from the open table editor (11 November 2026)
- Public schema contains **11 tables**: \`activities\`, \`blogs\`, \`donations\`, \`events\`, \`gallery\`, \`members\`, \`news\`, \`pages\`, \`store\`, \`users\`, \`videos\`.
- Table editor labels them **Unrestricted**; for the selected \`members\` table, **RLS disabled** is explicit.
- The \`members\` table shows **0 records** at the time of the screenshot; no conclusion is made about other tables.
- Private tables \`users\` and \`donations\` may contain contact details, donor records, and password hashes. **Do not export or paste their rows to any chat.**
- Risk: tables in an exposed schema without RLS are accessible to API roles **if those roles have database grants**. Actual \`anon\` and \`authenticated\` grants/active policies have NOT yet been audited through the project connector. The screenshot does not prove that user/donor data has been accessed.

## Connected-account limitation
- The accessible Supabase connectors currently point to other organizations/projects; \`get_project(ncqpxyiuqlrnfuurvzah)\` returned **permission denied** from all three connections.
- The user's browser has an authenticated Supabase tab that can be read, but browser *control* is not available in this Chat mode. We did not run SQL, click Apply/Insert, or edit production.
- Connect the Supabase account belonging to **canecsu's Org** via ChatGPT Settings → Plugins → Supabase and authorize the specific Mahamana project. No passwords or API keys should be sent in chat.

## Source architecture audit
- FastAPI uses \`supabase.create_client(SUPABASE_URL, SUPABASE_KEY)\`, explicitly expecting a server-only \`service_role\`/secret key.
- React package dependencies do not declare a Supabase client. Public pages access FastAPI endpoints.
- Therefore the default proposed model is **no direct \`anon\` or Supabase \`authenticated\` Data API privileges on these application tables**; the FastAPI backend must authenticate requests and filter published content.
- Supabase \`auth.users\` is separate from custom \`public.users\` in this codebase. The backend stores and checks credentials in its own \`public.users\` table; this **does not automatically integrate with Supabase Auth or \`auth.uid()\`**. Do not add client-owned \`auth.uid()\` RLS policies without redesigning authentication.

## Prepared SQL — NOT APPLIED
- \`sql/review_only/mahamana_rls_readonly_audit.sql\`: metadata-only SQL to check RLS, grants and policy names. Reads no application row data.
- \`sql/review_only/mahamana_rls_rollback_dryrun.sql\`: enables RLS and revokes \`anon\`/\`authenticated\` grants for the 11 confirmed tables **inside a transaction that ends in ROLLBACK**. Useful to inspect expected state in authorized staging. **Not a migration; never replace ROLLBACK with COMMIT casually.**
- Do not execute either on the user's Production project through ChatGPT until the right connector is available and the user explicitly authorizes that read/write action.

## Release gates
1. Confirm correct Supabase project access and run only the read-only metadata SQL.
2. Check Data API exposure settings, grants, \`pg_policies\`, existing role grants, backend service-role use, views/functions and backups.
3. Build **isolated staging** database and Render backend, with test users and fake records only; avoid production cross-writes.
4. Apply a reviewed migration to staging, then verify all 11 RLS states, grants, role denials, server-side content and admin functions.
5. Ensure \`service_role\` access remains server-side only and that \`anon\`/Supabase \`authenticated\` cannot query \`public.users\` or \`public.donations\`.
6. Follow the **current Supabase 2026 behavior**: Data API auto-grants changed in 2026. Review explicit role grants and default privileges; merely enabling RLS does not remove grants.
7. Verify that \`auth.register\`, content publication filters, login, donation enquiries and Admin CRUD work against staging with a deliberate role model. Audit rate limiting.
8. Generate a versioned \`supabase migration new ...\` using the installed CLI, review changes, run \`supabase test db\`, and obtain explicit final approval **before** applying anything to production.
9. Since Render auto-deploys on changes to \`main\`, never merge any of the stacked PRs as a side-effect of database inspection.

## Reference
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/api/securing-your-api
