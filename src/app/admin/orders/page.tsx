'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { HiOutlineClock, HiOutlineArrowPath, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';

interface Order {
  id: number;
  user_email: string;
  total_price: string;
  status: string;
  created_at: string;
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: HiOutlineClock },
  processing: { color: 'bg-blue-100 text-blue-800', icon: HiOutlineArrowPath },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: HiOutlineArrowPath },
  delivered: { color: 'bg-green-100 text-green-800', icon: HiOutlineCheckCircle },
  cancelled: { color: 'bg-green-100 text-green-800', icon: HiOutlineXCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`${API_BASE_URL}/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.results || response.data || []);
      } catch (err: any) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track customer orders</p>
      </div>

      {error && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 font-medium">No orders yet</p>
          <p className="text-sm text-gray-500 mt-1">Orders from customers will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.user_email}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        D {parseFloat(order.total_price).toLocaleString('en-GM')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                          {<statusInfo.icon className="w-4 h-4" />}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}/edit`}>
                          <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
                            View →
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
