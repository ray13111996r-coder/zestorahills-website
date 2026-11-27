import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { PackSize, Product } from '../types';
import { ProductImage } from './ProductImage';

interface ProductDetailModalProps {
  product: Product | null;
  initialPack: PackSize;
  onClose: () => void;
  onAddToCart: (product: Product, packSize: PackSize, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  initialPack,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [packSize, setPackSize] = useState<PackSize>(initialPack);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setPackSize(initialPack);
    setQuantity(1);
  }, [product, initialPack]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const availablePacks = Object.keys(product.packs) as PackSize[];
  const safePack = product.packs[packSize] ? packSize : availablePacks[0];
  const variant = product.packs[safePack]!;
  const hasPrice = variant.priceInr > 0;
  const inStock = variant.stockQuantity === undefined || variant.stockQuantity > 0;
  const canAdd = hasPrice && variant.isActive !== false && inStock;
  const lineTotal = variant.priceInr * quantity;

  const handleConfirmAdd = () => {
    if (!canAdd) return;
    onAddToCart(product, safePack, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10291D]/65 p-4 sm:p-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-[#173C2B]/15 bg-[#F3EBDD]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#F8F5EC]/90 text-[#173C2B] border border-[#173C2B]/15 transition-colors hover:bg-[#E9E2D3] cursor-pointer"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 items-stretch md:grid-cols-12">
          {/* Left Image Gallery Panel */}
          <div className="md:col-span-6 bg-[#E9E2D3]">
            <ProductImage
              src={product.image}
              alt={product.imageAlt}
              title={product.name}
              className="aspect-[4/3] md:aspect-auto md:h-full w-full"
              imgClassName={product.imageClassName}
            />
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="flex flex-col p-6 sm:p-8 md:col-span-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#718276]">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.origin}</span>
              <span aria-hidden="true">·</span>
              <span className="italic">{product.botanicalName}</span>
            </div>

            <h2
              id="pdp-modal-title"
              className="mt-2 font-serif text-3xl font-semibold text-[#173C2B]"
            >
              {product.name}
            </h2>

            <p className="mt-1 text-xs font-medium text-[#987B43]">
              {product.grade} · {product.elevation} · {product.harvestSeason}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[#52665A]">{product.description}</p>

            {/* Tasting & Culinary Spec Grid */}
            <div className="mt-5 space-y-3 border-y border-[#173C2B]/10 py-4 text-sm">
              <div>
                <p className="text-xs font-medium text-[#718276]">Tasting Profile</p>
                <p className="mt-0.5 text-[#173C2B]">
                  {product.tastingNotes.join(' · ')}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#718276]">Culinary Pairing</p>
                <p className="mt-0.5 text-[#52665A]">{product.culinaryUses}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#718276]">Harvest Specification</p>
                <p className="mt-0.5 text-xs text-[#173C2B] tabular-nums">{product.specHighlight}</p>
              </div>
            </div>

            {/* Pack Size & Quantity */}
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#718276]">Pack Size</p>
                <div className="mt-1.5 inline-flex rounded-md bg-[#E9E2D3] p-1">
                  {availablePacks.map((size) => {
                    const active = packSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setPackSize(size)}
                        className={`min-h-[38px] rounded px-4 text-sm font-semibold tabular-nums transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#173C2B] text-[#F3EBDD]'
                            : 'text-[#52665A] hover:text-[#173C2B]'
                        }`}
                      >
                        {size}{product.packs[size]!.priceInr > 0 ? ` — ₹${product.packs[size]!.priceInr.toLocaleString('en-IN')}` : ' — Price pending'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-[#718276]">Quantity</p>
                <div className="mt-1.5 inline-flex items-center rounded-md border border-[#173C2B]/15 bg-[#F8F5EC]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="inline-flex h-10 w-10 items-center justify-center text-[#173C2B] hover:bg-[#E9E2D3] cursor-pointer"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="inline-flex h-10 w-10 items-center justify-center text-[#173C2B] hover:bg-[#E9E2D3] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmAdd}
              disabled={!canAdd}
              className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md bg-[#173C2B] px-6 py-3 text-sm font-semibold text-[#F3EBDD] transition-colors hover:bg-[#244B35] cursor-pointer"
            >
              <span className="tabular-nums">
                {!hasPrice ? 'Price to be confirmed' : variant.isActive === false ? 'Coming soon' : !inStock ? 'Currently out of stock' : `Add to Bag · ₹${lineTotal.toLocaleString('en-IN')}`}
              </span>
            </button>


          </div>
        </div>
      </div>
    </div>
  );
}
