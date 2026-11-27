import { useMemo, useState } from 'react';
import { Check, Plus, Search } from 'lucide-react';
import { PackSize, Product, ProductCategory } from '../types';
import { ProductImage } from './ProductImage';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product, packSize: PackSize) => void;
  onInspectProduct: (product: Product, selectedPack: PackSize) => void;
}

type CategoryFilter = 'All' | ProductCategory;
type SortOption = 'featured' | 'price-asc' | 'price-desc';

const CATEGORY_TABS: { value: CategoryFilter; label: string }[] = [
  { value: 'All', label: 'All Harvests' },
  { value: 'Whole Spices', label: 'Whole Spices' },
  { value: 'Estate Coffee', label: 'Coffee' },
  { value: 'Infused Teas', label: 'Infused Teas' },
];

export function ProductCatalog({
  products,
  onAddToCart,
  onInspectProduct,
}: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedPacks, setSelectedPacks] = useState<Record<string, PackSize>>(() =>
    Object.fromEntries(products.map((p) => [p.id, Object.keys(p.packs)[0] as PackSize]))
  );
  const [recentlyAdded, setRecentlyAdded] = useState<Record<string, boolean>>({});

  const handlePackSelect = (productId: string, size: PackSize) => {
    setSelectedPacks((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAdd = (product: Product) => {
    const pack = selectedPacks[product.id] ?? (Object.keys(product.packs)[0] as PackSize);
    onAddToCart(product, pack);
    setRecentlyAdded((prev) => ({ ...prev, [product.id]: true }));
    window.setTimeout(() => {
      setRecentlyAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 1100);
  };

  const filteredProducts = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    const list = products.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesQuery =
        !normalized ||
        p.name.toLowerCase().includes(normalized) ||
        p.origin.toLowerCase().includes(normalized) ||
        p.shortNote.toLowerCase().includes(normalized) ||
        p.botanicalName.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort(
        (a, b) =>
          (a.packs[selectedPacks[a.id] ?? (Object.keys(a.packs)[0] as PackSize)]?.priceInr ?? Number.MAX_SAFE_INTEGER) -
          (b.packs[selectedPacks[b.id] ?? (Object.keys(b.packs)[0] as PackSize)]?.priceInr ?? Number.MAX_SAFE_INTEGER)
      );
    }
    if (sortBy === 'price-desc') {
      return [...list].sort(
        (a, b) =>
          (b.packs[selectedPacks[b.id] ?? (Object.keys(b.packs)[0] as PackSize)]?.priceInr ?? 0) -
          (a.packs[selectedPacks[a.id] ?? (Object.keys(a.packs)[0] as PackSize)]?.priceInr ?? 0)
      );
    }
    return list;
  }, [products, activeCategory, searchQuery, sortBy, selectedPacks]);

  return (
    <section id="retail-catalog" className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-20">
      {/* Section Header */}
      <div className="flex flex-col gap-6 border-b border-[#173C2B]/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-[#987B43]">
            SPICES · COFFEE · INFUSED TEAS
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#173C2B] text-balance">
            The Western Ghats Collection
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#52665A]">
            A considered collection of whole spices, roasted coffee and botanical infusions in carefully chosen pack sizes. Free Pan-India express
            shipping on retail orders above ₹1,499.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718276]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spice, coffee, origin..."
              aria-label="Search retail catalog"
              className="min-h-[42px] w-full sm:w-60 rounded-md border border-[#173C2B]/15 bg-[#F8F5EC] pl-10 pr-4 text-sm text-[#173C2B] placeholder:text-[#718276] transition-colors focus:border-[#B69A61]"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort products"
            className="min-h-[42px] rounded-md border border-[#173C2B]/15 bg-[#F8F5EC] px-3.5 text-sm text-[#173C2B] transition-colors focus:border-[#B69A61] cursor-pointer"
          >
            <option value="featured">Sort: Harvest Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter by harvest category"
          className="flex flex-wrap items-center gap-1.5 rounded-lg bg-[#E9E2D3] p-1"
        >
          {CATEGORY_TABS.map((tab) => {
            const isSelected = activeCategory === tab.value;
            return (
              <button
                key={tab.value}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => setActiveCategory(tab.value)}
                className={`min-h-[38px] rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#173C2B] text-[#F3EBDD]'
                    : 'text-[#52665A] hover:text-[#173C2B]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-[#718276] tabular-nums">
          Showing {filteredProducts.length} of {products.length} Western Ghats selections
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="mt-12 rounded-lg border border-[#173C2B]/10 bg-[#F8F5EC] px-6 py-14 text-center">
          <p className="font-serif text-2xl text-[#173C2B]">No matching harvests found</p>
          <p className="mt-2 text-sm text-[#52665A]">
            Try clearing your search term or viewing all Western Ghats harvests.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="mt-5 inline-flex min-h-[40px] items-center rounded-md bg-[#173C2B] px-5 py-2 text-sm font-medium text-[#F3EBDD] transition-colors hover:bg-[#244B35] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const currentPack = selectedPacks[product.id] ?? (Object.keys(product.packs)[0] as PackSize);
            const variant = product.packs[currentPack];
            const hasPrice = Boolean(variant && variant.priceInr > 0);
            const inStock = variant?.stockQuantity === undefined || variant.stockQuantity > 0;
            const canAdd = hasPrice && variant?.isActive !== false && inStock;
            const isAdded = Boolean(recentlyAdded[product.id]);

            return (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-[#173C2B]/10 bg-[#F8F5EC] transition-transform duration-200 hover:-translate-y-0.5"
              >
                {/* Uniform 4:3 Image Frame */}
                <button
                  type="button"
                  onClick={() => onInspectProduct(product, currentPack)}
                  aria-label={`View harvest details for ${product.name}`}
                  className="block w-full text-left cursor-pointer focus-visible:outline-offset-[-2px]"
                >
                  <ProductImage
                    src={product.image}
                    alt={product.imageAlt}
                    title={product.name}
                    className="flex aspect-[4/3] w-full items-center justify-center"
                    imgClassName="!object-contain p-5 transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                  />
                </button>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  {/* Quiet Unboxed Metadata */}
                  <div className="flex items-center gap-1.5 text-xs text-[#718276] truncate">
                    <span className="truncate">{product.origin}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate text-[#987B43]">{product.grade}</span>
                  </div>

                  {/* Title & Price Row */}
                  <div className="mt-2 flex items-baseline justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onInspectProduct(product, currentPack)}
                      className="text-left font-serif text-2xl font-semibold leading-snug text-[#173C2B] transition-colors hover:text-[#987B43] cursor-pointer"
                    >
                      {product.name}
                    </button>
                    <span className="text-base font-semibold text-[#173C2B] tabular-nums whitespace-nowrap shrink-0">
                      {!hasPrice ? 'Price to be confirmed' : variant?.isActive === false ? 'Coming soon' : !inStock ? 'Out of stock' : `₹${variant!.priceInr.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-[#52665A] line-clamp-2">
                    {product.shortNote}
                  </p>

                  {/* Contiguous Purchase Controls */}
                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between gap-3 border-t border-[#173C2B]/8 pt-4">
                      {/* Pack Size Selector */}
                      <div
                        role="group"
                        aria-label={`Select pack size for ${product.name}`}
                        className="inline-flex rounded-md bg-[#E9E2D3] p-1"
                      >
                        {(Object.keys(product.packs) as PackSize[]).map((size) => {
                          const active = currentPack === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handlePackSelect(product.id, size)}
                              aria-pressed={active}
                              className={`min-h-[34px] rounded px-3 text-xs font-semibold tabular-nums transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                                active
                                  ? 'bg-[#173C2B] text-[#F3EBDD]'
                                  : 'text-[#52665A] hover:text-[#173C2B]'
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => onInspectProduct(product, currentPack)}
                        className="text-xs font-medium text-[#52665A] underline-offset-4 transition-colors hover:text-[#173C2B] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Notes &amp; Origin
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      disabled={!canAdd}
                      className={`mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                        isAdded
                          ? 'bg-[#315A43] text-[#F3EBDD]'
                          : 'bg-[#173C2B] text-[#F3EBDD] hover:bg-[#244B35]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-4 w-4 text-[#D6BD83]" aria-hidden="true" />
                          <span>Added {currentPack} to Bag</span>
                        </>
                       ) : !hasPrice ? (
                        <span>Price to be confirmed</span>
                      ) : variant?.isActive === false ? (
                        <span>Coming soon</span>
                      ) : !inStock ? (
                        <span>Currently out of stock</span>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 text-[#D6BD83]" aria-hidden="true" />
                          <span className="tabular-nums">
                            Add to Bag · ₹{variant!.priceInr.toLocaleString('en-IN')}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
