'use client';

import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL, getApiUrl } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { cartService } from '@/lib/cartService';
import { Cart, CartItem } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COUNTRIES, HOME_COUNTRY } from '@/lib/countries';

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

function CheckoutContent() {
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
  // Outside The Gambia we ship to a standard postal address
  const [country, setCountry] = useState(HOME_COUNTRY);
  const [intl, setIntl] = useState({
    email: '',
    address_line1: '',
    house_number: '',
    address_line2: '',
    city: '',
    region: '',
    postal_code: '',
    po_box: '',
  });
  const [intlFee, setIntlFee] = useState<number | null>(null);
  const isInternational = country !== HOME_COUNTRY;

  useEffect(() => {
    // Plain instance: this is public info and must not trigger the login redirect
    axios.create()
      .get(`${API_BASE_URL}/orders/shipping_options/`)
      .then(res => setIntlFee(res.data.international_fee))
      .catch(() => setIntlFee(null));
  }, []);

  const handleIntlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntl({ ...intl, [e.target.name]: e.target.value });
  };

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
          }
        ],
        total_price: (parseFloat(product.price) * directProductQty).toString(),
        total_items: directProductQty,
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
      if (!isInternational && (!formData.full_name || !formData.phone_number || !formData.city)) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      if (isInternational) {
        const problems: string[] = [];
        if (!formData.full_name.trim()) problems.push('recipient name');
        if (!formData.phone_number.trim()) problems.push('phone number');
        if (!/^\S+@\S+\.\S+$/.test(intl.email.trim())) problems.push('a valid email');
        if (!intl.address_line1.trim() && !intl.po_box.trim()) problems.push('street address or PO Box');
        if (!intl.city.trim()) problems.push('city / town');
        if (!intl.postal_code.trim() && !intl.po_box.trim()) problems.push('postal / ZIP code');
        if (problems.length) {
          setError(`Please enter: ${problems.join(', ')}.`);
          setLoading(false);
          return;
        }
        if (intlFee === null) {
          setError('International shipping is unavailable right now. Please try again shortly.');
          setLoading(false);
          return;
        }
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
          country,
          total_amount: total,
          delivery_fee: delivery,
          deliver_to: formData.full_name,
          contact_number: formData.phone_number,
          // The Gambia: delivery area; elsewhere: postal address. The server recalculates the total and
          // refuses the order if it differs from total_amount (what the customer saw).
          ...(isInternational ? intl : { delivery_location: formData.city }),
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
  const delivery = isInternational ? (intlFee ?? 0) : formData.city ? getDeliveryPrice(locationId) : 0;
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
                {/* Country */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => { setCountry(e.target.value); setError(''); }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
                  >
                    <option value={HOME_COUNTRY}>The Gambia</option>
                    <option disabled>──────────</option>
                    {COUNTRIES.filter(c => c.code !== HOME_COUNTRY).map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  {isInternational && (
                    <p className="text-xs text-slate-500 mt-2">
                      We ship internationally from The Gambia. Shipping is a flat fee and usually takes 7–21 business days.
                    </p>
                  )}
                </div>

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
                    placeholder={isInternational ? 'Phone with country code, e.g. +44 7700 900000' : "Recipient's phone number"}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-500"
                  />
                </div>

                {/* International postal address */}
                {isInternational && (
                  <div className="space-y-5 rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                    <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">Shipping address</p>
                    {[
                      { name: 'email', label: 'Email *', type: 'email', placeholder: 'For shipping and tracking updates', autoComplete: 'email' },
                      { name: 'address_line1', label: 'Street address *', placeholder: 'Street name and number', autoComplete: 'address-line1' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.label}</label>
                        <input
                          type={f.type || 'text'}
                          name={f.name}
                          value={intl[f.name as keyof typeof intl]}
                          onChange={handleIntlChange}
                          placeholder={f.placeholder}
                          autoComplete={f.autoComplete}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-400 bg-white"
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'house_number', label: 'House / apartment / unit no.', placeholder: 'e.g. Flat 4B', autoComplete: 'address-line2' },
                        { name: 'address_line2', label: 'Address line 2', placeholder: 'Building, estate, landmark (optional)', autoComplete: 'address-line3' },
                        { name: 'city', label: 'City / town *', placeholder: '', autoComplete: 'address-level2' },
                        { name: 'region', label: 'State / province / region', placeholder: '', autoComplete: 'address-level1' },
                        { name: 'postal_code', label: 'Postal / ZIP code *', placeholder: '', autoComplete: 'postal-code' },
                        { name: 'po_box', label: 'PO Box', placeholder: 'Optional; can replace street and postcode', autoComplete: 'off' },
                      ].map(f => (
                        <div key={f.name}>
                          <label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.label}</label>
                          <input
                            type="text"
                            name={f.name}
                            value={intl[f.name as keyof typeof intl]}
                            onChange={handleIntlChange}
                            placeholder={f.placeholder}
                            autoComplete={f.autoComplete}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-400 bg-white"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      Use a PO Box if you don’t have a street address or postcode. Prices are in Gambian Dalasi (D); your bank converts the amount.
                    </p>
                  </div>
                )}

                {/* Delivery Location (The Gambia) */}
                {!isInternational && (
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
                )}
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
                    <span>{isInternational ? 'International shipping' : 'Delivery'}</span>
                    <span className={delivery === 0 && !isInternational ? 'text-emerald-600 font-semibold' : ''}>
                      {isInternational ? (
                        intlFee === null
                          ? <span className="text-slate-500">Unavailable</span>
                          : `D ${delivery.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      ) : formData.city ? (
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
                    <span className="font-semibold">Est. delivery:</span> {isInternational ? '7–21 business days' : '2-5 business days'}
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading checkout...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
