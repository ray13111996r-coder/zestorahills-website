import { ArrowRight } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';
import { ProductImage } from './ProductImage';

interface HeroProps {
  onShopRetail: () => void;
}

const PROVENANCE_METRICS = [
  { value: '1,200m+', label: 'Western Ghats Elevation' },
  { value: '14 Products', label: 'Spices · Coffee · Infusions' },
  { value: '50g – 500g', label: 'Curated Retail Packs' },
  { value: '14 Products', label: 'Spices · Coffee · Infusions' },
];

export function Hero({ onShopRetail }: HeroProps) {
  return (
    <section className="bg-[#173C2B] text-[#F3EBDD]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 pt-12 pb-12 lg:pt-16 lg:pb-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Editorial Column */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-[#D6BD83]">
              <span>Western Ghats, India</span>
              <span aria-hidden="true">·</span>
              <span>Rooted in Nature</span>
              <span aria-hidden="true">·</span>
              <span>zestorahills.in</span>
            </div>

            <h1 className="mt-5 font-serif text-[clamp(2.5rem,4.3vw,4rem)] font-medium leading-[1.08] tracking-tight text-[#F3EBDD] text-balance">
              A TASTE OF THE WESTERN GHATS
            </h1>

            <p className="mt-5 max-w-[54ch] text-base leading-relaxed text-[#E9E2D3]/85 tracking-[0.01em]">
              Nature's finest, carefully selected and beautifully delivered. Discover whole spices, roasted coffee and botanical infusions inspired by the Western Ghats.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onShopRetail}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md bg-[#D6BD83] px-7 py-3 text-sm font-semibold text-[#173C2B] transition-colors duration-150 hover:bg-[#E5D19D] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Shop Retail</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>


            </div>
          </div>

          {/* Right Photographic Anchor */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden rounded-lg border border-[#D6BD83]/20">
              <ProductImage
                src={HERO_IMAGE}
                alt="Western Ghats spices including green cardamom, Tellicherry black pepper, cinnamon quills, cloves, star anise, and roasted coffee beans on slate and travertine"
                title="Zestora Hills Harvest Table"
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#10291D]/75 via-[#10291D]/15 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p className="font-serif text-xl font-medium text-[#F3EBDD]">
                    Current Crop Reserve
                  </p>
                  <p className="mt-0.5 text-xs text-[#E9E2D3]/80">
                    Idukki Cardamom · Wayanad Tellicherry Pepper · Chikmagalur Arabica
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Provenance Strip below Hero Split */}
        <div className="mt-12 border-t border-[#F3EBDD]/12 pt-7">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {PROVENANCE_METRICS.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="font-serif text-xl sm:text-2xl font-medium text-[#D6BD83] tabular-nums">
                  {item.value}
                </p>
                <p className="text-xs sm:text-sm text-[#E9E2D3]/75">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
