'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiPackage, FiShoppingCart } from 'react-icons/fi';
import { cartService } from '@/lib/cartService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductGridSkeleton } from '@/components/ShimmerSkeleton';
import { API_BASE_URL } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/`);
        const productsData = response.data.results || response.data;
        setProducts(productsData.filter((p: Product) => p.is_active));
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

  const handleAddToCart = async (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(productId);
    try {
      await cartService.addToCart(productId, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(null);
    }
  };

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
      <Navbar showNavLinks={true} />

      {/* Content */}
      <section className="py-6 lg:py-8 bg-white relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {loading ? (
            <ProductGridSkeleton columns={4} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-600 mb-6">No products available yet</p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 px-3 lg:px-0">
                {products.map((product) => {
                  const stockBadge = getStockBadge(product.stock);
                  return (
                    <Link key={product.id} href={`/shop/${product.id}`} className="no-underline hover:no-underline">
                      <div className="w-full">
                        <div className="cursor-pointer h-full bg-white flex flex-col transition-all duration-300 overflow-hidden group">
                          {/* Product Image */}
                          <div className="relative h-56 md:h-[24rem] lg:h-72 overflow-hidden bg-slate-200 rounded-none flex items-center justify-center relative">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <FiPackage className="w-16 h-16 text-emerald-400" />
                          )}
                        </div>

                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <FiPackage className="w-16 h-16 text-emerald-400" />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col flex-grow p-0.5">
                          <div className="flex items-baseline gap-1 mb-1.5">
                            <h3 className="text-sm md:text-base lg:text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition line-clamp-2">
                              {product.name}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 mb-2 font-medium">Only {product.stock} left!</p>

                          {/* Locally Made Badge */}
                          <div className="mb-2 inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 text-xs font-bold w-fit">
                            🌍 Locally Made
                          </div>

                          {/* Sustainability Badge */}
                          <div className="mb-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-semibold w-fit">
                            ♻️ Recycled Plastic
                          </div>

                          <div className="flex items-center justify-between gap-2 mt-auto">
                            <span className="text-base md:text-lg lg:text-xl font-bold text-emerald-600">
                              D {parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <button
                              onClick={(e) => handleAddToCart(product.id, e)}
                              disabled={addingToCart === product.id}
                              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:hover:scale-100">
                              <FiShoppingCart size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </Link>
                  );
                })}
              </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
