create table catalogs(
  id uuid not null primary key,
  name text not null,
  description text not null,
  created_at timestamptz
)
