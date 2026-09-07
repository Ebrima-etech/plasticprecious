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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  const stockBadge = getStockBadge(product.stock);
                  return (
                    <Link key={product.id} href={`/shop/${product.id}`}>
                      <div className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col h-full hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300">
                        {/* Product Image */}
                        <div className="w-full aspect-square bg-gradient-to-br from-emerald-100 to-emerald-50 overflow-hidden flex items-center justify-center relative">
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

                        {/* Product Info */}
                        <div className="px-6 pt-6 pb-6 flex flex-col flex-grow">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition line-clamp-2">
                              {product.name}
                            </h3>
                            <Badge variant={stockBadge.variant} size="sm">
                              {stockBadge.text}
                            </Badge>
                          </div>

                          {/* Locally Made Badge */}
                          <div className="mb-3 inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-bold w-fit">
                            🌍 Locally Made
                          </div>

                          {/* Sustainability Badge */}
                          <div className="mb-3 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-xs font-semibold w-fit">
                            ♻️ Recycled Plastic
                          </div>

                          <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between gap-3">
                            <p className="text-2xl font-bold text-emerald-600">
                              D {parseFloat(product.price).toLocaleString('en-GM')}
                            </p>
                            <button
                              onClick={(e) => handleAddToCart(product.id, e)}
                              disabled={addingToCart === product.id}
                              className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl disabled:hover:scale-100">
                              <FiShoppingCart size={20} />
                            </button>
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
      </section>

      <Footer />
    </div>
  );
}
