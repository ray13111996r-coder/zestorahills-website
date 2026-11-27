/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { CartDrawer } from './components/CartDrawer';
import { ContactQuotePage } from './components/ContactQuotePage';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductImage } from './components/ProductImage';
import { StoryPage } from './components/StoryPage';
import { WholesalePage } from './components/WholesalePage';
import { BRAND_CONTACT, HERO_IMAGE, PRODUCTS, STORY_IMAGE } from './data/products';
import { supabase } from './supabase';
import { CartItem, PackSize, PageRoute, Product, QuotePrefill } from './types';

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
  const activePacks: Partial<Record<PackSize, { size: PackSize; priceInr: number; sku: string }>> = {};
  for (const variant of variants) {
    const size = String(variant.pack_size) as PackSize;
    if (!SUPPORTED_PACK_SIZES.includes(size) || !variant.is_active) continue;
    activePacks[size] = {
      size,
      priceInr: Number(variant.price) || 0,
      sku: String(variant.sku ?? ''),
      stockQuantity: Number.isFinite(Number(variant.stock_quantity)) ? Number(variant.stock_quantity) : undefined,
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
  if (hash === 'wholesale' || hash === 'story' || hash === 'contact') {
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
  const [quotePrefill, setQuotePrefill] = useState<QuotePrefill | null>(null);


  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    const loadCatalog = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id,name,category,active,product_variants(pack_size,price,sku,stock_quantity,is_active)')
        .eq('active', true);
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

  const openBulkQuote = (prefill?: QuotePrefill) => {
    setQuotePrefill(prefill ?? { mode: 'Bulk & Export Quote' });
    navigateTo('contact');
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

  const directWhatsAppHref = `https://wa.me/${BRAND_CONTACT.whatsappNumber}?text=${encodeURIComponent(
    'Hello Zestora Hills! I would like to inquire about wholesale / export spices, coffee and infused tea supply.'
  )}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F4EC] text-[#132A1E]">
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
              onBulkInquiry={() => navigateTo('wholesale')}
            />

            <ProductCatalog
              products={catalogProducts}
              onAddToCart={(product, packSize) => addToCart(product, packSize, 1)}
              onInspectProduct={(product, pack) => setInspectedProduct({ product, pack })}
            />

            {/* Editorial Origin & Wholesale Bridge Section */}
            <section className="border-t border-[#132A1E]/10 bg-[#EFEADF]/65">
              <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-20">
                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
                  {/* Western Ghats Provenance Feature */}
                  <div className="overflow-hidden rounded-lg border border-[#132A1E]/10 bg-[#FCFBF7] lg:col-span-7 flex flex-col">
                    <ProductImage
                      src={STORY_IMAGE}
                      alt="Misty spice and shade-grown coffee hills of the Western Ghats at sunrise"
                      title="Western Ghats Highland Estates"
                      className="aspect-[16/9] w-full"
                    />
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <p className="text-xs font-medium tracking-wide text-[#966D28]">
                        Farm-to-Pack Provenance · Western Ghats
                      </p>
                      <h2 className="mt-2 font-serif text-3xl font-medium text-[#132A1E] text-balance">
                        Inspired by the rich highlands of the Western Ghats.
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-[#4A5D52]">
                        By procuring directly at the farm gate in Idukki, Wayanad, Chikmagalur,
                        and the Nilgiris, we eliminate auction storage delays and protect the
                        volatile oils that define genuine Western Ghats spices and coffee.
                      </p>
                      <div className="mt-auto pt-6">
                        <button
                          type="button"
                          onClick={() => navigateTo('story')}
                          className="inline-flex min-h-[42px] items-center gap-2 text-sm font-semibold text-[#132A1E] underline decoration-[#B88A3E] underline-offset-4 transition-colors hover:text-[#966D28] cursor-pointer"
                        >
                          <span>Read Our Western Ghats Story</span>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Wholesale & Export Trade Feature */}
                  <div className="flex flex-col justify-between rounded-lg bg-[#132A1E] p-7 sm:p-9 text-[#F7F4EC] lg:col-span-5">
                    <div>
                      <p className="text-xs font-medium tracking-wide text-[#D4AF6A]">
                        Wholesale &amp; Export Desk
                      </p>
                      <h2 className="mt-2 font-serif text-3xl font-medium leading-tight text-[#F7F4EC] text-balance">
                        Bulk supply &amp; export readiness for global buyers.
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-[#EFEADF]/80">
                        Available in 5kg nitrogen-flushed foil pouches, 25kg multi-wall export
                        sacks, and private-label retail tins—backed by FSSAI, Spices Board (CRES),
                        IEC, and NABL analytical reports.
                      </p>

                      <dl className="mt-6 space-y-3 border-t border-[#F7F4EC]/12 pt-5 text-sm">
                        <div className="flex justify-between gap-4">
                          <dt className="text-[#EFEADF]/70">Domestic Wholesale MOQ</dt>
                          <dd className="font-medium text-[#D4AF6A] tabular-nums">10 kg / SKU</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-[#EFEADF]/70">Export Air / Sea Freight</dt>
                          <dd className="font-medium text-[#D4AF6A] tabular-nums">50 kg – FCL</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-[#EFEADF]/70">Compliance Stack</dt>
                          <dd className="font-medium text-[#F7F4EC]">FSSAI · Spices Board · COA</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => navigateTo('wholesale')}
                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-[#D4AF6A] px-5 py-2.5 text-sm font-semibold text-[#132A1E] transition-colors hover:bg-[#E5C88B] cursor-pointer"
                      >
                        <span>Explore Wholesale &amp; Export</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>

                      <a
                        href={directWhatsAppHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md border border-[#D4AF6A]/45 px-5 py-2.5 text-sm font-medium text-[#F7F4EC] transition-colors hover:border-[#D4AF6A] hover:bg-[#1B3B2B]"
                      >
                        <MessageCircle className="h-4 w-4 text-[#D4AF6A]" aria-hidden="true" />
                        <span>Direct WhatsApp Inquiry</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activePage === 'wholesale' && <WholesalePage onRequestQuote={openBulkQuote} />}

        {activePage === 'story' && (
          <StoryPage
            onShopRetail={scrollToCatalog}
            onBulkInquiry={() => openBulkQuote({ mode: 'Bulk & Export Quote' })}
          />
        )}

        {activePage === 'contact' && <ContactQuotePage prefill={quotePrefill} />}
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
        onRequestBulk={(productName) =>
          openBulkQuote({
            mode: 'Bulk & Export Quote',
            products: [productName],
          })
        }
      />
    </div>
  );
}
