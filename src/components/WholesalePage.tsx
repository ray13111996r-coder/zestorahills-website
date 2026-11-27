import { ArrowRight, CheckCircle2, FileCheck2, PackageCheck, ShieldCheck } from 'lucide-react';
import {
  COMPLIANCE_CREDENTIALS,
  HERO_IMAGE,
  MOQ_TIERS,
  PRODUCTS,
  WHOLESALE_PACKAGING_OPTIONS,
} from '../data/products';
import { QuotePrefill } from '../types';
import { ProductImage } from './ProductImage';

interface WholesalePageProps {
  onRequestQuote: (prefill?: QuotePrefill) => void;
}

const EXPORT_SPEC_ROWS = [
  {
    product: 'Whole Black Pepper',
    grade: 'TGSEB 4.75mm+ / MG1',
    moisture: '< 11.0%',
    activeCompound: 'Piperine 5.4%+',
    bulkPack: '5 kg Vac / 25 kg Sack',
  },
  {
    product: 'Green Cardamom',
    grade: 'AGEB 8mm+ / AGB 7–8mm',
    moisture: '< 10.5%',
    activeCompound: 'Volatile Oil 6.5%+',
    bulkPack: '5 kg Foil / 25 kg Carton',
  },
  {
    product: 'True Malabar Cinnamon',
    grade: 'Alba / C5 Special Quills',
    moisture: '< 12.0%',
    activeCompound: 'Volatile Oil 1.5%+',
    bulkPack: '5 kg / 10 kg Corrugated',
  },
  {
    product: 'Unbleached Dried Ginger',
    grade: 'Cochin Whole Select',
    moisture: '< 11.5%',
    activeCompound: 'Volatile Oil 2.0%+',
    bulkPack: '10 kg / 25 kg PP-Jute',
  },
  {
    product: 'Hand-Picked Cloves',
    grade: 'Full-Head Stemless',
    moisture: '< 11.0%',
    activeCompound: 'Eugenol Oil 16.0%+',
    bulkPack: '5 kg Vac / 25 kg Sack',
  },
  {
    product: 'Single-Estate Arabica',
    grade: 'Plantation AA (Green or Roasted)',
    moisture: '< 11.5% (Green)',
    activeCompound: 'Screen 18+ · Shade-Grown',
    bulkPack: '5 kg Valve / 60 kg GrainPro',
  },
];

export function WholesalePage({ onRequestQuote }: WholesalePageProps) {
  return (
    <div className="bg-[#F7F4EC]">
      {/* Page Hero */}
      <section className="bg-[#132A1E] text-[#F7F4EC]">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-center lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-[#D4AF6A]">
                <span>Wholesale &amp; Global Export</span>
                <span aria-hidden="true">·</span>
                <span>FOB Cochin &amp; Air Freight</span>
                <span aria-hidden="true">·</span>
                <span>Compliance documents available on request</span>
              </div>

              <h1 className="mt-4 font-serif text-[clamp(2.25rem,4vw,3.75rem)] font-medium leading-[1.1] tracking-tight text-[#F7F4EC] text-balance">
                Export-grade Western Ghats harvests, graded for global trade.
              </h1>

              <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-[#EFEADF]/85">
                Zestora Hills supplies specialty foodservice kitchens, gourmet private labels, and
                international spice importers directly from our Idukki curing and grading facility—
                eliminating multi-tier commodity brokers while preserving full harvest traceability.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onRequestQuote({
                      mode: 'Bulk & Export Quote',
                      packaging: '25kg Export Sack',
                    })
                  }
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#D4AF6A] px-7 py-3 text-sm font-semibold text-[#132A1E] transition-colors hover:bg-[#E5C88B] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Request Export Quote</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onRequestQuote({
                      mode: 'Domestic Wholesale',
                      packaging: '5kg Vacuum Foil',
                      note: 'Requesting a B2B Evaluation Sample Kit with COA spec sheets.',
                    })
                  }
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-md border border-[#D4AF6A]/45 px-7 py-3 text-sm font-medium text-[#F7F4EC] transition-colors hover:border-[#D4AF6A] hover:bg-[#1B3B2B] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Order B2B Sample Kit</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="h-full min-h-[280px] overflow-hidden rounded-lg border border-[#D4AF6A]/20">
                <ProductImage
                  src={HERO_IMAGE}
                  alt="Graded Western Ghats export spices and estate coffee prepared for quality inspection"
                  title="Zestora Hills Trade Grading"
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Packaging Formats */}
      <section className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-[#966D28]">
            01. Bulk Packaging Architecture
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#132A1E] text-balance">
            Engineered to protect volatile oils from estate to destination port.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#4A5D52]">
            Every shipment is packed to destination humidity and transit conditions—from 1 kg
            kitchen barrier pouches to palletized 25 kg multi-wall export sacks.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-3">
          {WHOLESALE_PACKAGING_OPTIONS.map((option) => (
            <div
              key={option.title}
              className="flex flex-col rounded-lg border border-[#132A1E]/10 bg-[#FCFBF7] p-6 sm:p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[#966D28] tabular-nums">
                  {option.weights}
                </span>
                <PackageCheck className="h-5 w-5 text-[#1B3B2B]" aria-hidden="true" />
              </div>
              <h3 className="mt-3 font-serif text-2xl font-semibold text-[#132A1E]">
                {option.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4A5D52]">{option.spec}</p>
              <div className="mt-auto border-t border-[#132A1E]/10 pt-4 mt-6">
                <p className="text-xs font-medium text-[#63756A]">Ideal For</p>
                <p className="mt-1 text-xs leading-relaxed text-[#132A1E]">{option.idealFor}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOQ & Logistics Schedule */}
      <section className="border-y border-[#132A1E]/10 bg-[#EFEADF]/65">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-wide text-[#966D28]">
                02. Minimum Order Quantities &amp; Dispatch
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#132A1E] text-balance">
                Transparent MOQs for domestic wholesale &amp; international freight.
              </h2>
            </div>
            <p className="text-xs text-[#4A5D52]">
              14 product selections across spices, coffee and infused teas.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-lg border border-[#132A1E]/12 bg-[#FCFBF7]">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#132A1E]/12 bg-[#132A1E] text-xs font-medium text-[#F7F4EC]">
                  <th className="px-5 py-3.5">Trade Program</th>
                  <th className="px-5 py-3.5">Minimum Order (MOQ)</th>
                  <th className="px-5 py-3.5">Standard Packaging</th>
                  <th className="px-5 py-3.5">Dispatch Lead Time</th>
                  <th className="px-5 py-3.5">Logistics Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#132A1E]/10">
                {MOQ_TIERS.map((row) => (
                  <tr key={row.program} className="hover:bg-[#F7F4EC]/80">
                    <td className="px-5 py-4 font-semibold text-[#132A1E]">{row.program}</td>
                    <td className="px-5 py-4 text-[#966D28] font-medium tabular-nums">{row.moq}</td>
                    <td className="px-5 py-4 text-[#4A5D52]">{row.packaging}</td>
                    <td className="px-5 py-4 text-[#132A1E] tabular-nums">{row.leadTime}</td>
                    <td className="px-5 py-4 text-[#4A5D52]">{row.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export Grade Specification Table */}
          <div className="mt-12">
            <h3 className="font-serif text-2xl font-semibold text-[#132A1E]">
              Key Export Grade &amp; Analytical Specifications
            </h3>
            <p className="mt-1 text-sm text-[#4A5D52]">
              Batch Certificates of Analysis (COA) issued prior to container stuffing or air cargo
              handover.
            </p>

            <div className="mt-5 overflow-x-auto rounded-lg border border-[#132A1E]/12 bg-[#FCFBF7]">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#132A1E]/10 bg-[#EFEADF] text-xs font-semibold text-[#132A1E]">
                    <th className="px-5 py-3">Harvest Line</th>
                    <th className="px-5 py-3">Export Grade</th>
                    <th className="px-5 py-3">Moisture Ceiling</th>
                    <th className="px-5 py-3">Active Oil / Screen</th>
                    <th className="px-5 py-3">Bulk Format</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#132A1E]/10">
                  {EXPORT_SPEC_ROWS.map((spec) => (
                    <tr key={spec.product} className="hover:bg-[#F7F4EC]/70">
                      <td className="px-5 py-3.5 font-medium text-[#132A1E]">{spec.product}</td>
                      <td className="px-5 py-3.5 text-[#4A5D52] tabular-nums">{spec.grade}</td>
                      <td className="px-5 py-3.5 text-[#132A1E] tabular-nums">{spec.moisture}</td>
                      <td className="px-5 py-3.5 text-[#966D28] font-medium tabular-nums">
                        {spec.activeCompound}
                      </td>
                      <td className="px-5 py-3.5 text-[#4A5D52] tabular-nums">{spec.bulkPack}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FSSAI & Spices Board Readiness */}
      <section className="mx-auto max-w-[1280px] px-5 sm:px-8 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-[#966D28]">
            03. Regulatory &amp; Export Compliance
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#132A1E] text-balance">
            Please contact our team to discuss applicable product and export documentation.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#4A5D52]">
            Designed for frictionless clearance into the EU, UK, UAE, USA, Japan, and domestic
            enterprise supply chains—with full lot-level traceability back to the Western Ghats
            growing cluster.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {COMPLIANCE_CREDENTIALS.map((cred, idx) => (
            <div
              key={cred.code}
              className="rounded-lg border border-[#132A1E]/10 bg-[#FCFBF7] p-6 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#966D28]">{cred.scope}</p>
                  <h3 className="mt-1 font-serif text-2xl font-semibold text-[#132A1E]">
                    {cred.code}
                  </h3>
                </div>
                {idx % 2 === 0 ? (
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#1B3B2B]" aria-hidden="true" />
                ) : (
                  <FileCheck2 className="h-5 w-5 shrink-0 text-[#1B3B2B]" aria-hidden="true" />
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#4A5D52]">{cred.detail}</p>
            </div>
          ))}
        </div>

        {/* Bottom Export Trade Banner */}
        <div className="mt-14 rounded-lg bg-[#132A1E] p-8 sm:p-10 text-[#F7F4EC]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-[#D4AF6A]">Direct Trade Desk · zestorahills.in</p>
              <h3 className="mt-2 font-serif text-3xl font-medium text-[#F7F4EC] text-balance">
                Build a custom multi-spice container or recurring wholesale contract.
              </h3>
              <p className="mt-2 text-sm text-[#EFEADF]/80">
                Share your target grades, destination port, and monthly volumes across any of our{' '}
                {PRODUCTS.length} product lines for a CIF/FOB quotation within 24 business
                hours.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                type="button"
                onClick={() =>
                  onRequestQuote({
                    mode: 'Bulk & Export Quote',
                    products: ['Whole Black Pepper', 'Green Cardamom', 'Roasted Coffee Beans'],
                  })
                }
                className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#D4AF6A] px-6 py-3 text-sm font-semibold text-[#132A1E] transition-colors hover:bg-[#E5C88B] whitespace-nowrap cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Start Bulk Quote</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
