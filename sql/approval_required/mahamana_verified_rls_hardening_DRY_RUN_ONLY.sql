-- MAHAMANA SECURITY HARDENING CANDIDATE — NOT FOR PRODUCTION EXECUTION
-- Verified project: ncqpxyiuqlrnfuurvzah (Production).
-- This is an explicit review/dry-run script: the final ROLLBACK is mandatory.
-- DO NOT replace it with COMMIT without an approved maintenance window,
-- verified backups, a staging integration test and explicit owner approval.
-- Tables and sequences grounded in live read-only metadata on 2026-11-11.
--
-- Current application model: public site -> FastAPI backend -> Supabase
-- server-side service_role. The React frontend has no direct Supabase client.
-- Do not execute against production merely to test this statement.

begin;
set local lock_timeout = '3s';
set local statement_timeout = '30s';

-- Block accidental execution when the operator has not explicitly reviewed
-- that this is the intended staging environment.
do $$
begin
  if current_setting('app.mahamana_staging_review', true) is distinct from 'confirmed' then
    raise exception 'STOP: set LOCAL app.mahamana_staging_review = confirmed only in an isolated staging database';
  end if;
end $$;

-- Even in staging, fail if the expected schema or privileged service account
-- is missing before acquiring table locks.
do $$
declare found_tables integer;
begin
  select count(*) into found_tables
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind in ('r', 'p')
    and c.relname = any(array[
      'activities','blogs','donations','events','gallery','members',
      'news','pages','store','users','videos'
    ]);
  if found_tables <> 11 then
    raise exception 'Expected 11 Mahamana application tables, found %', found_tables;
  end if;
  if not (select rolbypassrls from pg_catalog.pg_roles where rolname='service_role') then
    raise exception 'service_role RLS behavior is different; stop and review';
  end if;
end $$;

-- Enable RLS (with zero policies), preventing direct anon/authenticated row
-- access, including on tables that are intentionally public via FastAPI.
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

-- Remove even the privilege to read, insert, alter or delete content directly.
-- Browser never needs these privileges in the present FastAPI architecture.
revoke all privileges on table
  public.activities,public.blogs,public.donations,public.events,
  public.gallery,public.members,public.news,public.pages,
  public.store,public.users,public.videos
from anon, authenticated;

-- All ten public sequences were confirmed to be accessible to both roles.
-- Revoke sequence access too; service_role is intentionally left intact.
revoke all privileges on sequence
  public.activities_id_seq,public.blogs_id_seq,public.donations_id_seq,
  public.events_id_seq,public.gallery_id_seq,public.members_id_seq,
  public.news_id_seq,public.pages_id_seq,public.store_id_seq,
  public.videos_id_seq
from anon, authenticated;

-- Future default privileges are open in current public schema as well.
-- These changes must be verified on staging, including ownership permissions.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
alter default privileges for role supabase_admin in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role supabase_admin in schema public
  revoke all on sequences from anon, authenticated;

-- Privilege-only verification: no application rows or secret data are read.
do $$
declare exposed integer;
declare remaining_sequences integer;
declare service_lost integer;
begin
  select count(*) into exposed
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind in ('r', 'p')
    and c.relname = any(array[
      'activities','blogs','donations','events','gallery','members',
      'news','pages','store','users','videos'
    ])
    and (
      not c.relrowsecurity
      or has_table_privilege('anon', c.oid, 'SELECT')
      or has_table_privilege('anon', c.oid, 'INSERT')
      or has_table_privilege('anon', c.oid, 'UPDATE')
      or has_table_privilege('anon', c.oid, 'DELETE')
      or has_table_privilege('authenticated', c.oid, 'SELECT')
      or has_table_privilege('authenticated', c.oid, 'INSERT')
      or has_table_privilege('authenticated', c.oid, 'UPDATE')
      or has_table_privilege('authenticated', c.oid, 'DELETE')
    );
  if exposed <> 0 then
    raise exception 'Access review failed: % application table(s) still have unwanted privileges or RLS disabled', exposed;
  end if;

  select count(*) into remaining_sequences
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where n.nspname='public' and c.relkind='S'
    and c.relname = any(array[
      'activities_id_seq','blogs_id_seq','donations_id_seq','events_id_seq',
      'gallery_id_seq','members_id_seq','news_id_seq','pages_id_seq',
      'store_id_seq','videos_id_seq'
    ])
    and (
      has_sequence_privilege('anon', c.oid, 'USAGE')
      or has_sequence_privilege('authenticated', c.oid, 'USAGE')
      or has_sequence_privilege('anon', c.oid, 'SELECT')
      or has_sequence_privilege('authenticated', c.oid, 'SELECT')
    );
  if remaining_sequences <> 0 then
    raise exception 'Sequence review failed: % sequences still reachable', remaining_sequences;
  end if;

  select count(*) into service_lost
  from pg_catalog.pg_class c
  join pg_catalog.pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind in ('r','p')
    and c.relname = any(array[
      'activities','blogs','donations','events','gallery','members',
      'news','pages','store','users','videos'
    ])
    and (
      not has_table_privilege('service_role', c.oid, 'SELECT')
      or not has_table_privilege('service_role', c.oid, 'INSERT')
      or not has_table_privilege('service_role', c.oid, 'UPDATE')
      or not has_table_privilege('service_role', c.oid, 'DELETE')
    );
  if service_lost <> 0 then
    raise exception 'STOP: service_role lost expected access to % tables', service_lost;
  end if;
end $$;

-- Mandatory safe ending. The script is only a staging demonstration.
rollback;
