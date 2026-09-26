'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';

interface EditOrderPageProps {
  params: {
    id: string;
  };
}

export default function EditOrderPage({ params }: EditOrderPageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`${API_BASE_URL}/orders/${params.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
        setStatus(response.data.status);
      } catch (err) {
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = getToken();
      await axios.patch(
        `${API_BASE_URL}/orders/${params.id}/update_status/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push('/admin/orders');
    } catch (err: any) {
      setError('Failed to update order status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  if (!order) {
    return <div className="text-center py-12 text-green-600">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Order {order.order_number || `#${order.id}`}</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Customer Email</label>
            <p className="text-lg text-slate-900 font-medium">{order.user_email}</p>
          </div>

          <div className="border-b border-slate-200 pb-4">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Total Price</label>
            <p className="text-2xl text-slate-900 font-bold">D {parseFloat(order.total_price).toLocaleString('en-GM')}</p>
          </div>

          <div className="border-b border-slate-200 pb-4">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Order Date</label>
            <p className="text-lg text-slate-900">{new Date(order.created_at).toLocaleDateString('en-GM', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>

      <form onSubmit={handleStatusChange} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Update Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 font-medium"
          >
            <option value="pending">Pending</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Status'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
