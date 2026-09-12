'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FiArrowLeft, FiPackage, FiTruck, FiCalendar } from 'react-icons/fi';
import { getAccessToken } from '@/lib/auth';
import { getApiUrl } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image?: string;
  };
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  created_at: string;
  total_price: string;
  status: string;
  items: OrderItem[];
  notes?: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(getApiUrl(`/orders/${orderId}/`), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(response.data);
      } catch (err: any) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar showNavLinks={true} />
        <section className="py-16 lg:py-24">
          <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-red-600 font-bold mb-6">{error || 'Order not found'}</p>
            <Link href="/account" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700">
              Back to Account
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/account" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold mb-8">
            <FiArrowLeft />
            Back to Account
          </Link>

          {/* Order Header */}
          <div className="bg-white border-2 border-emerald-200 rounded-3xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Order #{order.id}</h1>
                <p className="text-slate-600 flex items-center gap-2">
                  <FiCalendar size={16} />
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <span className={`text-lg font-bold px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
                {order.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <FiPackage className="text-emerald-600" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{item.product.name}</p>
                      <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                      <p className="text-emerald-600 font-bold">D {parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-slate-900">Total Amount</p>
                <p className="text-3xl font-black text-emerald-600">
                  D {parseFloat(order.total_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Status Info */}
            {order.status === 'payment_pending' && (
              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-orange-800 font-bold">⚠️ Payment Pending</p>
                <p className="text-sm text-orange-700 mt-1">Please complete your payment to proceed with this order.</p>
              </div>
            )}

            {order.status === 'delivered' && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-800 font-bold">✓ Order Delivered</p>
                <p className="text-sm text-green-700 mt-1">Thank you for your purchase!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/shop" className="block bg-emerald-50 border border-emerald-200 rounded-3xl p-6 hover:bg-emerald-100 transition text-center">
              <p className="text-lg font-bold text-slate-900">🛍️ Continue Shopping</p>
              <p className="text-sm text-slate-600 mt-1">Browse more products</p>
            </Link>

            <Link href="/account" className="block bg-slate-50 border border-slate-200 rounded-3xl p-6 hover:bg-slate-100 transition text-center">
              <p className="text-lg font-bold text-slate-900">📋 All Orders</p>
              <p className="text-sm text-slate-600 mt-1">View order history</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
