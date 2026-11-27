export type PageRoute = 'home' | 'wholesale' | 'story' | 'contact';

export type PackSize = '50g' | '100g' | '200g' | '500g';

export type ProductCategory = 'Whole Spices' | 'Aromatics & Herbs' | 'Estate Coffee' | 'Infused Teas';

export interface PackVariant {
  size: PackSize;
  priceInr: number;
  sku: string;
  stockQuantity?: number;
}

export interface Product {
  id: string;
  supabaseId: string | null;
  slug: string;
  name: string;
  botanicalName: string;
  category: ProductCategory;
  origin: string;
  elevation: string;
  grade: string;
  harvestSeason: string;
  shortNote: string;
  description: string;
  tastingNotes: string[];
  culinaryUses: string;
  specHighlight: string;
  image: string;
  imageClassName?: string;
  imageAlt: string;
  packs: Partial<Record<PackSize, PackVariant>>;
}

export interface CartItem {
  productId: string;
  packSize: PackSize;
  quantity: number;
}

export type InquiryMode = 'Bulk & Export Quote' | 'Domestic Wholesale' | 'Retail & Gifting';

export interface QuotePrefill {
  mode?: InquiryMode;
  products?: string[];
  packaging?: string;
  note?: string;
}
