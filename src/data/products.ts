import { Product } from '../types';

export const BRAND_CONTACT = {
  domain: 'zestorahills.in',
  tradeEmail: 'trade@zestorahills.in',
  careEmail: 'care@zestorahills.in',
  phoneDisplay: '+91 6380951548',
  whatsappNumber: '916380951548',
  address: '9/54 A7A2, VOC Nagar, Gudalur, The Nilgiris- 643212, India.',
  hours: 'Monday – Saturday, 9:00 AM – 6:30 PM IST',
};

export const BRAND_LOGO = '/assets/aistudio/ZESTORA_HILLS_LOGO_87d02c2a.jpeg';
export const HERO_IMAGE = '/src/assets/images/hero_western_ghats_spices_1795192090415.jpg';
export const STORY_IMAGE = '/src/assets/images/story_western_ghats_estate_1795192095551.jpg';

const LEGACY_PRODUCTS: Product[] = [
  {
    id: 'whole-black-pepper',
    supabaseId: null,
    slug: 'whole-black-pepper',
    name: 'Black Pepper',
    botanicalName: 'Piper nigrum',
    category: 'Whole Spices',
    origin: 'Wayanad, Kerala',
    elevation: '950m – 1,200m ASL',
    grade: 'TGSEB 4.75mm+ Bold',
    harvestSeason: 'Jan – Mar Harvest',
    shortNote: 'Sun-dried Tellicherry garbled extra bold berries with crisp citrus-pine heat.',
    description:
      'Harvested late on the vine across shade-grown pepper estates in Wayanad, our Tellicherry Garbled Special Extra Bold (TGSEB) peppercorns mature longer for denser piperine bite and bright resinous aroma.',
    tastingNotes: ['Warm Woody Heat', 'Cracked Pine', 'Subtle Citrus Zest'],
    culinaryUses: 'Freshly cracked over charred vegetables, slow-braised broths, peppercorn crusts, and artisanal spice mills.',
    specHighlight: 'Piperine 5.4%+ · Volatile Oil 3.2% · Moisture < 11%',
    image: '/src/assets/images/product_black_pepper_1795192079115.jpg',
    imageAlt: 'Whole Tellicherry black peppercorns in a matte stoneware bowl on cream travertine',
    packs: {
      '100g': { size: '100g', priceInr: 199, sku: 'ZH-BLK-100' },
      '200g': { size: '200g', priceInr: 398, sku: 'ZH-BLK-200' },
    },
  },
  {
    id: 'green-cardamom',
    supabaseId: null,
    slug: 'green-cardamom',
    name: 'Green Cardamom',
    botanicalName: 'Elettaria cardamomum',
    category: 'Whole Spices',
    origin: 'Cardamom Hills, Idukki',
    elevation: '1,100m – 1,450m ASL',
    grade: '8mm+ Alleppey Green Bold',
    harvestSeason: 'Oct – Jan Harvest',
    shortNote: 'Plump emerald pods packed with oily dark seeds and sweet eucalyptus bloom.',
    description:
      'Hand-picked at peak maturity beneath rainforest canopies in Idukki and cured slowly in controlled-temperature kilns to preserve natural chlorophyll vibrancy and high cineole essential oil.',
    tastingNotes: ['Sweet Eucalyptus', 'Bright Floral', 'Warm Camphor Finish'],
    culinaryUses: 'Steeped in masala chai, saffron desserts, Scandinavian pastries, pulao infusions, and specialty spiced coffee.',
    specHighlight: 'Bold 8mm+ Sieve · Essential Oil 6.8% · Zero Artificial Dye',
    image: '/src/assets/images/product_green_cardamom_1795192083671.jpg',
    imageAlt: 'Bold green Idukki cardamom pods in a brushed brass tasting dish on travertine',
    packs: {
      '100g': { size: '100g', priceInr: 480, sku: 'ZH-CRD-100' },
      '200g': { size: '200g', priceInr: 960, sku: 'ZH-CRD-200' },
    },
  },
  {
    id: 'cinnamon',
    supabaseId: null,
    slug: 'cinnamon',
    name: 'Cinnamon',
    botanicalName: 'Cinnamomum verum',
    category: 'Whole Spices',
    origin: 'Malabar Foothills, Wayanad',
    elevation: '850m – 1,100m ASL',
    grade: 'True Alba-Style Thin Quills',
    harvestSeason: 'May – Nov Harvest',
    shortNote: 'Delicate hand-rolled inner bark quills with honeyed warmth and low coumarin.',
    description:
      'True Cinnamomum verum hand-peeled from young estate shoots along the Malabar slopes. Unlike coarse cassia, our thin, multi-layered quills crumble effortlessly and lend delicate floral sweetness.',
    tastingNotes: ['Delicate Honey', 'Clove Whisper', 'Warm Sweet Bark'],
    culinaryUses: 'Infused in artisanal hot chocolate, poached pears, slow-simmered biryanis, baking blends, and spiced infusions.',
    specHighlight: 'True Verum Species · Ultra-Low Coumarin · Hand-Rolled Quills',
    image: '/src/assets/images/hero_western_ghats_spices_1795192090415.jpg',
    imageClassName: 'object-[41%_35%] scale-[2.35] origin-[41%_35%]',
    imageAlt: 'Hand-rolled Malabar true cinnamon quills bundled with natural twine',
    packs: {
      '100g': { size: '100g', priceInr: 136, sku: 'ZH-CIN-100' },
      '200g': { size: '200g', priceInr: 274, sku: 'ZH-CIN-200' },
    },
  },
  {
    id: 'dried-ginger',
    supabaseId: null,
    slug: 'dried-ginger',
    name: 'Dried Ginger',
    botanicalName: 'Zingiber officinale',
    category: 'Whole Spices',
    origin: 'Kottayam & Wayanad',
    elevation: '750m – 1,050m ASL',
    grade: 'Unbleached Cochin Whole',
    harvestSeason: 'Dec – Feb Harvest',
    shortNote: 'Whole unbleached Cochin rhizomes with zesty lemon-pepper heat and zero lime wash.',
    description:
      'Grown in mineral-rich laterite soils of central Kerala, washed in spring water, and sun-dried naturally without sulfur or lime bleaching. Celebrated worldwide for its citrusy aroma and pungent gingerol depth.',
    tastingNotes: ['Bright Lemon Peel', 'Pungent Zing', 'Earthy Warmth'],
    culinaryUses: 'Crushed for herbal tisanes, winter broths, traditional chukku kaapi, gingerbread bakes, and spice rubs.',
    specHighlight: 'Unbleached Natural · Volatile Oil 2.1% · Fiber-Clean Select',
    image: '/src/assets/images/product_dried_ginger_1795192077331.jpg',
    imageAlt: 'Whole unbleached sun-dried Cochin ginger rhizomes on warm cream travertine',
    packs: {
      '100g': { size: '100g', priceInr: 88, sku: 'ZH-GNG-100' },
      '200g': { size: '200g', priceInr: 178, sku: 'ZH-GNG-200' },
    },
  },
  {
    id: 'cloves',
    supabaseId: null,
    slug: 'cloves',
    name: 'Cloves',
    botanicalName: 'Syzygium aromaticum',
    category: 'Whole Spices',
    origin: 'Kanyakumari & Ashambu Hills',
    elevation: '800m – 1,000m ASL',
    grade: 'Hand-Picked Full-Head Buds',
    harvestSeason: 'Jan – Apr Harvest',
    shortNote: 'Plump oil-rich reddish-brown flower buds harvested before bloom on southern slopes.',
    description:
      'Sourced from the misty southern tail of the Western Ghats, each unopened bud is hand-picked and sun-dried on woven mats until it turns rich mahogany, locking in exceptional eugenol oil content.',
    tastingNotes: ['Rich Sweet Spice', 'Warm Eugenol', 'Lingering Balsamic'],
    culinaryUses: 'Studded into braised meats, garam masala foundations, mulled wine, spiced syrups, and heritage pickles.',
    specHighlight: 'Volatile Oil 16%+ · Intact Heads > 96% · Stem-Free Select',
    image: '/src/assets/images/product_cloves_1795192098968.jpg',
    imageAlt: 'Plump dark reddish-brown whole cloves in a carved walnut dish on travertine',
    packs: {
      '100g': { size: '100g', priceInr: 258, sku: 'ZH-CLV-100' },
      '200g': { size: '200g', priceInr: 518, sku: 'ZH-CLV-200' },
    },
  },
  {
    id: 'star-anise',
    supabaseId: null,
    slug: 'star-anise',
    name: 'Star Anise',
    botanicalName: 'Illicium verum',
    category: 'Whole Spices',
    origin: 'High-Altitude Partner Groves',
    elevation: '1,200m – 1,500m ASL',
    grade: 'Whole Intact Autumn Stars',
    harvestSeason: 'Oct – Dec Harvest',
    shortNote: 'Sculptural intact eight-pointed stars prized for sweet licorice depth and amber luster.',
    description:
      'Carefully sorted by hand so every star arrives whole and lustrous rather than crushed. Rich in natural anethole, our star anise elevates slow reductions, stocks, and fragrant spice blends.',
    tastingNotes: ['Velvet Licorice', 'Warm Fennel', 'Subtle Woody Sweet'],
    culinaryUses: 'Essential for aromatic pho broths, Chettinad masalas, slow-braised duck, spiced chai, and winter syrups.',
    specHighlight: 'Whole Intact Stars > 92% · High Anethole · Sun-Cured',
    image: '/src/assets/images/product_star_anise_1795192097951.jpg',
    imageAlt: 'Intact eight-pointed whole star anise pods beside a brushed brass scoop on travertine',
    packs: {
      '100g': { size: '100g', priceInr: 133, sku: 'ZH-STA-100' },
      '200g': { size: '200g', priceInr: 268, sku: 'ZH-STA-200' },
    },
  },
  {
    id: 'dried-bay-leaf',
    supabaseId: null,
    slug: 'dried-bay-leaf',
    name: 'Bay Leaf',
    botanicalName: 'Cinnamomum tamala',
    category: 'Aromatics & Herbs',
    origin: 'Western Ghats Ridge Groves',
    elevation: '1,000m – 1,350m ASL',
    grade: 'Whole Shade-Dried Select',
    harvestSeason: 'Nov – Feb Harvest',
    shortNote: 'Whole aromatic Malabar tejpatta leaves cured in shade to retain olive vibrancy.',
    description:
      'Picked whole from mature canopy trees and dried slowly away from harsh midday sun. The intact olive leaves release layered clove-cinnamon herbal warmth when tempered in warm ghee or slow stocks.',
    tastingNotes: ['Herbal Clove', 'Soft Cinnamon Leaf', 'Crisp Forest Canopy'],
    culinaryUses: 'Tempered whole in biryanis, slow lentils, coastal curries, bone broths, and fragrant rice pilafs.',
    specHighlight: 'Whole Unbroken Leaves · Shade-Dried · Natural Olive Hue',
    image: '/src/assets/images/product_dried_bay_leaf_1795192095045.jpg',
    imageAlt: 'Whole sun-cured olive-green Malabar bay leaves layered on cream travertine',
    packs: {
      '100g': { size: '100g', priceInr: 84, sku: 'ZH-BAY-100' },
      '200g': { size: '200g', priceInr: 170, sku: 'ZH-BAY-200' },
    },
  },
  {
    id: 'dried-rosemary',
    supabaseId: null,
    slug: 'dried-rosemary',
    name: 'Dried Rosemary',
    botanicalName: 'Salvia rosmarinus',
    category: 'Aromatics & Herbs',
    origin: 'Nilgiris & Kodaikanal Hills',
    elevation: '1,650m – 2,000m ASL',
    grade: 'Mountain-Grown Whole Needles',
    harvestSeason: 'Year-Round Micro-Lots',
    shortNote: 'Crisp high-altitude rosemary needles bursting with pine, lemon, and woodland resin.',
    description:
      'Cultivated in cool highland air across the Nilgiri and Palani hills of the southern Western Ghats. Air-cured in small lots to preserve vibrant pine-green needles and crisp Mediterranean-meets-mountain aroma.',
    tastingNotes: ['Fresh Pine Needle', 'Crushed Sage', 'Bright Citrus Resin'],
    culinaryUses: 'Artisan focaccia, roasted root vegetables, herb-infused olive oils, grilled meats, and botanical teas.',
    specHighlight: 'High-Altitude Grown · Low-Temp Air Cured · Stem-Sorted',
    image: '/src/assets/images/product_dried_rosemary_1795192096948.jpg',
    imageAlt: 'Dried mountain rosemary sprigs and needles in a matte cream ceramic bowl on travertine',
    packs: {
      '100g': { size: '100g', priceInr: 147, sku: 'ZH-RSM-100' },
      '200g': { size: '200g', priceInr: 296, sku: 'ZH-RSM-200' },
    },
  },
  {
    id: 'nutmeg',
    supabaseId: null,
    slug: 'nutmeg',
    name: 'Nutmeg',
    botanicalName: 'Myristica fragrans',
    category: 'Whole Spices',
    origin: 'Thrissur & Idukki Orchards',
    elevation: '600m – 950m ASL',
    grade: 'Whole Sound Shell-Free (ABCD)',
    harvestSeason: 'Jun – Sep Harvest',
    shortNote: 'Heavy, richly marbled whole kernels meant to be freshly grated at the table.',
    description:
      'Naturally fallen ripe fruits are collected each morning in heritage river-valley orchards, slowly sun-dried in shell for six weeks, then gently cracked to select only dense, oil-marbled whole kernels.',
    tastingNotes: ['Warm Nutty Sweet', 'Spiced Cedar', 'Creamy Aromatic Finish'],
    culinaryUses: 'Freshly microplaned over béchamel, pumpkin velouté, kheer, spiced custards, and classic baking.',
    specHighlight: 'Sound Whole Kernels · Essential Oil 9%+ · Aflatoxin Tested',
    image: '/src/assets/images/product_nutmeg_1795192079946.jpg',
    imageAlt: 'Whole shell-free nutmeg kernels with a marbled halved seed on cream travertine',
    packs: {
      '100g': { size: '100g', priceInr: 202, sku: 'ZH-NTM-100' },
      '200g': { size: '200g', priceInr: 406, sku: 'ZH-NTM-200' },
    },
  },
  {
    id: 'roasted-coffee-beans',
    supabaseId: null,
    slug: 'roasted-coffee-beans',
    name: 'Roasted Coffee Beans',
    botanicalName: 'Coffea arabica (S.795 & Kent)',
    category: 'Estate Coffee',
    origin: 'Chikmagalur & Coorg Estates',
    elevation: '1,250m – 1,500m ASL',
    grade: 'Single-Estate AA · Medium-Dark',
    harvestSeason: 'Dec – Feb Estate Lot',
    shortNote: 'Shade-grown Western Ghats Arabica roasted in small batches with dark cocoa richness.',
    description:
      'Intercropped alongside pepper vines and silver oak shade trees in the Baba Budangiri and Coorg highlands. Washed, sun-dried on raised patios, and small-batch roasted weekly for velvety crema and balanced sweetness.',
    tastingNotes: ['70% Dark Chocolate', 'Toasted Hazelnut', 'Spiced Caramel'],
    culinaryUses: 'Ideal for espresso, moka pot, French press, South Indian filter brew, and cold brew concentrate.',
    specHighlight: '100% Shade-Grown Arabica AA · Roasted Fresh Weekly · Valve-Sealed',
    image: '/src/assets/images/product_roasted_coffee_1795192100728.jpg',
    imageAlt: 'Medium-dark roasted single-estate Arabica coffee beans spilling from a forest-green ceramic vessel',
    packs: {
      '100g': { size: '100g', priceInr: 210, sku: 'ZH-COF-100' },
      '200g': { size: '200g', priceInr: 422, sku: 'ZH-COF-200' },
    },
  },
];

// Current retail collection. Existing prices are retained only for unchanged legacy spice packs.
// Newly introduced pack sizes and products intentionally carry a zero-price placeholder until pricing is confirmed.
const spiceIds = new Set([
  'whole-black-pepper', 'green-cardamom', 'cinnamon', 'dried-ginger',
  'cloves', 'star-anise', 'dried-bay-leaf', 'nutmeg',
]);
const legacySpices = LEGACY_PRODUCTS.filter((p) => spiceIds.has(p.id)).map((p) => ({
  ...p,
  category: 'Whole Spices' as const,
  packs: {
    '50g': { size: '50g' as const, priceInr: 0, sku: `ZH-${p.id.toUpperCase().replaceAll('-', '').slice(0, 6)}-50` },
    ...p.packs,
  },
}));
const coffeeBase = LEGACY_PRODUCTS.find((p) => p.id === 'roasted-coffee-beans')!;
const coffeePack = { '500g': { size: '500g' as const, priceInr: 0, sku: 'ZH-COF-500' } };
const coffeeProducts: Product[] = [
  {
    ...coffeeBase, id: 'espresso-coffee-blend', supabaseId: null, slug: 'espresso-coffee-blend',
    name: 'Espresso Coffee – Arabica & Robusta Blend', category: 'Estate Coffee',
    botanicalName: 'Arabica & Robusta blend', grade: 'Medium-Dark Roast',
    shortNote: 'A balanced Arabica and Robusta blend developed for espresso extraction.',
    description: 'A medium-dark roasted blend of Arabica and Robusta coffee, prepared for espresso-style brewing.',
    tastingNotes: ['Roasted Cocoa', 'Caramel', 'Full-Bodied Finish'],
    culinaryUses: 'Designed for espresso machines and milk-based coffee drinks.',
    specHighlight: 'Arabica & Robusta Blend · Medium-Dark Roast',
    packs: coffeePack,
  },
  {
    ...coffeeBase, id: 'south-indian-filter-coffee', supabaseId: null, slug: 'south-indian-filter-coffee',
    name: 'South Indian Filter Coffee – Arabica & Robusta Blend', category: 'Estate Coffee',
    botanicalName: 'Arabica & Robusta blend', grade: 'Medium-Dark Roast',
    shortNote: 'A comforting Arabica and Robusta blend for traditional South Indian filter brewing.',
    description: 'A medium-dark roasted Arabica and Robusta blend intended for traditional South Indian filter coffee preparation.',
    tastingNotes: ['Deep Roast', 'Chocolate', 'Rounded Body'],
    culinaryUses: 'Prepared in a traditional South Indian metal filter; serve with hot milk if desired.',
    specHighlight: 'Arabica & Robusta Blend · Medium-Dark Roast',
    packs: { '500g': { size: '500g', priceInr: 0, sku: 'ZH-SIF-500' } },
  },
  {
    ...coffeeBase, id: 'whole-roasted-coffee-beans', supabaseId: null, slug: 'whole-roasted-coffee-beans',
    name: 'Whole Roasted Coffee Beans', category: 'Estate Coffee',
    botanicalName: 'Roasted whole coffee beans', grade: 'Whole Bean · 500g',
    shortNote: 'Whole roasted coffee beans, ready to grind fresh for your preferred brew.',
    description: 'Whole roasted coffee beans supplied unground so you can grind them fresh for your preferred brewing method.',
    tastingNotes: ['Fresh Roast Aroma', 'Cocoa', 'Warm Nutty Notes'],
    culinaryUses: 'Grind to suit espresso, South Indian filter, moka pot or other brewing methods.',
    specHighlight: 'Whole Roasted Beans · 500g',
    packs: { '500g': { size: '500g', priceInr: 0, sku: 'ZH-WRB-500' } },
  },
];
const teaBase = LEGACY_PRODUCTS.find((p) => p.id === 'dried-bay-leaf')!;
const teaProducts: Product[] = [
  {
    ...teaBase, id: 'hibiscus-infusion-tea', supabaseId: null, slug: 'hibiscus-infusion-tea',
    name: 'Hibiscus Infusion Tea', category: 'Infused Teas',
    botanicalName: 'Hibiscus sabdariffa', grade: 'Dried Hibiscus Infusion',
    shortNote: 'A vivid floral infusion with a naturally tart character.',
    description: 'Dried hibiscus petals for a bright, ruby-coloured herbal infusion. Enjoy hot or chilled.',
    tastingNotes: ['Floral', 'Tart', 'Cranberry-Like'],
    culinaryUses: 'Steep in hot water and enjoy plain or with your preferred sweetener.',
    specHighlight: 'Herbal Infusion · 50g',
    packs: { '50g': { size: '50g', priceInr: 0, sku: 'ZH-HIB-50' } },
  },
  {
    ...teaBase, id: 'blue-pea-infusion-tea', supabaseId: null, slug: 'blue-pea-infusion-tea',
    name: 'Blue Pea Infusion Tea', category: 'Infused Teas',
    botanicalName: 'Clitoria ternatea', grade: 'Dried Blue Pea Flowers',
    shortNote: 'A naturally blue botanical infusion made from dried butterfly pea flowers.',
    description: 'Dried blue pea flowers that brew into a striking blue herbal infusion, with a colour-changing response to citrus.',
    tastingNotes: ['Delicate', 'Earthy', 'Mild Floral'],
    culinaryUses: 'Steep in hot water; add lemon or lime to see the infusion shift in colour.',
    specHighlight: 'Herbal Infusion · 50g',
    packs: { '50g': { size: '50g', priceInr: 0, sku: 'ZH-BPT-50' } },
  },
  {
    ...teaBase, id: 'lemongrass-infusion-tea', supabaseId: null, slug: 'lemongrass-infusion-tea',
    name: 'Lemongrass Infusion Tea', category: 'Infused Teas',
    botanicalName: 'Cymbopogon citratus', grade: 'Dried Lemongrass',
    shortNote: 'A refreshing herbal infusion with clean citrus notes.',
    description: 'Dried lemongrass prepared for a light, fragrant herbal infusion.',
    tastingNotes: ['Lemon Zest', 'Fresh Herb', 'Clean Finish'],
    culinaryUses: 'Steep in hot water and enjoy as a refreshing caffeine-free infusion.',
    specHighlight: 'Herbal Infusion · 50g',
    packs: { '50g': { size: '50g', priceInr: 0, sku: 'ZH-LEM-50' } },
  },
];
export const PRODUCTS: Product[] = [...legacySpices, ...coffeeProducts, ...teaProducts];


export const WHOLESALE_PACKAGING_OPTIONS = [
  {
    title: 'Vacuum Foil-Lined Bulk Pouches',
    weights: '1 kg · 5 kg',
    idealFor: 'Specialty roasters, boutique foodservice, chef kitchens, and artisanal spice blenders.',
    spec: 'Multi-layer metallized barrier film with nitrogen flush or vacuum seal to lock volatile essential oils for 18+ months.',
  },
  {
    title: 'Export Multi-Wall Kraft & Jute Sacks',
    weights: '10 kg · 25 kg · 50 kg',
    idealFor: 'International importers, regional distributors, and industrial culinary processors.',
    spec: 'Food-grade inner LDPE/HM-HDPE moisture liner stitched inside unbleached multi-wall kraft or export-grade jute bags with batch stenciling.',
  },
  {
    title: 'Private Label & Hospitality Retail',
    weights: '100 g · 200 g · Custom Tins',
    idealFor: 'Luxury hospitality groups, organic grocers, and gourmet private-label brands.',
    spec: 'Turnkey custom pouch or glass jar packing with export-compliant nutrition panels, barcode labeling, and batch QR traceability.',
  },
];

export const MOQ_TIERS = [
  {
    program: 'B2B Evaluation Sample Kit',
    moq: '100g × up to 6 SKUs',
    packaging: 'Aroma-lock foil pouches + COA spec sheets',
    leadTime: '3 – 5 Business Days',
    channel: 'Courier (India & Global DHL)',
  },
  {
    program: 'Domestic Wholesale (India)',
    moq: '10 kg per SKU (or 25 kg assorted)',
    packaging: '5 kg vacuum pouches or 10 kg kraft liners',
    leadTime: '4 – 7 Business Days',
    channel: 'Insured Pan-India Road / Air Cargo',
  },
  {
    program: 'International Air Freight (LCL)',
    moq: '50 kg per SKU (100 kg min order)',
    packaging: '5 kg vacuum cartons / 25 kg export bags',
    leadTime: '7 – 12 Business Days',
    channel: 'Ex-Kochi (COK) / Bengaluru (BLR)',
  },
  {
    program: 'Consolidated Sea Freight / FCL',
    moq: '500 kg – 14 MT (20ft Container)',
    packaging: '25 kg / 50 kg palletized export sacks',
    leadTime: '14 – 21 Business Days',
    channel: 'FOB Cochin Port (INCOK) / CIF Global',
  },
];

export const COMPLIANCE_CREDENTIALS = [
  {
    code: 'FSSAI Licensing',
    scope: 'Food Safety & Standards Authority of India',
    detail: 'Applicable licence status and permitted activities will be confirmed before product sale or dispatch.',
  },
  {
    code: 'Spices Board Registration',
    scope: 'Exporter registration for eligible spice products',
    detail: 'Registration requirements and status will be confirmed before accepting any export order for regulated products.',
  },
  {
    code: 'IEC & Export Documentation',
    scope: 'DGFT Import Export Code and destination-specific paperwork',
    detail: 'Required documents depend on the product and destination. Availability will be confirmed for each export enquiry.',
  },
  {
    code: 'Product Testing',
    scope: 'Independent laboratory testing where required',
    detail: 'Testing and certificates of analysis can be discussed based on buyer specifications and applicable requirements.',
  },
];

export const WESTERN_GHATS_REGIONS = [
  {
    region: 'Cardamom Hills, Idukki',
    elevation: '1,100m – 1,450m',
    microclimate: 'Mist-draped rainforest canopy, 2,800mm monsoon rain',
    harvests: '8mm+ Bold Green Cardamom, Whole Nutmeg',
    window: 'Oct – Jan',
  },
  {
    region: 'Wayanad & Malabar Foothills',
    elevation: '850m – 1,200m',
    microclimate: 'Volcanic forest loam, warm dry harvest winters',
    harvests: 'TGSEB Black Pepper, True Cinnamon, Cochin Ginger',
    window: 'Dec – Mar',
  },
  {
    region: 'Chikmagalur & Coorg',
    elevation: '1,250m – 1,500m',
    microclimate: 'Two-tier native shade canopy, cool highland nights',
    harvests: 'Single-Estate AA Arabica Coffee Beans',
    window: 'Dec – Feb',
  },
  {
    region: 'Kanyakumari & Ashambu Slopes',
    elevation: '800m – 1,000m',
    microclimate: 'Dual-monsoon coastal mountain humidity',
    harvests: 'High-Oil Hand-Picked Cloves, Malabar Bay Leaf',
    window: 'Jan – Apr',
  },
  {
    region: 'Nilgiris & Kodaikanal',
    elevation: '1,650m – 2,000m',
    microclimate: 'Crisp temperate highland air, misty mornings',
    harvests: 'Botanical infusion ingredients; origin confirmed by lot',
    window: 'Year-Round',
  },
];

export const FARM_TO_PACK_STEPS = [
  {
    step: '01',
    title: 'Direct Estate Harvest',
    detail:
      'We partner directly with third-generation family growers across Idukki, Wayanad, and Chikmagalur. Crops are picked at full botanical maturity rather than stripped early for commodity auctions.',
  },
  {
    step: '02',
    title: 'Slow Solar & Shade Curing',
    detail:
      'Peppercorns and coffee cherries cure slowly on raised stone terraces; cardamom and bay leaves dry gently in controlled-heat shade houses to lock natural color and essential oils without sulfur or dyes.',
  },
  {
    step: '03',
    title: 'Gravity & Optical Grading',
    detail:
      'Every lot undergoes gravity separation, sieve sizing (8mm+ cardamom, 4.75mm+ pepper), and hand-sorting at our Idukki curing house, followed by moisture and oil-density verification.',
  },
  {
    step: '04',
    title: 'Small-Batch Aroma-Lock Packing',
    detail:
      'Spices are packed whole in oxygen-barrier pouches and coffee is small-batch roasted to order with one-way degassing valves—reaching your kitchen or export port weeks after harvest.',
  },
];
