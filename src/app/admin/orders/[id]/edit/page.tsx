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
    return <div className="text-center py-12 text-red-600">Order not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order #{order.id}</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Email</label>
          <p className="text-gray-600">{order.user_email}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Total Price</label>
          <p className="text-gray-600">D {parseFloat(order.total_price).toLocaleString('en-GM')}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Created Date</label>
          <p className="text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>

      <form onSubmit={handleStatusChange}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Status'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
