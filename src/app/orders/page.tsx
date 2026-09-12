'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FiChevronRight, FiPackage, FiArrowLeft } from 'react-icons/fi';
import { getAccessToken } from '@/lib/auth';
import { getApiUrl } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Order {
  id: number;
  created_at: string;
  total_price: string;
  status: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(getApiUrl('/orders/'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.results || response.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'payment_pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/account" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold mb-8">
            <FiArrowLeft />
            Back to Account
          </Link>

          <h1 className="text-4xl font-black text-slate-900 mb-12 flex items-center gap-2">
            <FiPackage className="text-emerald-600" />
            My Orders
          </h1>

          {orders.length === 0 ? (
            <div className="bg-white border-2 border-emerald-200 rounded-3xl p-12 text-center">
              <p className="text-slate-600 text-lg mb-6">You haven't placed any orders yet.</p>
              <Link href="/shop" className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="w-full bg-white border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-3xl p-6 transition text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <p className="text-xl font-black text-slate-900">Order #{order.id}</p>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-2xl font-black text-emerald-600">
                        D {parseFloat(order.total_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <FiChevronRight className="text-slate-400 text-2xl" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
