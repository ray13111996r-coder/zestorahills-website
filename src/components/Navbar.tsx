import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { BRAND_LOGO } from '../data/products';
import { PageRoute } from '../types';

interface NavbarProps {
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_ITEMS: { id: PageRoute; label: string }[] = [
  { id: 'home', label: 'Shop' },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'story', label: 'Our Story' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar({ activePage, onNavigate, cartCount, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#132A1E]/10 bg-[#F7F4EC]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between gap-8 px-5 sm:px-8">
        {/* Zone 1: Uploaded Zestora Hills Brand Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          aria-label="Zestora Hills Home"
          className="flex items-center shrink-0 transition-opacity duration-150 hover:opacity-85 cursor-pointer"
        >
          <span className="block h-[60px] w-[86px] overflow-hidden">
            <img
              src={BRAND_LOGO}
              alt="Zestora Hills — Single-Origin Spices"
              className="h-full w-full object-cover object-center scale-[1.54] mix-blend-multiply"
            />
          </span>
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-[#132A1E]'
                    : 'text-[#4A5D52] hover:text-[#132A1E]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-[#B88A3E] transition-opacity duration-150 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action (Shopping Bag) + mobile menu trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag, ${cartCount} items`}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#132A1E] px-4 py-2 text-sm font-medium text-[#F7F4EC] transition-colors duration-150 hover:bg-[#1B3B2B] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 text-[#D4AF6A]" aria-hidden="true" />
            <span className="tabular-nums">Bag ({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#132A1E]/15 text-[#132A1E] transition-colors hover:bg-[#EFEADF] cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#132A1E]/10 bg-[#F7F4EC] px-5 py-4 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex min-h-[44px] items-center justify-between rounded-md px-3 text-left text-base font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#EFEADF] text-[#132A1E]'
                      : 'text-[#4A5D52] hover:bg-[#EFEADF]/60 hover:text-[#132A1E]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-xs text-[#966D28]">Current</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
