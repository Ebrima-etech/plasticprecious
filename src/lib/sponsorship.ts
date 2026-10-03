// Types and helpers for sponsorship pledges (mirrors preciousback/impact Sponsorship)

export interface SponsorshipOption {
  item_type: string;
  unit_price: number;
  currency: string;
  plastic_kg: number;
  description: string;
}

export interface Sponsorship {
  id: number;
  reference: string;
  sponsor_type: 'individual' | 'organization';
  sponsor_name: string;
  organization_name: string;
  sponsor_email: string;
  sponsor_phone: string;
  item_type: string;
  items_count: number;
  amount: string;
  currency: string;
  message: string;
  is_anonymous: boolean;
  status: SponsorshipStatus;
  status_label: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export type SponsorshipStatus = 'pending' | 'contacted' | 'paid' | 'delivered' | 'cancelled';

export const SPONSORSHIP_STATUSES: { value: SponsorshipStatus; label: string; style: string }[] = [
  { value: 'pending', label: 'Pending', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'contacted', label: 'Contacted', style: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'paid', label: 'Paid', style: 'bg-violet-50 text-violet-700 border-violet-200' },
  { value: 'delivered', label: 'Delivered', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'cancelled', label: 'Cancelled', style: 'bg-slate-100 text-slate-600 border-slate-200' },
];

// Used until /impact/sponsorship/options/ responds; matches the backend default
export const DEFAULT_SPONSORSHIP_OPTION: SponsorshipOption = {
  item_type: 'School Desk',
  unit_price: 150,
  currency: 'USD',
  plastic_kg: 5,
  description: 'An upcycled school desk delivered to a child in a rural Gambian school.',
};

export const formatMoney = (amount: number | string, currency: string) => {
  const value = typeof amount === 'number' ? amount : parseFloat(amount || '0');
  if (currency === 'GMD') return `D ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  try {
    return value.toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 });
  } catch {
    return `${currency} ${value.toLocaleString('en-US')}`;
  }
};
