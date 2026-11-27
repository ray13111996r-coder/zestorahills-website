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
    <header className="sticky top-0 z-40 border-b border-[#173C2B]/10 bg-[#F3EBDD]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[64px] sm:h-[74px] max-w-[1280px] items-center justify-between gap-3 sm:gap-8 px-4 sm:px-8">
        {/* Zone 1: Uploaded Zestora Hills Brand Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          aria-label="Zestora Hills Home"
          className="flex items-center shrink-0 transition-opacity duration-150 hover:opacity-85 cursor-pointer"
        >
          <span className="block h-[52px] w-[74px] sm:h-[60px] sm:w-[86px] overflow-hidden">
            <img
              src={BRAND_LOGO}
              alt="Zestora Hills original brand logo"
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
                    ? 'text-[#173C2B]'
                    : 'text-[#52665A] hover:text-[#173C2B]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-[#B69A61] transition-opacity duration-150 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action (Shopping Bag) + mobile menu trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag, ${cartCount} items`}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#173C2B] px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#F3EBDD] transition-colors duration-150 hover:bg-[#244B35] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 text-[#D6BD83]" aria-hidden="true" />
            <span className="tabular-nums">Bag ({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#173C2B]/15 text-[#173C2B] transition-colors hover:bg-[#E9E2D3] cursor-pointer"
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
        <div className="border-t border-[#173C2B]/10 bg-[#F3EBDD] px-5 py-4 md:hidden">
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
                      ? 'bg-[#E9E2D3] text-[#173C2B]'
                      : 'text-[#52665A] hover:bg-[#E9E2D3]/60 hover:text-[#173C2B]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="text-xs text-[#987B43]">Current</span>
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
