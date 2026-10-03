// Shared types, choices and formatting for impact tracking (mirrors preciousback/impact)

export const PLASTIC_TYPES = [
  { value: 'PET', label: 'PET (1)' },
  { value: 'HDPE', label: 'HDPE (2)' },
  { value: 'PVC', label: 'PVC (3)' },
  { value: 'LDPE', label: 'LDPE (4)' },
  { value: 'PP', label: 'PP (5)' },
  { value: 'PS', label: 'PS (6)' },
  { value: 'MIXED', label: 'Mixed plastics' },
  { value: 'OTHER', label: 'Other' },
];

export const IMPACT_SOURCES = [
  { value: 'collection', label: 'Plastic collection' },
  { value: 'production', label: 'Production run' },
  { value: 'event', label: 'Event / workshop' },
  { value: 'sale', label: 'Product sale (offline)' },
  { value: 'adjustment', label: 'Manual adjustment' },
];

export const AUTO_VALUES = [
  { value: 'plastic_diverted_kg', label: 'Plastic diverted (kg)' },
  { value: 'plastic_collected_kg', label: 'Plastic collected (kg)' },
  { value: 'plastic_in_products_sold_kg', label: 'Recycled plastic in products sold (kg)' },
  { value: 'co2_saved_kg', label: 'CO₂ saved (kg)' },
  { value: 'water_saved_liters', label: 'Water saved (liters)' },
  { value: 'products_sold', label: 'Products sold' },
  { value: 'items_produced', label: 'Items produced' },
  { value: 'people_engaged', label: 'People engaged' },
  { value: 'bottles_equivalent', label: 'Bottles equivalent' },
];

// Matches GRAMS_PER_BOTTLE on the backend
export const GRAMS_PER_BOTTLE = 20;

export const plasticTypeLabel = (value?: string | null) =>
  PLASTIC_TYPES.find(t => t.value === value)?.label || '';

export interface ProductImpact {
  plastic_type?: string;
  plastic_recycled_kg?: string | number;
  co2_saved_kg?: string | number;
  water_saved_liters?: string | number;
  plastic_source?: string;
  impact_story?: string;
  bottles_equivalent?: number;
  has_impact?: boolean;
}

export interface LifetimeImpact {
  units_sold: number;
  plastic_kg: number;
  co2_saved_kg: number;
  water_saved_liters: number;
}

export interface ImpactTotals {
  plastic_diverted_kg: number;
  plastic_collected_kg: number;
  plastic_in_products_sold_kg: number;
  co2_saved_kg: number;
  water_saved_liters: number;
  products_sold: number;
  items_produced: number;
  people_engaged: number;
  bottles_equivalent: number;
  entries_count: number;
}

export interface MonthlyImpact {
  month: string;
  plastic_collected_kg: number;
  plastic_sold_kg: number;
  co2_saved_kg: number;
  products_sold: number;
}

export interface ImpactSummary {
  period: { start: string | null; end: string | null };
  totals: ImpactTotals;
  by_source: { source: string; label: string; plastic_kg: number; co2_saved_kg: number; items_count: number; people_engaged: number; entries: number }[];
  by_plastic_type: { plastic_type: string; label: string; plastic_kg: number }[];
  by_zone: { zone_id: number; name: string; plastic_kg: number }[];
  monthly: MonthlyImpact[];
  top_products?: { product_id: number; name: string; units_sold: number; plastic_kg: number; co2_saved_kg: number }[];
  catalog?: { products_total: number; products_with_impact: number };
  customers?: {
    supporters: number;
    plastic_kg: number;
    co2_saved_kg: number;
    products_bought: number;
    average_plastic_kg: number;
    top_supporter_plastic_kg: number;
    bottles_equivalent: number;
    levels: { key: string; name: string; min_kg: number; count: number }[];
  };
}

export interface ImpactMetric {
  id: number;
  label: string;
  value: string;
  auto_value: string;
  display_value: string;
  description: string;
  order: number;
  is_active: boolean;
}

export const toNumber = (value: string | number | null | undefined): number => {
  const n = typeof value === 'number' ? value : parseFloat(value || '0');
  return Number.isFinite(n) ? n : 0;
};

// 1234.5 -> "1,234.5"; whole numbers get no decimals
export const formatAmount = (value: string | number | null | undefined, maxDecimals = 1): string =>
  toNumber(value).toLocaleString('en-US', { maximumFractionDigits: maxDecimals });

// Kilograms with automatic switch to tonnes for big numbers
export const formatKg = (value: string | number | null | undefined): string => {
  const kg = toNumber(value);
  if (kg >= 1000) return `${formatAmount(kg / 1000, 2)} t`;
  return `${formatAmount(kg, kg < 10 ? 2 : 1)} kg`;
};

export const formatMonth = (month: string): string => {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

// --- Customer impact -----------------------------------------------------------

export interface CustomerBadge {
  key: string;
  name: string;
  description: string;
  earned: boolean;
}

export interface CustomerImpact {
  display_name: string;
  has_impact: boolean;
  since: string | null;
  totals: {
    plastic_kg: number;
    co2_saved_kg: number;
    water_saved_liters: number;
    products_bought: number;
    orders: number;
    distinct_products: number;
    bottles_equivalent: number;
    trees_equivalent: number;
  };
  level: { key: string; name: string; min_kg: number };
  next_level: { key: string; name: string; min_kg: number; remaining_kg: number; progress: number } | null;
  badges: CustomerBadge[];
  rank: { position: number; supporters: number; top_percent: number } | null;
  community: { plastic_diverted_kg: number; products_sold: number; supporters: number };
  // Only for the signed-in customer
  share_token?: string;
  products?: { product_id: number; name: string; units: number; plastic_kg: number; co2_saved_kg: number }[];
  pending?: { plastic_kg: number; co2_saved_kg: number };
}

export const LEVEL_ICONS: Record<string, string> = {
  seedling: '🌱',
  saver: '♻️',
  guardian: '🌊',
  hero: '🦸',
  champion: '🏆',
};

export const BADGE_ICONS: Record<string, string> = {
  first_step: '👣',
  one_kg: '⚖️',
  bottles_100: '🍶',
  climate_ally: '🌍',
  loyal: '💚',
  collector: '🧺',
};

export const shareUrlFor = (token: string, origin: string) => `${origin}/impact/share/${encodeURIComponent(token)}`;

export const shareMessage = (impact: Pick<CustomerImpact, 'totals'>, own = true) => {
  const kg = formatKg(impact.totals.plastic_kg);
  const bottles = formatAmount(impact.totals.bottles_equivalent, 0);
  return own
    ? `I've kept ${kg} of plastic (about ${bottles} bottles) out of the environment by buying recycled products from Precious Plastic Gambia ♻️ Join me!`
    : `Someone kept ${kg} of plastic out of the environment with Precious Plastic Gambia ♻️`;
};

export const formatSince = (since: string | null) =>
  since ? new Date(since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
