export type PageRoute = 'home' | 'wholesale' | 'story' | 'contact';

export type PackSize = '100g' | '200g';

export type ProductCategory = 'Whole Spices' | 'Aromatics & Herbs' | 'Estate Coffee';

export interface PackVariant {
  size: PackSize;
  priceInr: number;
  sku: string;
}

export interface Product {
  id: string;
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
  packs: Record<PackSize, PackVariant>;
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
