'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

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

        const productsRes = await axios.get(`${API_BASE_URL}/products/`, { headers });
        const productsCount = productsRes.data.count || 0;

        const ordersRes = await axios.get(`${API_BASE_URL}/orders/`, { headers });
        const ordersCount = ordersRes.data.count || 0;

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
          total_users: 0,
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
    variant,
  }: {
    title: string;
    value: string | number;
    icon: string;
    variant: 'primary' | 'success' | 'warning' | 'info';
  }) => {
    const colors = {
      primary: 'from-primary-50 to-primary-100',
      success: 'from-green-50 to-green-100',
      warning: 'from-yellow-50 to-yellow-100',
      info: 'from-blue-50 to-blue-100',
    };

    return (
      <Card shadow="sm" hover>
        <CardBody>
          <div className="flex items-center gap-4">
            <div className={`text-4xl p-3 rounded-lg bg-gradient-to-br ${colors[variant]}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-600">{title}</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{value}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  const QuickAction = ({ href, icon, title, description }: any) => (
    <Link href={href}>
      <Card hover interactive shadow="sm">
        <CardBody className="text-center py-6">
          <div className="text-4xl mb-3">{icon}</div>
          <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
          <p className="text-sm text-neutral-600">{description}</p>
        </CardBody>
      </Card>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-neutral-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-2">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.total_products}
          icon="📦"
          variant="primary"
        />
        <StatCard
          title="Total Orders"
          value={stats.total_orders}
          icon="🛒"
          variant="success"
        />
        <StatCard
          title="Total Revenue"
          value={`D ${stats.total_revenue.toLocaleString('en-GM')}`}
          icon="💰"
          variant="warning"
        />
        <StatCard
          title="Active Users"
          value={stats.total_users}
          icon="👥"
          variant="info"
        />
      </div>

      {/* Quick Actions */}
      <Card shadow="base">
        <CardHeader className="border-b border-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-900">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickAction
              href="/admin/products"
              icon="📦"
              title="Products"
              description="Manage your product catalog"
            />
            <QuickAction
              href="/admin/products/new"
              icon="➕"
              title="Add Product"
              description="Create a new product"
            />
            <QuickAction
              href="/admin/orders"
              icon="🛒"
              title="Orders"
              description="View and manage orders"
            />
            <QuickAction
              href="/admin/categories"
              icon="📂"
              title="Categories"
              description="Manage product categories"
            />
          </div>
        </CardBody>
      </Card>

      {/* Recent Activity Card */}
      <Card shadow="base">
        <CardHeader className="border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Recent Orders</h2>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                View All →
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-neutral-600 font-medium">No recent orders</p>
            <p className="text-sm text-neutral-500 mt-1">Check back when new orders arrive</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
