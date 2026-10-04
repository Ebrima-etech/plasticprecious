// Delivery address block for order pages (uses the address lines built by the backend)
interface ShippingAddressProps {
  order: {
    shipping_address?: string[];
    shipping_phone?: string;
    shipping_email?: string;
    is_international?: boolean;
    delivery_fee?: string | number;
  };
  title?: string;
}

export default function ShippingAddress({ order, title = 'Delivery address' }: ShippingAddressProps) {
  const lines = order.shipping_address || [];
  if (lines.length === 0) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="m-0 text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</h3>
        {order.is_international && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">International</span>
        )}
      </div>
      <address className="not-italic text-sm text-slate-700 leading-relaxed">
        {lines.map((line, idx) => (
          <span key={idx} className={`block ${idx === 0 ? 'font-semibold text-slate-900' : ''}`}>{line}</span>
        ))}
      </address>
      {(order.shipping_phone || order.shipping_email) && (
        <p className="m-0 mt-2 text-sm text-slate-600">
          {order.shipping_phone && <a href={`tel:${order.shipping_phone}`} className="hover:text-emerald-700">{order.shipping_phone}</a>}
          {order.shipping_phone && order.shipping_email && ' · '}
          {order.shipping_email && <a href={`mailto:${order.shipping_email}`} className="hover:text-emerald-700">{order.shipping_email}</a>}
        </p>
      )}
      {order.delivery_fee !== undefined && parseFloat(String(order.delivery_fee)) > 0 && (
        <p className="m-0 mt-2 text-sm text-slate-600">
          {order.is_international ? 'International shipping' : 'Delivery'}: D {parseFloat(String(order.delivery_fee)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      )}
    </div>
  );
}
