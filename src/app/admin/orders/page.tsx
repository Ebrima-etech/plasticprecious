'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { AdminTableSkeleton } from '@/components/ShimmerSkeleton';
import { formatDate, formatCurrency, formatStatusBadge } from '@/lib/format-utils';
import { HiOutlineClock, HiOutlineArrowPath, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineShoppingCart } from 'react-icons/hi2';

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
    const fetchAllOrders = async () => {
      try {
        const token = getToken();
        let allOrders: Order[] = [];
        let nextUrl = `${API_BASE_URL}/orders/?limit=1000&offset=0`;

        while (nextUrl) {
          const response = await axios.get(nextUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const pageOrders = response.data.results || response.data || [];
          if (!Array.isArray(pageOrders)) {
            console.error('Unexpected response format:', response.data);
            break;
          }

          allOrders = [...allOrders, ...pageOrders];

          nextUrl = response.data.next || null;
          if (!nextUrl && response.data.results && response.data.count > allOrders.length) {
            // If there's no next URL but count suggests more results, try offset
            const nextOffset = allOrders.length;
            nextUrl = `${API_BASE_URL}/orders/?limit=1000&offset=${nextOffset}`;
          }
        }

        setOrders(allOrders);
      } catch (err: any) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="w-32 h-8 bg-gray-200 rounded shimmer-loading mb-2"></div>
          <div className="w-60 h-4 bg-gray-200 rounded shimmer-loading"></div>
        </div>
        <AdminTableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <HiOutlineShoppingCart className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
            <p className="text-sm text-slate-600 mt-0.5">Manage and track customer orders</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-600 font-medium">No orders yet</p>
          <p className="text-sm text-slate-500 mt-1">Orders from customers will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-200/80 h-12">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => {
                  const statusInfo = formatStatusBadge(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 truncate">{order.user_email}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 font-tabular-nums">
                        {formatCurrency(order.total_price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(order.created_at, 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}/edit`}>
                          <button className="px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
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
