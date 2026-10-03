import { cache } from 'react';
import { API_BASE_URL } from '@/config/api';
import type { CustomerImpact } from '@/lib/impact';

// Shared by the page, its metadata and the OG image; cache() dedupes the request within one render
export const getSharedImpact = cache(async (token: string): Promise<CustomerImpact | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/impact/share/${encodeURIComponent(token)}/`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as CustomerImpact;
  } catch {
    return null;
  }
});
