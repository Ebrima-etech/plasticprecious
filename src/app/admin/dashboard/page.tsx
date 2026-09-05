'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, getApiUrl } from '@/config/api';
import { getToken } from '@/lib/auth';

interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_users: number;
  total_revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_products: 0,
    total_orders: 0,
    total_users: 0,
    total_revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch products count
        const productsRes = await axios.get(`${API_BASE_URL}/products/`, { headers });
        const productsCount = productsRes.data.count || 0;

        // Fetch orders count
        const ordersRes = await axios.get(`${API_BASE_URL}/orders/`, { headers });
        const ordersCount = ordersRes.data.count || 0;

        // Calculate total revenue from orders
        let totalRevenue = 0;
        if (Array.isArray(ordersRes.data.results)) {
          totalRevenue = ordersRes.data.results.reduce(
            (sum: number, order: any) => sum + parseFloat(order.total_price || 0),
            0
          );
        }

        setStats({
          total_products: productsCount,
          total_orders: ordersCount,
          total_users: 0, // Would need user list endpoint
          total_revenue: totalRevenue,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    title,
    value,
    icon,
    color,
  }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
  }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className={`text-4xl mr-4`}>{icon}</div>
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={stats.total_products}
          icon="📦"
          color="border-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.total_orders}
          icon="🛒"
          color="border-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={`D ${stats.total_revenue.toLocaleString('en-GM')}`}
          icon="💰"
          color="border-yellow-500"
        />
        <StatCard
          title="Active Users"
          value={stats.total_users}
          icon="👥"
          color="border-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/products"
            className="block p-4 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition text-center"
          >
            <div className="text-2xl mb-2">📦</div>
            <p className="font-semibold text-blue-900">Manage Products</p>
          </a>
          <a
            href="/admin/orders"
            className="block p-4 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition text-center"
          >
            <div className="text-2xl mb-2">🛒</div>
            <p className="font-semibold text-green-900">View Orders</p>
          </a>
          <a
            href="/admin/users"
            className="block p-4 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 transition text-center"
          >
            <div className="text-2xl mb-2">👥</div>
            <p className="font-semibold text-purple-900">Manage Users</p>
          </a>
          <a
            href="/admin/content"
            className="block p-4 bg-yellow-50 border border-yellow-200 rounded hover:bg-yellow-100 transition text-center"
          >
            <div className="text-2xl mb-2">📝</div>
            <p className="font-semibold text-yellow-900">Edit Content</p>
          </a>
        </div>
      </div>
    </div>
  );
}
