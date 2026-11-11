-- READ-ONLY SECURITY INVENTORY (review SQL, no mutations)
-- Supabase Dashboard > Project: Mahamana / ncqpxyiuqlrnfuurvzah
-- Use only on the verified project. This reads metadata, NOT row contents.
-- Run manually by an authorized project admin after reviewing the SQL.
-- Do not paste user records, password hashes, secrets or API keys into chat.

select
  current_database() as database_name,
  current_user as connected_role;

select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as force_rls,
  has_table_privilege('anon', c.oid, 'SELECT') as anon_can_select,
  has_table_privilege('anon', c.oid, 'INSERT') as anon_can_insert,
  has_table_privilege('anon', c.oid, 'UPDATE') as anon_can_update,
  has_table_privilege('anon', c.oid, 'DELETE') as anon_can_delete,
  has_table_privilege('authenticated', c.oid, 'SELECT') as authenticated_can_select,
  has_table_privilege('authenticated', c.oid, 'INSERT') as authenticated_can_insert,
  has_table_privilege('authenticated', c.oid, 'UPDATE') as authenticated_can_update,
  has_table_privilege('authenticated', c.oid, 'DELETE') as authenticated_can_delete
from pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind in ('r', 'p')
  and c.relname in (
    'activities', 'blogs', 'donations', 'events', 'gallery',
    'members', 'news', 'pages', 'store', 'users', 'videos'
  )
order by c.relname;

select
  tablename, policyname, cmd, roles, permissive
from pg_catalog.pg_policies
where schemaname = 'public'
  and tablename in (
    'activities', 'blogs', 'donations', 'events', 'gallery',
    'members', 'news', 'pages', 'store', 'users', 'videos'
  )
order by tablename, policyname;

-- Private data is intentionally NOT selected.
