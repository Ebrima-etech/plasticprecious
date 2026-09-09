'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FiTruck, FiRotateCcw, FiLock, FiMapPin } from 'react-icons/fi';
import { API_BASE_URL, getApiUrl } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { cartService } from '@/lib/cartService';
import { Cart, CartItem } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Cart | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    city: '',
    state: '',
    street: '',
    postal_code: '',
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/auth/login');
    }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
      setCartLoading(false);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setCartLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const token = getAccessToken();

      const response = await axios.post(
        getApiUrl('/orders/'),
        {
          shipping_address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: 'Gambia',
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = response.data.id;

      router.push(`/order-confirmation?order_id=${orderId}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart?.items.reduce((sum: number, item: CartItem) => sum + (parseFloat(item.product.price) * item.quantity), 0) || 0;
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      {/* Trust Badges */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm">
            <div className="flex items-center justify-center gap-2">
              <FiTruck className="w-5 h-5 text-emerald-600" />
              <span className="hidden sm:inline">Free Shipping Over D5,000</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FiRotateCcw className="w-5 h-5 text-emerald-600" />
              <span className="hidden sm:inline">Easy Returns</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FiLock className="w-5 h-5 text-emerald-600" />
              <span className="hidden sm:inline">Secure Payment</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FiMapPin className="w-5 h-5 text-emerald-600" />
              <span className="hidden sm:inline">Gambia-wide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-black text-slate-900 mb-8">Checkout</h1>

              <div className="space-y-6">
                {/* Deliver To */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Deliver To (Name) *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Recipient's full name"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Recipient's phone number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
                  />
                </div>

                {/* Delivery Location */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Delivery Location *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
                  >
                    <option value="">Select your location</option>
                    <option value="Banjul">Banjul</option>
                    <option value="Serekunda">Serekunda</option>
                    <option value="Bakau">Bakau</option>
                    <option value="Kololi">Kololi</option>
                    <option value="Kotu">Kotu</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 sticky top-20">
                <h2 className="text-lg font-black text-slate-900 mb-6">ORDER SUMMARY</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                  {cartLoading ? (
                    <p className="text-slate-600">Loading cart...</p>
                  ) : cart && cart.items.length > 0 ? (
                    cart.items.map((item: CartItem, index: number) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                          {item.product.image ? (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 text-sm line-clamp-2">{item.product.name}</p>
                          <p className="text-slate-600 text-sm">Qty: {item.quantity}</p>
                          <p className="text-emerald-600 font-bold text-sm">D {(parseFloat(item.product.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600">Your cart is empty</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal</span>
                    <span>D {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>
                      {shipping === 0 ? 'Free' : `D ${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                    <span>Total</span>
                    <span>D {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-emerald-800">
                    <span className="font-semibold">Est. delivery:</span> 2-5 business days
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !cart || cart.items.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : '💳 Pay Now'}
                </button>

                <p className="text-xs text-slate-600 text-center mt-4">
                  By placing your order you agree to our Terms & Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
