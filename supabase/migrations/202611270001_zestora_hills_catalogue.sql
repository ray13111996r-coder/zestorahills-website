-- Zestora Hills catalogue migration
-- Assumes the existing public.products and public.product_variants tables described in the project.
-- This script preserves existing 100g/200g prices. New pack variants are inserted inactive with price 0
-- so they cannot be purchased until the owner sets a real price and activates them.
begin;

-- Normalize existing legacy catalogue names and categories.
update public.products set name='Black Pepper', category='Whole Spices' where lower(name) in ('whole black pepper','black pepper');
update public.products set name='Green Cardamom', category='Whole Spices' where lower(name)='green cardamom';
update public.products set category='Whole Spices' where lower(name) in ('cinnamon','star anise','dried ginger','nutmeg','cloves','bay leaf','dried bay leaf');
update public.products set name='Whole Roasted Coffee Beans', category='Estate Coffee' where lower(name) in ('roasted coffee beans','whole roasted coffee beans');
update public.products set active=false where lower(name)='dried rosemary';

-- Whole roasted beans are sold only in the agreed 500g format; retain historic prices but disable old sizes.
update public.product_variants set is_active=false
where product_id=(select id from public.products where name='Whole Roasted Coffee Beans' limit 1)
  and pack_size in ('100g','200g');

-- Add the full current collection if a product name is not already present.
insert into public.products (name, category, active)
select v.name, v.category, true
from (values
  ('Black Pepper','Whole Spices'),
  ('Green Cardamom','Whole Spices'),
  ('Cinnamon','Whole Spices'),
  ('Star Anise','Whole Spices'),
  ('Dried Ginger','Whole Spices'),
  ('Nutmeg','Whole Spices'),
  ('Cloves','Whole Spices'),
  ('Bay Leaf','Whole Spices'),
  ('Espresso Coffee – Arabica & Robusta Blend','Estate Coffee'),
  ('South Indian Filter Coffee – Arabica & Robusta Blend','Estate Coffee'),
  ('Whole Roasted Coffee Beans','Estate Coffee'),
  ('Hibiscus Infusion Tea','Infused Teas'),
  ('Blue Pea Infusion Tea','Infused Teas'),
  ('Lemongrass Infusion Tea','Infused Teas')
) as v(name, category)
where not exists (select 1 from public.products p where lower(p.name)=lower(v.name));

-- Insert newly introduced variants as inactive placeholders. Existing variants/prices are untouched.
insert into public.product_variants (product_id, pack_size, price, sku, stock_quantity, is_active)
select p.id, v.pack_size, 0, v.sku, 0, false
from (values
  ('Black Pepper','50g','ZH-BLK-50'),
  ('Green Cardamom','50g','ZH-CRD-50'),
  ('Cinnamon','50g','ZH-CIN-50'),
  ('Star Anise','50g','ZH-STA-50'),
  ('Dried Ginger','50g','ZH-GNG-50'),
  ('Nutmeg','50g','ZH-NTM-50'),
  ('Cloves','50g','ZH-CLV-50'),
  ('Bay Leaf','50g','ZH-BAY-50'),
  ('Espresso Coffee – Arabica & Robusta Blend','500g','ZH-ESP-500'),
  ('South Indian Filter Coffee – Arabica & Robusta Blend','500g','ZH-SIF-500'),
  ('Whole Roasted Coffee Beans','500g','ZH-WRB-500'),
  ('Hibiscus Infusion Tea','50g','ZH-HIB-50'),
  ('Blue Pea Infusion Tea','50g','ZH-BPT-50'),
  ('Lemongrass Infusion Tea','50g','ZH-LEM-50')
) as v(product_name, pack_size, sku)
join public.products p on p.name=v.product_name
where not exists (
  select 1 from public.product_variants pv
  where pv.product_id=p.id and pv.pack_size=v.pack_size
);

commit;
