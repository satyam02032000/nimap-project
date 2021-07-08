create table products(
  id uuid not null primary key,
  catalog_id uuid not null,  -- TODO: prefer foreign key
  name text not null,
  description text not null,
  created_at timestamptz
);

-- shall be used to query products for a catalog
create index idx_products_category_id on products(catalog_id);
