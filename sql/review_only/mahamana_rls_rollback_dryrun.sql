-- REVIEW-ONLY RLS DRY RUN: ALWAYS ROLLS BACK
-- Target (visually confirmed): Mahamana / ncqpxyiuqlrnfuurvzah / Production
-- DO NOT CHANGE THE LAST ROLLBACK TO COMMIT.
-- In an isolated staging copy with verified backend-only service_role access,
-- this demonstrates proposed hardening; it is NOT a production migration.
-- PUBLIC website accesses content using FastAPI, not browser-side Supabase JS.
-- Confirm actual grants and policies with the separate read-only audit FIRST.
-- If any table is not present, the transaction fails; do not edit around it.
begin;
set local lock_timeout = '3s';
set local statement_timeout = '30s';

-- Every table in the screenshot resides in the Data API's public schema.
-- RLS protects direct API access, even when a grant is later re-introduced.
alter table public.activities enable row level security;
alter table public.blogs enable row level security;
alter table public.donations enable row level security;
alter table public.events enable row level security;
alter table public.gallery enable row level security;
alter table public.members enable row level security;
alter table public.news enable row level security;
alter table public.pages enable row level security;
alter table public.store enable row level security;
alter table public.users enable row level security;
alter table public.videos enable row level security;

-- This architecture uses a server-side Supabase secret/service-role client.
-- No direct browser database access is required for these tables.
-- service_role is NOT revoked; FastAPI role checks still must be audited.
revoke all privileges on table
  public.activities, public.blogs, public.donations, public.events,
  public.gallery, public.members, public.news, public.pages,
  public.store, public.users, public.videos
from anon, authenticated;

-- Inspect only metadata for the proposed state, within this transaction.
select
  c.relname as table_name,
  c.relrowsecurity as proposed_rls_enabled,
  has_table_privilege('anon', c.oid, 'SELECT') as proposed_anon_select,
  has_table_privilege('authenticated', c.oid, 'SELECT') as proposed_authenticated_select
from pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'activities', 'blogs', 'donations', 'events', 'gallery',
    'members', 'news', 'pages', 'store', 'users', 'videos'
  )
order by c.relname;

-- SAFETY: never persist the above changes in this file.
rollback;
