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
import { EmptyState } from '@/components/ui/EmptyState';

interface Order {
  id: number;
  user_email: string;
  total_price: string;
  status: string;
  created_at: string;
}

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
} as const;

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
          <Spinner size="lg" />
          <p className="mt-4 text-neutral-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-neutral-900">Orders</h1>
        <p className="text-neutral-600 mt-2">Manage and track customer orders</p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error text-error rounded-lg">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <Card shadow="sm">
          <CardBody>
            <EmptyState
              title="No orders yet"
              description="Orders from customers will appear here"
            />
          </CardBody>
        </Card>
      ) : (
        <Card shadow="base">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-neutral-900 font-semibold">#{order.id}</td>
                    <td className="px-6 py-4 text-neutral-600">{order.user_email}</td>
                    <td className="px-6 py-4 text-neutral-900 font-medium">
                      D {parseFloat(order.total_price).toLocaleString('en-GM')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={statusColors[order.status as keyof typeof statusColors] || 'neutral'}
                        size="sm"
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
