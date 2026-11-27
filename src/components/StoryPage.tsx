import { ArrowRight } from 'lucide-react';
import {
  FARM_TO_PACK_STEPS,
  STORY_IMAGE,
  WESTERN_GHATS_REGIONS,
} from '../data/products';
import { ProductImage } from './ProductImage';

interface StoryPageProps {
  onShopRetail: () => void;
  onBulkInquiry: () => void;
}

export function StoryPage({ onShopRetail, onBulkInquiry }: StoryPageProps) {
  return (
    <div className="bg-[#F3EBDD]">
      {/* Atmospheric Western Ghats Full-Width Editorial Hero */}
      <section className="relative overflow-hidden bg-[#173C2B]">
        <div className="relative min-h-[440px] sm:min-h-[520px] w-full">
          <ProductImage
            src={STORY_IMAGE}
            alt="Misty spice and shade-grown coffee plantations across the emerald hills of the Western Ghats at golden hour"
            title="Western Ghats Highland Estates"
            className="absolute inset-0 h-full w-full"
            imgClassName="h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#10291D]/90 via-[#10291D]/55 to-[#10291D]/25"
          />

          <div className="relative mx-auto flex min-h-[440px] sm:min-h-[520px] max-w-[1280px] flex-col justify-end px-5 sm:px-8 py-14 sm:py-16">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-[#D6BD83]">
                <span>Farm-to-Pack Provenance</span>
                <span aria-hidden="true">·</span>
                <span>Western Ghats Biodiversity Corridor</span>
                <span aria-hidden="true">·</span>
                <span>800m – 2,000m ASL</span>
              </div>

              <h1 className="mt-4 font-serif text-[clamp(2.35rem,4.2vw,3.9rem)] font-medium leading-[1.08] text-[#F3EBDD] text-balance">
                Grown beneath rainforest canopies, cured without shortcuts.
              </h1>

              <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-[#E9E2D3]/88">
                Our collection brings together whole spices, roasted coffee and botanical infusions inspired by the mist-cooled landscapes and rich growing traditions of the Western Ghats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terroir Narrative */}
      <section className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-wide text-[#987B43]">
              The Western Ghats Terroir
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium leading-tight text-[#173C2B] text-balance">
              Why altitude, monsoon mist, and native shade transform spice chemistry.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-[#52665A] lg:col-span-7">
            <p>
              Stretching along India&apos;s southwestern spine, the Western Ghats is one of the
              world&apos;s oldest mountain ranges and the ancestral home of black pepper and green
              cardamom. Between June and September, southwest monsoon clouds blanket these ridges,
              nourishing deep volcanic-laterite soils rich in forest humus.
            </p>
            <p>
              Rather than clearing hillsides for monoculture sun farming, our partner estates grow
              Arabica coffee and cardamom beneath two tiers of native silver oak, jackfruit, and
              rosewood trees—while black pepper vines climb the shade trunks overhead. Cooler
              highland temperatures slow fruit maturation, allowing piperine, cineole, and complex
              coffee sugars to concentrate naturally.
            </p>
            <p>
              Conventional spice supply chains pool harvests from hundreds of regions through
              multiple brokers, storing crops for 8–14 months before polishing or bleaching. Zestora
              Hills replaces that chain with direct farm-gate procurement at premiums 12–18% above
              regional auction averages.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Farm-to-Pack Journey */}
      <section className="border-y border-[#173C2B]/10 bg-[#E9E2D3]/65">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-[#987B43]">
              From Mountain Slope to Sealed Pouch
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#173C2B] text-balance">
              Our four-stage Farm-to-Pack discipline.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4">
            {FARM_TO_PACK_STEPS.map((stage) => (
              <div
                key={stage.step}
                className="flex flex-col rounded-lg border border-[#173C2B]/10 bg-[#F8F5EC] p-6"
              >
                <span className="font-serif text-3xl font-medium text-[#B69A61] tabular-nums">
                  {stage.step}.
                </span>
                <h3 className="mt-3 font-serif text-2xl font-semibold text-[#173C2B]">
                  {stage.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#52665A]">{stage.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Micro-Origin Table */}
      <section className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-[#987B43]">
            Western Ghats Harvest Atlas
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#173C2B] text-balance">
            Five highland clusters, matched to each botanical&apos;s native elevation.
          </h2>
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg border border-[#173C2B]/12 bg-[#F8F5EC]">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#173C2B]/12 bg-[#173C2B] text-xs font-medium text-[#F3EBDD]">
                <th className="px-5 py-3.5">Growing Cluster</th>
                <th className="px-5 py-3.5">Elevation (ASL)</th>
                <th className="px-5 py-3.5">Microclimate</th>
                <th className="px-5 py-3.5">Signature Harvests</th>
                <th className="px-5 py-3.5">Peak Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#173C2B]/10">
              {WESTERN_GHATS_REGIONS.map((item) => (
                <tr key={item.region} className="hover:bg-[#F3EBDD]/80">
                  <td className="px-5 py-4 font-semibold text-[#173C2B]">{item.region}</td>
                  <td className="px-5 py-4 text-[#987B43] font-medium tabular-nums">
                    {item.elevation}
                  </td>
                  <td className="px-5 py-4 text-[#52665A]">{item.microclimate}</td>
                  <td className="px-5 py-4 text-[#173C2B]">{item.harvests}</td>
                  <td className="px-5 py-4 text-[#52665A] tabular-nums">{item.window}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Attributable Partner Grower Quote & CTA */}
        <div className="mt-14 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <div className="rounded-lg border border-[#173C2B]/12 bg-[#F8F5EC] p-7 sm:p-9 lg:col-span-7">
            <p className="text-xs font-medium text-[#987B43]">Partner Estate Voice</p>
            <blockquote className="mt-3 font-serif text-2xl sm:text-3xl font-normal italic leading-snug text-[#173C2B]">
              &ldquo;When buyers pay for late-picked 8mm pods instead of rushing our drying yards
              for auction weight, we can cure cardamom at 48°C and retain the oil richness our
              grandparents knew.&rdquo;
            </blockquote>
            <p className="mt-5 text-sm font-semibold text-[#173C2B]">Mathew Varghese</p>
            <p className="text-xs text-[#718276]">
              Third-Generation Estate Grower · Vandanmedu Cluster, Cardamom Hills (Idukki) · Partner
              since 2022 (+16% farm-gate return over auction benchmark)
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-lg bg-[#173C2B] p-7 sm:p-9 text-[#F3EBDD] lg:col-span-5">
            <div>
              <p className="text-xs font-medium text-[#D6BD83]">Taste the Current Crop</p>
              <h3 className="mt-2 font-serif text-3xl font-medium text-[#F3EBDD]">
                Bring the Western Ghats harvest to your kitchen or trade catalog.
              </h3>
              <p className="mt-3 text-sm text-[#E9E2D3]/80">
                From carefully sized retail pouches to tailored wholesale and
                export consignments.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onShopRetail}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#D6BD83] px-5 py-2.5 text-sm font-semibold text-[#173C2B] transition-colors hover:bg-[#E5D19D] whitespace-nowrap cursor-pointer"
              >
                <span>Shop Retail</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onBulkInquiry}
                className="inline-flex min-h-[44px] items-center rounded-md border border-[#D6BD83]/45 px-5 py-2.5 text-sm font-medium text-[#F3EBDD] transition-colors hover:border-[#D6BD83] hover:bg-[#244B35] whitespace-nowrap cursor-pointer"
              >
                <span>Bulk &amp; Export</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
