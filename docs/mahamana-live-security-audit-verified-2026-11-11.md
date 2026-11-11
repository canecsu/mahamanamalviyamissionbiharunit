# Mahamana Supabase — Verified live metadata audit (11 November 2026)

**Important: Production was read-only throughout this audit. No SQL DDL/DML has been run.**
**Project:** `Mahamana`, ref `ncqpxyiuqlrnfuurvzah`, org `canecsu's Org`, region `ap-northeast-1`.
**State:** `ACTIVE_HEALTHY`, PostgreSQL major 17.

## Actual findings, retrieved from newly connected Supabase project

Directly from the project's schema API, Security Advisors and **read-only SQL on catalog metadata**:

| Finding | Grounded result |
|---|---|
| Tables in public | 11: `users`, `pages`, `gallery`, `members`, `news`, `activities`, `events`, `blogs`, `videos`, `store`, `donations` |
| RLS | **Disabled for 11/11** |
| Existing public RLS policies | **0** |
| `anon` privileges on all 11 | **SELECT, INSERT, UPDATE, DELETE = TRUE** |
| `authenticated` privileges on all 11 | **SELECT, INSERT, UPDATE, DELETE = TRUE** |
| `service_role` privileges on all 11 | **SELECT, INSERT, UPDATE, DELETE = TRUE** |
| `service_role` RLS bypass | **TRUE** |
| Existing sequences | 10 table-ID sequences (except UUID-based users) |
| Sequence access | `anon` and `authenticated` each have USAGE on all 10 |
| Future defaults | `postgres` and `supabase_admin` default ACL entries in `public` grant broad table/sequence/function access to `anon`, `authenticated` and `service_role` |
| Security Advisor | `rls_disabled_in_public` 11 ERROR; `pg_graphql_anon_table_exposed` 11 WARN; `pg_graphql_authenticated_table_exposed` 11 WARN |
| Performance Advisor | No findings returned during audit |

Sensitive schema columns (names only; **no rows were queried**):
- `public.users`: `email`, `password_hash`, `role`, and related fields.
- `public.donations`: `donor_name`, `email`, `phone`, `amount`, `transaction_id`, and `message`.

**Risk assessment:** the privilege checks show an authenticated or anonymous Data API Postgres role is *permitted* to read/write these exposed tables and RLS is not currently restricting any rows. This is a confirmed high-severity configuration risk, not just a cosmetic warning. It does **not** establish that data has already been accessed or stolen.

## Application architecture to preserve

- React frontend accesses FastAPI endpoints and has no Supabase SDK dependency.
- FastAPI uses server-side Supabase credentials and a custom JWT for application users. `public.users` is **not** equivalent to Supabase Auth's `auth.users`.
- The FastAPI backend must receive a valid server-side `service_role`/secret key in Render; **its current environment values have not been inspected**. The project's catalog confirms `service_role` bypasses RLS and retains DML privileges, but this does not prove Render currently has that key.
- Render previously logged an upstream DNS lookup error. Verify `SUPABASE_URL` privately matches **`https://ncqpxyiuqlrnfuurvzah.supabase.co`** and not the database hostname, any other project ref or placeholder. Never paste API keys or JWT secrets in chat.
- Render has `autoDeploy=yes` from `main`; any merge can deploy backend automatically.

## Prepared but NOT executed

`sql/approval_required/mahamana_verified_rls_hardening_DRY_RUN_ONLY.sql` is a proposal that:
1. Checks the 11 expected table names, server role capability, and transaction timeouts.
2. Enables RLS on all 11 application tables.
3. Revokes all table privileges from the direct `anon` and Supabase `authenticated` roles.
4. Revokes usage of 10 corresponding sequences from the same roles.
5. Proposes removing broad **future** default privileges in `public` for object creators `postgres` and `supabase_admin`.
6. Checks within the transaction that direct roles were blocked while `service_role` retained access.
7. **Always ends with ROLLBACK.** It has a staging-only safety guard and cannot be run as a production migration in its current state.

These changes could affect any unknown clients calling Supabase directly (including integrations outside this GitHub repo), so **staging tests and explicit production authorization are mandatory**.

## Remaining pre-production gates

1. Confirm Render service's `SUPABASE_URL` host/project reference privately and confirm service-side key role, without revealing or rotating secrets.
2. Confirm whether there are external consumers of Supabase's `anon` or `authenticated` Data API outside this website. Revoke only after affected consumers are understood.
3. Verify the database can be backed up and restored. Project is on a free org according to the dashboard; check current backup entitlements and arrange an approved backup independently, if necessary.
4. Create an **isolated staging** Supabase project/copy (with synthetic or scrubbed data only) and staging Render service. Do not test destructive commands on production.
5. Check the proposed changes using staging, including the default-grants commands' permissions for `supabase_admin`.
6. Validate `/readyz`, custom JWT login, `/auth/register`, /admin CRUD, public content `published` filtering, donor-data access, and multilingual Preview frontend.
7. Run Security Advisors again; validate no direct `anon` or `authenticated` table privileges and no future default grants open access.
8. Only with explicit final user approval and a prepared rollback, create a formal versioned migration and apply to Production in a controlled window.
9. Keep `service_role` confined to the trusted backend. If exposure of service-role credentials is suspected, rotate it through a separate approved process.

**No production schema modifications, no donor/user records accessed, no production deployment, and no GitHub main merge occurred in this task.**

### Official references
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Securing the Data API](https://supabase.com/docs/guides/api/securing-your-api)
- [Security Advisor: RLS disabled in public](https://supabase.com/docs/guides/database/database-linter?lint=0013_rls_disabled_in_public)
