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
    <footer className="border-t border-[#D4AF6A]/20 bg-[#132A1E] text-[#EFEADF]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              aria-label="Zestora Hills Home"
              className="inline-flex overflow-hidden rounded-md bg-[#F7F4EC] p-1 transition-opacity duration-150 hover:opacity-90 cursor-pointer"
            >
              <span className="block h-[96px] w-[138px] overflow-hidden">
                <img
                  src={BRAND_LOGO}
                  alt="Zestora Hills — Single-Origin Spices"
                  className="h-full w-full object-cover object-center scale-[1.54] mix-blend-multiply"
                />
              </span>
            </button>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#EFEADF]/75">
              Single-origin Western Ghats spices and shade-grown estate coffee. Sourced directly
              from partner growers across Idukki, Wayanad, and Chikmagalur.
            </p>
            <p className="mt-4 text-xs text-[#D4AF6A]">
              {BRAND_CONTACT.domain} · FSSAI &amp; Spices Board Export Ready
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <p className="text-xs font-medium tracking-wide text-[#D4AF6A]">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-[#EFEADF]/80 transition-colors hover:text-[#F7F4EC] cursor-pointer"
                >
                  Retail Harvest Catalog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('wholesale')}
                  className="text-[#EFEADF]/80 transition-colors hover:text-[#F7F4EC] cursor-pointer"
                >
                  Wholesale &amp; Export Trade
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('story')}
                  className="text-[#EFEADF]/80 transition-colors hover:text-[#F7F4EC] cursor-pointer"
                >
                  Western Ghats Sourcing Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="text-[#EFEADF]/80 transition-colors hover:text-[#F7F4EC] cursor-pointer"
                >
                  Contact &amp; Bulk Quote
                </button>
              </li>
            </ul>
          </div>

          {/* Trade Desk */}
          <div className="md:col-span-4">
            <p className="text-xs font-medium tracking-wide text-[#D4AF6A]">Sourcing &amp; Trade Desk</p>
            <p className="mt-4 text-sm text-[#EFEADF]/80">{BRAND_CONTACT.address}</p>
            <p className="mt-2 text-sm text-[#EFEADF]/80">
              <a
                href={`mailto:${BRAND_CONTACT.tradeEmail}`}
                className="hover:text-[#D4AF6A] transition-colors"
              >
                {BRAND_CONTACT.tradeEmail}
              </a>
              <span className="mx-2 text-[#EFEADF]/40">·</span>
              <a
                href={`tel:+${BRAND_CONTACT.whatsappNumber}`}
                className="tabular-nums hover:text-[#D4AF6A] transition-colors"
              >
                {BRAND_CONTACT.phoneDisplay}
              </a>
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[40px] items-center gap-2 rounded-md border border-[#D4AF6A]/45 px-4 py-2 text-xs font-semibold text-[#F7F4EC] transition-colors hover:border-[#D4AF6A] hover:bg-[#1B3B2B]"
            >
              <MessageCircle className="h-4 w-4 text-[#D4AF6A]" aria-hidden="true" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[#F7F4EC]/12 pt-6 text-xs text-[#EFEADF]/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Zestora Hills ({BRAND_CONTACT.domain}). All rights reserved.</p>
          <p>Single-Origin Western Ghats Spices &amp; Estate Coffee</p>
        </div>
      </div>
    </footer>
  );
}
