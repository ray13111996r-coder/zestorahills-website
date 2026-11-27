# Zestora Hills Supabase setup

## Required public environment variables

Set these in GitHub Actions variables and in any local `.env.local` file:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use only the Supabase anon/publishable key in the browser. Never add a service-role key to Vite variables or commit it to Git.

## Catalogue migration

Review `supabase/migrations/202611270001_zestora_hills_catalogue.sql` against the live table definitions, then run it in Supabase SQL Editor. It seeds the 14 agreed products, deactivates dried rosemary, preserves existing 100g/200g prices and adds new variants as price 0/inactive.

The storefront reads active products and active variants from Supabase. Set `products.active=false` to hide a product. Set `product_variants.is_active=false` to disable a pack. Update `price` and `stock_quantity` to manage price and inventory.

## Orders and payments

The storefront calls the existing `create-order` Edge Function. Confirm that function validates product UUIDs, active variants, prices and stock on the server before accepting an order. UPI/card collection is not enabled by this frontend alone; integrate and verify a payment gateway before describing online payments as live.
