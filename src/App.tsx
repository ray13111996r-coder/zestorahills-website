/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { ContactQuotePage } from './components/ContactQuotePage';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { StoryPage } from './components/StoryPage';
import { HERO_IMAGE, PRODUCTS } from './data/products';
import { supabase } from './supabase';
import { CartItem, PackSize, PageRoute, Product } from './types';

const CART_STORAGE_KEY = 'zestora_hills_cart_v1';


const SUPPORTED_PACK_SIZES: PackSize[] = ['50g', '100g', '200g', '500g'];

function normalizeProductName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function mapDatabaseProduct(row: any): Product {
  const aliases: Record<string, string> = {
    blackpepper: 'whole-black-pepper',
    bayleaf: 'dried-bay-leaf',
  };
  const normalized = normalizeProductName(String(row.name ?? ''));
  const staticProduct = PRODUCTS.find(
    (product) =>
      normalizeProductName(product.name) === normalized ||
      product.id === aliases[normalized]
  );
  const variants = Array.isArray(row.product_variants) ? row.product_variants : [];
  const activePacks: Partial<Record<PackSize, { size: PackSize; priceInr: number; sku: string; stockQuantity?: number; isActive?: boolean }>> = {};
  for (const variant of variants) {
    const size = String(variant.pack_size) as PackSize;
    if (!SUPPORTED_PACK_SIZES.includes(size)) continue;
    activePacks[size] = {
      size,
      priceInr: Number(variant.price) || 0,
      sku: String(variant.sku ?? ''),
      stockQuantity: variant.stock_quantity == null ? undefined : Number(variant.stock_quantity),
      isActive: Boolean(variant.is_active),
    };
  }
  const category = ['Whole Spices', 'Estate Coffee', 'Infused Teas', 'Aromatics & Herbs'].includes(row.category)
    ? row.category
    : 'Whole Spices';
  const defaultPack: PackSize = category === 'Estate Coffee' ? '500g' : '50g';
  const base: Product = staticProduct ?? {
    id: `db-${row.id}`,
    supabaseId: String(row.id),
    slug: normalizeProductName(String(row.name ?? 'product')),
    name: String(row.name ?? 'Zestora Hills Product'),
    botanicalName: '',
    category,
    origin: 'Western Ghats',
    elevation: '',
    grade: 'Carefully selected',
    harvestSeason: '',
    shortNote: 'Carefully selected by Zestora Hills.',
    description: 'A carefully selected product from the Zestora Hills collection.',
    tastingNotes: [],
    culinaryUses: 'Explore serving and preparation ideas.',
    specHighlight: 'Zestora Hills Collection',
    image: HERO_IMAGE,
    imageAlt: String(row.name ?? 'Zestora Hills product'),
    packs: { [defaultPack]: { size: defaultPack, priceInr: 0, sku: '' } },
  };
  return {
    ...base,
    id: staticProduct?.id ?? base.id,
    supabaseId: String(row.id),
    name: String(row.name ?? base.name),
    category,
    packs: Object.keys(activePacks).length > 0 ? activePacks : base.packs,
  };
}

function readInitialRoute(): PageRoute {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash === 'story' || hash === 'contact') {
    return hash;
  }
  return 'home';
}

function readInitialCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) =>
        item?.packSize === '250g' ? { ...item, packSize: '200g' as PackSize } : item
      )
      .filter(
        (item): item is CartItem =>
          typeof item?.productId === 'string' &&
          (['50g', '100g', '200g', '500g'].includes(item?.packSize)) &&
          typeof item?.quantity === 'number' &&
          item.quantity > 0
      );
  } catch {
    return [];
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<PageRoute>(readInitialRoute);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>(readInitialCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [inspectedProduct, setInspectedProduct] = useState<{
    product: Product;
    pack: PackSize;
  } | null>(null);


  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let cancelled = false;
    const loadCatalog = async () => {
      const { data, error } = await client
        .from('products')
        .select('id,name,category,is_active,product_variants(pack_size,price,sku,stock_quantity,is_active)')
        .eq('is_active', true);
      if (error || !data || cancelled) return;
      const databaseProducts = data.map((row: any) => mapDatabaseProduct(row));
      const combined = databaseProducts;
      if (combined.length > 0 && !cancelled) setCatalogProducts(combined);
    };
    void loadCatalog();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors in restricted sandboxes
    }
  }, [cartItems]);

  useEffect(() => {
    const onHashChange = () => {
      setActivePage(readInitialRoute());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (page: PageRoute) => {
    setActivePage(page);
    const targetHash = page === 'home' ? '#shop' : `#${page}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    if (activePage !== 'home') {
      setActivePage('home');
      window.history.pushState(null, '', '#shop');
      window.setTimeout(() => {
        document.getElementById('retail-catalog')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById('retail-catalog')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = (product: Product, packSize: PackSize, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.packSize === packSize
      );
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId: product.id, packSize, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, packSize: PackSize, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.packSize === packSize
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (productId: string, packSize: PackSize) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.packSize === packSize))
    );
  };

  const clearCart = () => setCartItems([]);

  const totalBagCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#F3EBDD] text-[#173C2B]">
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        cartCount={totalBagCount}
        onOpenCart={() => setCartOpen(true)}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <Hero
              onShopRetail={scrollToCatalog}
            />

            <ProductCatalog
              products={catalogProducts}
              onAddToCart={(product, packSize) => addToCart(product, packSize, 1)}
              onInspectProduct={(product, pack) => setInspectedProduct({ product, pack })}
            />


          </>
        )}

        {activePage === 'story' && (
          <StoryPage
            onShopRetail={scrollToCatalog}
          />
        )}

        {activePage === 'contact' && <ContactQuotePage />}
      </main>

      <Footer onNavigate={navigateTo} />

      <CartDrawer
        products={catalogProducts}
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onClearCart={clearCart}
        onBrowseShop={scrollToCatalog}
      />

      <ProductDetailModal
        product={inspectedProduct?.product ?? null}
        initialPack={inspectedProduct?.pack ?? '100g'}
        onClose={() => setInspectedProduct(null)}
        onAddToCart={(product, packSize, qty) => {
          addToCart(product, packSize, qty);
          setCartOpen(true);
        }}
      />
    </div>
  );
}
