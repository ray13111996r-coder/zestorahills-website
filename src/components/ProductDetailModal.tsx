import { useEffect, useState } from 'react';
import { ArrowRight, Minus, Plus, X } from 'lucide-react';
import { PackSize, Product } from '../types';
import { ProductImage } from './ProductImage';

interface ProductDetailModalProps {
  product: Product | null;
  initialPack: PackSize;
  onClose: () => void;
  onAddToCart: (product: Product, packSize: PackSize, quantity: number) => void;
  onRequestBulk: (productName: string) => void;
}

export function ProductDetailModal({
  product,
  initialPack,
  onClose,
  onAddToCart,
  onRequestBulk,
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

  const variant = product.packs[packSize];
  const lineTotal = variant.priceInr * quantity;

  const handleConfirmAdd = () => {
    onAddToCart(product, packSize, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E2017]/65 p-4 sm:p-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-[#132A1E]/15 bg-[#F7F4EC]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#FCFBF7]/90 text-[#132A1E] border border-[#132A1E]/15 transition-colors hover:bg-[#EFEADF] cursor-pointer"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 items-stretch md:grid-cols-12">
          {/* Left Image Gallery Panel */}
          <div className="md:col-span-6 bg-[#EFEADF]">
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
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#63756A]">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.origin}</span>
              <span aria-hidden="true">·</span>
              <span className="italic">{product.botanicalName}</span>
            </div>

            <h2
              id="pdp-modal-title"
              className="mt-2 font-serif text-3xl font-semibold text-[#132A1E]"
            >
              {product.name}
            </h2>

            <p className="mt-1 text-xs font-medium text-[#966D28]">
              {product.grade} · {product.elevation} · {product.harvestSeason}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[#4A5D52]">{product.description}</p>

            {/* Tasting & Culinary Spec Grid */}
            <div className="mt-5 space-y-3 border-y border-[#132A1E]/10 py-4 text-sm">
              <div>
                <p className="text-xs font-medium text-[#63756A]">Tasting Profile</p>
                <p className="mt-0.5 text-[#132A1E]">
                  {product.tastingNotes.join(' · ')}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#63756A]">Culinary Pairing</p>
                <p className="mt-0.5 text-[#4A5D52]">{product.culinaryUses}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#63756A]">Harvest Specification</p>
                <p className="mt-0.5 text-xs text-[#132A1E] tabular-nums">{product.specHighlight}</p>
              </div>
            </div>

            {/* Pack Size & Quantity */}
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#63756A]">Pack Size</p>
                <div className="mt-1.5 inline-flex rounded-md bg-[#EFEADF] p-1">
                  {(['100g', '200g'] as PackSize[]).map((size) => {
                    const active = packSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setPackSize(size)}
                        className={`min-h-[38px] rounded px-4 text-sm font-semibold tabular-nums transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#132A1E] text-[#F7F4EC]'
                            : 'text-[#4A5D52] hover:text-[#132A1E]'
                        }`}
                      >
                        {size} — ₹{product.packs[size].priceInr.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-[#63756A]">Quantity</p>
                <div className="mt-1.5 inline-flex items-center rounded-md border border-[#132A1E]/15 bg-[#FCFBF7]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="inline-flex h-10 w-10 items-center justify-center text-[#132A1E] hover:bg-[#EFEADF] cursor-pointer"
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
                    className="inline-flex h-10 w-10 items-center justify-center text-[#132A1E] hover:bg-[#EFEADF] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmAdd}
              className="mt-6 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md bg-[#132A1E] px-6 py-3 text-sm font-semibold text-[#F7F4EC] transition-colors hover:bg-[#1B3B2B] cursor-pointer"
            >
              <span className="tabular-nums">
                Add to Bag · ₹{lineTotal.toLocaleString('en-IN')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestBulk(product.name);
              }}
              className="mt-3 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#966D28] transition-colors hover:text-[#132A1E] cursor-pointer"
            >
              <span>Need 5kg+ wholesale or export pricing for {product.name}?</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
