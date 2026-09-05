'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { API_BASE_URL } from '@/config/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image?: string;
  is_active: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/`);
        setProducts(response.data.filter((p: Product) => p.is_active));
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getStockBadge = (stock: number) => {
    if (stock === 0) return { variant: 'error' as const, text: 'Out of Stock' };
    if (stock < 10) return { variant: 'warning' as const, text: `Only ${stock} left` };
    return { variant: 'success' as const, text: 'In Stock' };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-lg sm:text-2xl font-bold text-primary-600">
              PLASTICPRECIOUS
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
              <Link href="/" className="text-neutral-700 hover:text-primary-600 transition">SHOP</Link>
              <a href="#impact" className="text-neutral-700 hover:text-primary-600 transition">OUR IMPACT</a>
              <a href="#about" className="text-neutral-700 hover:text-primary-600 transition">ABOUT</a>
            </div>

            {/* Hamburger Menu (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-3">
              <Link href="/cart">
                <Button variant="ghost" size="sm">🛒</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="sm">LOGIN</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">SIGN UP</Button>
              </Link>
            </div>

            {/* Mobile Cart & Login */}
            <div className="flex md:hidden gap-3">
              <Link href="/cart">
                <Button variant="ghost" size="sm">🛒</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" size="xs">LOGIN</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-neutral-200 py-4 space-y-3">
              <Link href="/" className="block text-neutral-700 hover:text-primary-600 py-2">SHOP</Link>
              <a href="#impact" className="block text-neutral-700 hover:text-primary-600 py-2">OUR IMPACT</a>
              <a href="#about" className="block text-neutral-700 hover:text-primary-600 py-2">ABOUT</a>
              <Link href="/auth/signup" className="block w-full">
                <Button size="sm" className="w-full">SIGN UP</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-primary-100">Explore our range of premium recycled plastic solutions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-neutral-600 mb-6">No products available yet</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-neutral-600 mb-8">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const stockBadge = getStockBadge(product.stock);
                return (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="group cursor-pointer rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                      {/* Product Image */}
                      <div className="w-full aspect-square bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden flex items-center justify-center group-hover:bg-primary-50 transition">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="text-6xl">📦</div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition line-clamp-2">
                            {product.name}
                          </h3>
                          <Badge variant={stockBadge.variant} size="sm">
                            {stockBadge.text}
                          </Badge>
                        </div>

                        <p className="text-neutral-600 text-sm mb-4 line-clamp-2 flex-grow">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-primary-600">
                            D {parseFloat(product.price).toLocaleString('en-GM')}
                          </p>
                          <Button variant="primary" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-16 border-t border-neutral-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">About</h3>
              <p className="text-sm">We create premium recycled plastic products for a sustainable future.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">All Products</a></li>
                <li><a href="#" className="hover:text-white transition">Categories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center">
            <p>&copy; 2026 Plasticprecious. Committed to a circular future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
