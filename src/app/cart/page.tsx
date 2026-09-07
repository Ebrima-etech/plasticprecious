'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Cart, CartItem } from '@/types';
import { API_BASE_URL, getApiUrl } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await axios.get(getApiUrl('/cart/'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const token = getAccessToken();
      await axios.patch(
        getApiUrl('/cart/update_item/'),
        { cart_item_id: cartItemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      setError('Failed to update cart');
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const token = getAccessToken();
      await axios.delete(
        getApiUrl('/cart/remove_item/'),
        {
          data: { cart_item_id: cartItemId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .grid-pattern {
          background-image:
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 0 0;
        }
      `}</style>
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
            🛒 CART
          </div>
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">Shopping Cart</h1>
          <p className="text-xl max-w-2xl text-emerald-50">Review and manage your items</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {cart && cart.items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col h-full hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300">
                  {cart.items.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-6 border-b border-slate-200 last:border-b-0"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">{item.product.name}</h3>
                        <p className="text-emerald-600 font-bold">D {parseFloat(item.product.price).toLocaleString('en-GM')}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-slate-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 text-slate-900 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 font-semibold transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col h-full hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300 p-8 sticky top-4">
                  <h3 className="text-lg font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition">Order Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">D {parseFloat(cart.total_price || '0').toLocaleString('en-GM')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span className="font-semibold text-emerald-600">Free</span>
                    </div>
                    <div className="border-t border-slate-200 pt-4 flex justify-between font-black text-lg text-slate-900">
                      <span>Total</span>
                      <span className="text-emerald-600">D {parseFloat(cart.total_price || '0').toLocaleString('en-GM')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col h-full hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300 p-12 text-center">
              <p className="text-xl text-slate-600 mb-6">Your cart is empty</p>
              <button
                onClick={() => router.push('/shop')}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors w-fit mx-auto"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
