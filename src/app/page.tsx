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
  description?: string;
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/`);
        const allProducts = response.data.results || response.data || [];
        setProducts(allProducts.slice(0, 6));
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
    if (stock < 10) return { variant: 'warning' as const, text: `${stock} left` };
    return { variant: 'success' as const, text: 'In Stock' };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              PLASTICPRECIOUS
            </Link>
            <div className="hidden lg:flex gap-8">
              <Link href="/products" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm">
                SHOP
              </Link>
              <a href="#impact" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm">
                OUR IMPACT
              </a>
              <Link href="/contact" className="text-neutral-600 hover:text-neutral-900 font-medium text-sm">
                ABOUT
              </Link>
            </div>
            <div className="flex gap-3 items-center">
              <Link href="/cart">
                <Button variant="ghost" size="sm">🛒</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="sm">LOGIN</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">SIGN UP</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero - Premium, Bold, Sustainability Focused */}
      <section className="bg-gradient-to-r from-neutral-900 via-primary-900 to-neutral-900 text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-300 font-semibold tracking-widest text-sm mb-4">SUSTAINABLE SOLUTIONS</p>
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Premium Recycled Plastic Products
          </h1>
          <p className="text-xl text-neutral-200 mb-8 max-w-2xl mx-auto">
            High-quality, sustainably engineered plastic solutions for conscious businesses and consumers.
            Every product diverts waste from landfills and supports a circular economy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="px-8">
                EXPLORE PRODUCTS
              </Button>
            </Link>
            <Link href="#impact">
              <Button variant="secondary" size="lg" className="px-8">
                OUR IMPACT
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges - B2B Credibility */}
      <section className="bg-neutral-50 py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary-600">100%</p>
              <p className="text-sm text-neutral-600 mt-2">Recycled Material</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">50K+</p>
              <p className="text-sm text-neutral-600 mt-2">Tons Diverted</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">80+</p>
              <p className="text-sm text-neutral-600 mt-2">Countries</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-600">ISO Certified</p>
              <p className="text-sm text-neutral-600 mt-2">Quality Standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase - Real Data Only */}
      {loadingProducts ? (
        <section className="py-20">
          <div className="flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        </section>
      ) : products.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="mb-16">
            <p className="text-primary-600 font-semibold tracking-widest text-sm mb-2">FEATURED COLLECTION</p>
            <h2 className="text-5xl font-bold text-neutral-900 mb-4">Premium Products</h2>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Engineered for durability. Designed for sustainability. Built for the future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const stockBadge = getStockBadge(product.stock);
              return (
                <Link key={product.id} href={`/products`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg bg-neutral-100 h-64 mb-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl">📦</div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge variant={stockBadge.variant} size="sm">
                          {stockBadge.text}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-600">
                        D {parseFloat(product.price).toLocaleString('en-GM')}
                      </span>
                      <Button size="sm" variant="primary">
                        ADD
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Link href="/products">
              <Button variant="secondary" size="lg" className="px-12">
                VIEW ALL PRODUCTS
              </Button>
            </Link>
          </div>
        </section>
      ) : null}

      {/* Impact Section - Patagonia Style Storytelling */}
      <section id="impact" className="bg-neutral-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary-600 font-semibold tracking-widest text-sm mb-2">WHY PLASTIC PRECIOUS</p>
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">Built on Sustainability</h2>
              <div className="space-y-4 text-neutral-700">
                <p>
                  We believe the circular economy isn't a trend—it's the future. Every product we create diverts waste from landfills and reduces carbon emissions.
                </p>
                <p>
                  Our manufacturing process uses advanced recycling technology to transform discarded plastic into premium-grade materials. No compromise on quality. No compromise on the planet.
                </p>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center gap-3">
                    <span className="text-primary-600 text-xl">✓</span>
                    <span>100% post-consumer recycled plastic</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary-600 text-xl">✓</span>
                    <span>Carbon-neutral production process</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary-600 text-xl">✓</span>
                    <span>ISO 9001 & ISO 14001 certified</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary-600 text-xl">✓</span>
                    <span>Fully recyclable at end of life</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg h-96 flex items-center justify-center text-8xl">
              ♻️
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Professional Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary-600 font-semibold tracking-widest text-sm mb-2">TRUSTED BY INDUSTRY</p>
            <h2 className="text-4xl font-bold text-neutral-900">Why Industry Leaders Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card shadow="sm">
              <CardBody>
                <div className="text-4xl mb-4">🏭</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Industrial Grade</h3>
                <p className="text-neutral-600">
                  Engineered to meet the highest standards. Our products exceed industry specifications and durability requirements.
                </p>
              </CardBody>
            </Card>

            <Card shadow="sm">
              <CardBody>
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Global Supply</h3>
                <p className="text-neutral-600">
                  Fast shipping to 80+ countries. Reliable partnerships with distributors worldwide ensure consistent availability.
                </p>
              </CardBody>
            </Card>

            <Card shadow="sm">
              <CardBody>
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">B2B Solutions</h3>
                <p className="text-neutral-600">
                  Bulk ordering, custom manufacturing, and dedicated account managers for enterprise clients.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter - Minimal, Professional */}
      <section className="bg-neutral-900 text-white py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-300 font-semibold tracking-widest text-sm mb-2">STAY INFORMED</p>
          <h2 className="text-4xl font-bold mb-4">Join the Circular Economy</h2>
          <p className="text-neutral-300 mb-8">
            Get updates on new products, sustainability insights, and exclusive offers.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <Button type="submit" isLoading={subscribed} variant="secondary">
              {subscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer - Professional */}
      <footer className="bg-neutral-950 text-neutral-400 py-20 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">PLASTICPRECIOUS</h3>
              <p className="text-sm leading-relaxed">
                Engineering a sustainable future through premium recycled plastic solutions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">SHOP</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="hover:text-white transition">All Products</Link></li>
                <li><Link href="/products" className="hover:text-white transition">Bulk Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">COMPANY</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">LEGAL</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Plasticprecious. Committed to a circular future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
