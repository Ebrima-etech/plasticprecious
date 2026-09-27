'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL, getApiUrl } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { cartService } from '@/lib/cartService';
import { Cart, CartItem } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LocationOption {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directProductId = searchParams.get('product_id');
  const directProductQty = parseInt(searchParams.get('qty') || '1');

  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Cart | null>(null);
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [productDeliveryPrices, setProductDeliveryPrices] = useState<Record<number, Record<number, string>>>({});
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
    if (directProductId) {
      fetchDirectProduct();
    } else {
      fetchCart();
    }
    fetchLocations();
  }, [directProductId]);

  const fetchLocations = async () => {
    // Default locations - MUST match ProductForm fallback locations for synchronization
    const defaultLocations = [
      { id: 1, name: 'Banjul' },
      { id: 2, name: 'Serekunda' },
      { id: 3, name: 'Bakau' },
      { id: 4, name: 'Fajara' },
      { id: 5, name: 'Kotu' },
      { id: 6, name: 'Brufut' },
      { id: 7, name: 'Lamin' },
      { id: 8, name: 'Gunjur' },
      { id: 9, name: 'Sanyang' },
      { id: 10, name: 'Kartong' },
      { id: 11, name: 'Brikama' },
      { id: 12, name: 'Mandinari' },
      { id: 13, name: 'Kaur' },
      { id: 14, name: 'Basse' },
      { id: 15, name: 'Farafenni' },
    ];

    try {
      // Fetch locations from API with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await axios.get(`${API_BASE_URL}/locations/`, {
        signal: controller.signal
      });
      clearTimeout(timeout);

      const fetchedLocations = response.data.results || response.data || [];
      setLocations(fetchedLocations.length > 0 ? fetchedLocations : defaultLocations);
    } catch (err) {
      console.error('Failed to load locations, using defaults:', err);
      // Fallback to default locations - synchronized with ProductForm
      setLocations(defaultLocations);
    }
  };

  const fetchDirectProduct = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${directProductId}/`);
      const product: Product = response.data;

      // Create a temporary cart with just this product
      const tempCart: Cart = {
        id: 0,
        user: null,
        items: [
          {
            id: 0,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            },
            quantity: directProductQty,
            total: (parseFloat(product.price) * directProductQty).toString(),
          }
        ],
        total_price: (parseFloat(product.price) * directProductQty).toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setCart(tempCart);

      // Fetch delivery price for this product
      const productRes = await axios.get(`${API_BASE_URL}/products/${product.id}/`);
      if (productRes.data.delivery_prices) {
        setProductDeliveryPrices({
          [product.id]: productRes.data.delivery_prices
        });
      }

      setCartLoading(false);
    } catch (err) {
      console.error('Failed to load product:', err);
      setCartLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);

      // Fetch delivery prices for each product in cart
      if (data && data.items && data.items.length > 0) {
        const deliveryPricesData: Record<number, Record<number, string>> = {};

        for (const item of data.items) {
          try {
            const productRes = await axios.get(`${API_BASE_URL}/products/${item.product.id}/`);
            if (productRes.data.delivery_prices) {
              deliveryPricesData[item.product.id] = productRes.data.delivery_prices;
            }
          } catch (err) {
            console.error(`Failed to fetch delivery prices for product ${item.product.id}`);
          }
        }

        setProductDeliveryPrices(deliveryPricesData);
      }

      setCartLoading(false);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setCartLoading(false);
    }
  };

  const getDeliveryPrice = (locationId: number | string): number => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return 0;
    }

    let totalDelivery = 0;
    for (const item of cart.items) {
      const productDelivery = productDeliveryPrices[item.product.id];
      if (productDelivery && productDelivery[locationId as any]) {
        totalDelivery += parseFloat(productDelivery[locationId as any]);
      }
    }

    return totalDelivery;
  };

  const getLocationIdByName = (cityName: string): number | string => {
    const location = locations.find(loc => loc.name === cityName);
    return location ? location.id : cityName;
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
      // Validate required fields
      if (!formData.full_name || !formData.phone_number || !formData.city) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (!cart || cart.items.length === 0) {
        setError('Your cart is empty');
        setLoading(false);
        return;
      }

      const token = getAccessToken();

      // Create payment intent with dynamic delivery price
      const response = await axios.post(
        getApiUrl('/orders/create_payment/'),
        {
          total_amount: total,
          delivery_fee: delivery,
          deliver_to: formData.full_name,
          contact_number: formData.phone_number,
          delivery_location: formData.city,
          items: cart.items.map((item: CartItem) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: parseFloat(item.product.price),
          })),
          return_url: `${window.location.origin}/order-confirmation?status=success`,
          cancel_url: `${window.location.origin}/checkout?status=cancelled`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Store order info in session storage
      sessionStorage.setItem(
        'pendingOrder',
        JSON.stringify({
          orderId: response.data.order_id,
          items: cart.items,
          total,
        })
      );

      // Redirect to Wave checkout
      window.location.href = response.data.checkout_url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart?.items.reduce((sum: number, item: CartItem) => sum + (parseFloat(item.product.price) * item.quantity), 0) || 0;
  const locationId = getLocationIdByName(formData.city);
  const delivery = formData.city ? getDeliveryPrice(locationId) : 0;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

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
                    {locations.length > 0 ? (
                      locations.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Banjul">Banjul</option>
                        <option value="Serekunda">Serekunda</option>
                        <option value="Bakau">Bakau</option>
                        <option value="Fajara">Fajara</option>
                        <option value="Kotu">Kotu</option>
                        <option value="Brufut">Brufut</option>
                        <option value="Lamin">Lamin</option>
                        <option value="Gunjur">Gunjur</option>
                        <option value="Sanyang">Sanyang</option>
                        <option value="Kartong">Kartong</option>
                        <option value="Brikama">Brikama</option>
                        <option value="Mandinari">Mandinari</option>
                        <option value="Kaur">Kaur</option>
                        <option value="Basse">Basse</option>
                        <option value="Farafenni">Farafenni</option>
                      </>
                    )}
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
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-emerald-600 font-semibold' : ''}>
                      {formData.city ? (
                        delivery === 0 ? 'Free' : `D ${delivery.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      ) : (
                        <span className="text-slate-500">Select location</span>
                      )}
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
