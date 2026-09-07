'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Cart, CartItem } from '@/types';
import { API_BASE_URL, getApiUrl } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { cartService } from '@/lib/cartService';
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

      const data = await cartService.getCart();
      setCart(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load cart');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await cartService.updateCartItem(cartItemId, quantity);
      fetchCart();
    } catch (err) {
      setError('Failed to update cart');
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await cartService.removeFromCart(cartItemId);
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
                <div className="space-y-4">
                  {cart.items.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300 p-6"
                    >
                      <div className="flex items-center gap-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-100 to-emerald-50 border border-slate-200">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiShoppingCart className="w-8 h-8 text-emerald-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition text-lg">
                            {item.product.name}
                          </h3>
                          <p className="text-emerald-600 font-bold">D {parseFloat(item.product.price).toLocaleString('en-GM')}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            Subtotal: D {(parseFloat(item.product.price) * item.quantity).toLocaleString('en-GM')}
                          </p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border-2 border-slate-200 rounded-lg bg-slate-50 hover:border-emerald-400 transition">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-white text-slate-600 hover:text-emerald-600 transition font-bold"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="px-4 py-2 text-slate-900 font-black min-w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-white text-slate-600 hover:text-emerald-600 transition font-bold"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-red-600 hover:text-red-800 hover:bg-red-50 transition"
                            title="Remove item"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col h-full hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300 p-8 sticky top-4 space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-emerald-600 transition">Order Summary</h3>
                    <p className="text-sm text-slate-600">{cart.total_items} item{cart.total_items !== 1 ? 's' : ''} in cart</p>
                  </div>

                  <div className="space-y-4 py-4 border-y border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-900">D {parseFloat(cart.total_price || '0').toLocaleString('en-GM')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-semibold text-emerald-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax</span>
                      <span className="font-semibold text-slate-900">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="space-y-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <div className="flex justify-between">
                      <span className="font-black text-slate-900">Total</span>
                      <span className="text-2xl font-black text-emerald-600">D {parseFloat(cart.total_price || '0').toLocaleString('en-GM')}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push('/checkout')}
                    size="lg"
                    className="w-full text-lg font-bold py-4"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => router.push('/shop')}
                    className="w-full text-lg font-bold py-4"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-full">
              <div className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300 p-12 text-center">
                <FiShoppingCart className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition">Your cart is empty</h2>
                <p className="text-lg text-slate-600 mb-8">Add some amazing products to get started!</p>
                <Button
                  onClick={() => router.push('/shop')}
                  size="lg"
                  className="w-fit mx-auto text-lg font-bold py-4 px-12"
                >
                  Start Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
