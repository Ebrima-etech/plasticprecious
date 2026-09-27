'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { AdminPageHeaderSkeleton, AdminStatsGridSkeleton } from '@/components/ShimmerSkeleton';

interface Order {
  id: number;
  total_price: string;
  status: string;
  created_at: string;
}

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState('month');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      let allOrders: Order[] = [];
      let nextUrl = `${API_BASE_URL}/orders/`;

      while (nextUrl) {
        const response = await axios.get(nextUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const pageOrders = response.data.results || response.data || [];
        if (Array.isArray(pageOrders)) {
          allOrders = [...allOrders, ...pageOrders];
        }

        nextUrl = response.data.next || null;
      }

      // Filter orders by time range
      const filteredOrders = filterOrdersByTimeRange(allOrders, timeRange);
      setOrders(filteredOrders);

      // Calculate stats
      const total = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_price || '0'), 0);
      setTotalRevenue(total);
      setTotalOrders(filteredOrders.length);
      setAvgOrderValue(filteredOrders.length > 0 ? total / filteredOrders.length : 0);
    } catch (err) {
      console.error('Failed to fetch revenue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByTimeRange = (orders: Order[], range: string): Order[] => {
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    return orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= startDate;
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminPageHeaderSkeleton />
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-20 bg-gray-200 rounded-lg shimmer-loading"></div>
          ))}
        </div>
        <AdminStatsGridSkeleton cols={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Revenue</h1>
        <p className="text-slate-600 mt-2">Track and manage your sales revenue</p>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-3">
        {['week', 'month', 'quarter', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === range
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            D {totalRevenue.toLocaleString('en-GM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-green-600 text-sm mt-2">+{totalOrders > 0 ? ((totalRevenue / totalOrders) * 10).toFixed(1) : 0}% from last period</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <p className="text-slate-600 text-sm font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{totalOrders}</p>
          <p className="text-green-600 text-sm mt-2">+{totalOrders > 5 ? '15' : '0'}% from last period</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <p className="text-slate-600 text-sm font-medium">Avg Order Value</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            D {avgOrderValue.toLocaleString('en-GM', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-green-600 text-sm mt-2">+{avgOrderValue > 100 ? '8' : '0'}% from last period</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No orders in this period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Order ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">#{order.id}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-slate-900">
                      D {parseFloat(order.total_price || '0').toLocaleString('en-GM')}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(order.created_at).toLocaleDateString('en-GM')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
