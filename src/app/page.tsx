'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { API_BASE_URL } from '@/config/api';

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  image?: string;
  is_active: boolean;
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/`);
        const allProducts = response.data.results || response.data || [];
        setProducts(allProducts.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return { variant: 'error' as const, text: 'Out of Stock' };
    if (stock < 10) return { variant: 'warning' as const, text: `Only ${stock} left` };
    return { variant: 'success' as const, text: 'In Stock' };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition">
              Plasticprecious
            </Link>
            <div className="hidden md:flex gap-8 items-center">
              <Link href="/products" className="text-neutral-600 hover:text-neutral-900 transition font-medium">
                Products
              </Link>
              <Link href="/contact" className="text-neutral-600 hover:text-neutral-900 transition font-medium">
                Contact
              </Link>
            </div>
            <div className="flex gap-3 items-center">
              <Link href="/cart">
                <Button variant="ghost" size="sm">
                  Cart
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100/20 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="primary" size="base" className="mb-6 inline-block">
              🌱 Sustainable Living Starts Here
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
              Premium Recycled Plastic Products
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Beautifully designed, sustainably made products for eco-conscious living.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg">Shop Collection</Button>
              </Link>
              <Link href="/products">
                <Button variant="secondary" size="lg">Browse Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers - REAL DATA FROM API ONLY */}
      {loadingProducts ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        </section>
      ) : products.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Best Selling Products</h2>
            <p className="text-xl text-neutral-600">Our most loved recycled solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => {
              const stockBadge = getStockBadge(product.stock);
              return (
                <Link key={product.id} href={`/products`}>
                  <Card hover shadow="base">
                    <div className="bg-gradient-to-br from-primary-100 to-primary-50 h-48 flex items-center justify-center text-5xl rounded-t-lg overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        '📦'
                      )}
                    </div>
                    <CardBody>
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant={stockBadge.variant} size="sm">
                          {stockBadge.text}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-neutral-900 mb-3 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-2xl font-bold text-primary-600">
                          D {parseFloat(product.price).toLocaleString('en-GM')}
                        </span>
                        <Button size="sm" variant="primary">
                          Add
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/products">
              <Button variant="ghost" size="lg">
                View All Products →
              </Button>
            </Link>
          </div>
        </section>
      ) : null}

      {/* Features */}
      <section className="bg-gradient-to-b from-neutral-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-6">♻️</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">100% Recycled</h3>
              <p className="text-neutral-600">Made from recycled plastic, zero waste</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">🌍</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Eco-Friendly</h3>
              <p className="text-neutral-600">Reduce your carbon footprint</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">🚚</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Sustainable Shipping</h3>
              <p className="text-neutral-600">Carbon-neutral delivery</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6">✅</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Quality Assured</h3>
              <p className="text-neutral-600">Certified durable products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card shadow="lg">
          <CardBody className="text-center py-12">
            <Badge variant="primary" size="base" className="mb-6 inline-block">
              💌 Get Exclusive Offers
            </Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Join Our Community</h2>
            <p className="text-xl text-neutral-600 mb-8 max-w-xl mx-auto">
              Get 15% off your first order + exclusive sustainability tips.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900"
                required
              />
              <Button type="submit" isLoading={subscribed}>
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-sm text-neutral-500 mt-4">We respect your privacy. Unsubscribe anytime.</p>
          </CardBody>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">About</h5>
              <p className="text-sm leading-relaxed">
                Leading recycled plastic products company dedicated to sustainability.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">Shop</h5>
              <ul className="text-sm space-y-2">
                <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">Support</h5>
              <ul className="text-sm space-y-2">
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">Legal</h5>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Plasticprecious. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
