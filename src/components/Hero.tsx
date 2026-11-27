import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';
import { ProductImage } from './ProductImage';

interface HeroProps {
  onShopRetail: () => void;
  onBulkInquiry: () => void;
}

const PROVENANCE_METRICS = [
  { value: '1,200m+', label: 'Western Ghats Elevation' },
  { value: '14 Products', label: 'Spices · Coffee · Infusions' },
  { value: '50g – 500g', label: 'Curated Retail Packs' },
  { value: 'Retail & Trade', label: 'Domestic and bulk enquiries' },
];

export function Hero({ onShopRetail, onBulkInquiry }: HeroProps) {
  return (
    <section className="bg-[#132A1E] text-[#F7F4EC]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 pt-12 pb-12 lg:pt-16 lg:pb-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Column */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-[#D4AF6A]">
              <span>Western Ghats, India</span>
              <span aria-hidden="true">·</span>
              <span>Rooted in Nature</span>
              <span aria-hidden="true">·</span>
              <span>zestorahills.in</span>
            </div>

            <h1 className="mt-5 font-serif text-[clamp(2.5rem,4.3vw,4rem)] font-medium leading-[1.08] tracking-tight text-[#F7F4EC] text-balance">
              A TASTE OF THE WESTERN GHATS
            </h1>

            <p className="mt-5 max-w-[54ch] text-base leading-relaxed text-[#EFEADF]/85 tracking-[0.01em]">
              Nature's finest, carefully selected and beautifully delivered. Discover whole spices, roasted coffee and botanical infusions inspired by the Western Ghats.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onShopRetail}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md bg-[#D4AF6A] px-7 py-3 text-sm font-semibold text-[#132A1E] transition-colors duration-150 hover:bg-[#E5C88B] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Shop Retail</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onBulkInquiry}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md border border-[#D4AF6A]/45 bg-transparent px-7 py-3 text-sm font-medium text-[#F7F4EC] transition-colors duration-150 hover:border-[#D4AF6A] hover:bg-[#1B3B2B] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Bulk &amp; Export Inquiry</span>
              </button>
            </div>
          </div>

          {/* Right Photographic Anchor */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden rounded-lg border border-[#D4AF6A]/20">
              <ProductImage
                src={HERO_IMAGE}
                alt="Western Ghats spices including green cardamom, Tellicherry black pepper, cinnamon quills, cloves, star anise, and roasted coffee beans on slate and travertine"
                title="Zestora Hills Harvest Table"
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E2017]/75 via-[#0E2017]/15 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p className="font-serif text-xl font-medium text-[#F7F4EC]">
                    Current Crop Reserve
                  </p>
                  <p className="mt-0.5 text-xs text-[#EFEADF]/80">
                    Idukki Cardamom · Wayanad Tellicherry Pepper · Chikmagalur Arabica
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Provenance Strip below Hero Split */}
        <div className="mt-12 border-t border-[#F7F4EC]/12 pt-7">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {PROVENANCE_METRICS.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="font-serif text-xl sm:text-2xl font-medium text-[#D4AF6A] tabular-nums">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm text-[#EFEADF]/75">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
