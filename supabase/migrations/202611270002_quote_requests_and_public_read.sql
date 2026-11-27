-- Public storefront access policies and enquiry form storage.
begin;

alter table public.products enable row level security;
alter table public.product_variants enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='products' and policyname='Public can view active products') then
    create policy "Public can view active products" on public.products
      for select to anon, authenticated using (active = true);
  end if;
  drop policy if exists "Public can view active variants" on public.product_variants;
  create policy "Public can view active variants" on public.product_variants
    for select to anon, authenticated using (
      exists (select 1 from public.products p where p.id = product_id and p.active = true)
    );
end $$;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  full_name text not null,
  company text,
  email text not null,
  phone text not null,
  destination text,
  inquiry_mode text not null,
  estimated_volume text,
  packaging text,
  products text[] not null default '{}',
  message text,
  created_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='quote_requests' and policyname='Visitors can submit quote requests') then
    create policy "Visitors can submit quote requests" on public.quote_requests
      for insert to anon, authenticated with check (
        length(trim(full_name)) > 0 and length(trim(email)) > 0 and length(trim(phone)) > 0
      );
  end if;
end $$;

-- No public SELECT, UPDATE, or DELETE policy is created for customer enquiries.

commit;
