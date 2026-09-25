export function formatDate(date: string | Date | null | undefined, format: string = 'MMM dd, yyyy'): string {
  if (!date) return '—';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '—';

    if (format === 'MMM dd, yyyy') {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(dateObj);
    }

    if (format === 'MMM dd') {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(dateObj);
    }

    if (format === 'yyyy-MM-dd') {
      return dateObj.toISOString().split('T')[0];
    }

    return dateObj.toLocaleDateString('en-US');
  } catch {
    return '—';
  }
}

export function formatCurrency(amount: string | number, currency: string = 'D'): string {
  try {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '—';
    return `${currency} ${num.toLocaleString('en-GM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } catch {
    return '—';
  }
}

export function formatStatusBadge(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    'payment_pending': { label: 'Payment Pending', color: 'bg-amber-100 text-amber-800' },
    'pending': { label: 'Pending', color: 'bg-amber-100 text-amber-800' },
    'paid': { label: 'Paid', color: 'bg-emerald-100 text-emerald-800' },
    'delivered': { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
    'processing': { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
    'shipped': { label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
    'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  };

  const normalized = status.toLowerCase().replace(/\s+/g, '_');
  return statusMap[normalized] || { label: status, color: 'bg-slate-100 text-slate-800' };
}

export function getStockStatus(stock: number): { label: string; color: string; variant: 'in-stock' | 'low-stock' | 'out-of-stock' } {
  if (stock === 0) {
    return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', variant: 'out-of-stock' };
  }
  if (stock <= 10) {
    return { label: `Low Stock (${stock})`, color: 'bg-amber-100 text-amber-800', variant: 'low-stock' };
  }
  return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-800', variant: 'in-stock' };
}
