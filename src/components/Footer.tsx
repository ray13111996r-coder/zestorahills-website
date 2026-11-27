import { MessageCircle } from 'lucide-react';
import { BRAND_CONTACT, BRAND_LOGO } from '../data/products';
import { PageRoute } from '../types';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const whatsappUrl = `https://wa.me/${BRAND_CONTACT.whatsappNumber}?text=${encodeURIComponent(
    'Hello Zestora Hills! I have an inquiry from zestorahills.in.'
  )}`;

  return (
    <footer className="border-t border-[#D6BD83]/20 bg-[#173C2B] text-[#E9E2D3]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              aria-label="Zestora Hills Home"
              className="inline-flex overflow-hidden rounded-md bg-[#F3EBDD] p-1 transition-opacity duration-150 hover:opacity-90 cursor-pointer"
            >
              <span className="block h-[96px] w-[138px] overflow-hidden">
                <img
                  src={BRAND_LOGO}
                  alt="Zestora Hills original brand logo"
                  className="h-full w-full object-cover object-center scale-[1.54] mix-blend-multiply"
                />
              </span>
            </button>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#E9E2D3]/75">
              A considered collection of Western Ghats spices, roasted coffee and botanical infusions. Rooted in nature. Crafted with care.
            </p>
            <p className="mt-4 text-xs text-[#D6BD83]">
              {BRAND_CONTACT.domain} · FSSAI &amp; Spices Board Export Ready
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <p className="text-xs font-medium tracking-wide text-[#D6BD83]">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-[#E9E2D3]/80 transition-colors hover:text-[#F3EBDD] cursor-pointer"
                >
                  Retail Harvest Catalog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('wholesale')}
                  className="text-[#E9E2D3]/80 transition-colors hover:text-[#F3EBDD] cursor-pointer"
                >
                  Wholesale &amp; Export Trade
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('story')}
                  className="text-[#E9E2D3]/80 transition-colors hover:text-[#F3EBDD] cursor-pointer"
                >
                  Western Ghats Sourcing Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="text-[#E9E2D3]/80 transition-colors hover:text-[#F3EBDD] cursor-pointer"
                >
                  Contact &amp; Bulk Quote
                </button>
              </li>
            </ul>
          </div>

          {/* Trade Desk */}
          <div className="md:col-span-4">
            <p className="text-xs font-medium tracking-wide text-[#D6BD83]">Sourcing &amp; Trade Desk</p>
            <p className="mt-4 text-sm text-[#E9E2D3]/80">{BRAND_CONTACT.address}</p>
            <p className="mt-2 text-sm text-[#E9E2D3]/80">
              <a
                href={`mailto:${BRAND_CONTACT.tradeEmail}`}
                className="hover:text-[#D6BD83] transition-colors"
              >
                {BRAND_CONTACT.tradeEmail}
              </a>
              <span className="mx-2 text-[#E9E2D3]/40">·</span>
              <a
                href={`tel:+${BRAND_CONTACT.whatsappNumber}`}
                className="tabular-nums hover:text-[#D6BD83] transition-colors"
              >
                {BRAND_CONTACT.phoneDisplay}
              </a>
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[40px] items-center gap-2 rounded-md border border-[#D6BD83]/45 px-4 py-2 text-xs font-semibold text-[#F3EBDD] transition-colors hover:border-[#D6BD83] hover:bg-[#244B35]"
            >
              <MessageCircle className="h-4 w-4 text-[#D6BD83]" aria-hidden="true" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#F3EBDD]/12 pt-6 text-xs text-[#E9E2D3]/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Zestora Hills ({BRAND_CONTACT.domain}). All rights reserved.</p>
          <p>Rooted in Nature. Crafted with Care.</p>
        </div>
      </div>
    </footer>
  );
}
