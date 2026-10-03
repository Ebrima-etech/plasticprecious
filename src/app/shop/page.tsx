'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { FiPackage, FiShoppingCart } from 'react-icons/fi';
import { cartService } from '@/lib/cartService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductGridSkeleton } from '@/components/ShimmerSkeleton';
import { API_BASE_URL } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toNumber, formatKg } from '@/lib/impact';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image?: string;
  is_active: boolean;
  plastic_recycled_kg?: string;
}

const badges = [
  { icon: '🌍', label: 'Locally Made', bg: 'bg-emerald-600', text: 'text-white' },
  { icon: '♻️', label: 'Recycled Plastic', bg: 'bg-emerald-50', text: 'text-emerald-700' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [badgeIndex, setBadgeIndex] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${API_BASE_URL}/products/`;
        if (searchQuery) {
          url += `?search=${encodeURIComponent(searchQuery)}`;
        }
        const response = await axios.get(url);
        const productsData = response.data.results || response.data;
        const activeProducts = Array.isArray(productsData)
          ? productsData.filter((p: Product) => p.is_active)
          : productsData;
        setFilteredProducts(activeProducts);
        setProducts(activeProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchProducts();
  }, [searchQuery]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeIndex((prev) => (prev + 1) % badges.length);
    }, 4000);
    return () => clearInterval(interval);
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
        @keyframes slideUpIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          5% {
            opacity: 1;
            transform: translateY(0);
          }
          95% {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          1% {
            opacity: 0;
          }
          to {
            opacity: 0;
          }
        }
        .badge-rotating {
          position: relative;
          display: inline-block;
          height: 24px;
          overflow: hidden;
          min-width: max-content;
        }
        .badge-current {
          animation: fadeOut 4s linear infinite;
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          white-space: nowrap;
          left: 0;
          top: 0;
          pointer-events: none;
        }
        .badge-next {
          animation: slideUpIn 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 1s;
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          white-space: nowrap;
          left: 0;
          top: 0;
        }
      `}</style>
      <Navbar showNavLinks={true} />

      {/* Content */}
      <section className="py-6 lg:py-8 bg-white relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {searchQuery && (
            <div className="mb-8 pb-6 border-b border-slate-200">
              <h1 className="text-3xl font-black text-slate-900 mb-2">Search Results</h1>
              <p className="text-slate-600">Results for "<strong>{searchQuery}</strong>" ({filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''})</p>
            </div>
          )}
          {loading ? (
            <ProductGridSkeleton columns={4} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-600 mb-6">{searchQuery ? 'No products found matching your search' : 'No products available yet'}</p>
              <Link href={searchQuery ? '/shop' : '/'}>
                <Button>{searchQuery ? 'Clear Search' : 'Back to Home'}</Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 px-3 lg:px-0">
                {filteredProducts.map((product) => {
                  const stockBadge = getStockBadge(product.stock);
                  return (
                    <Link key={product.id} href={`/shop/${product.id}`} className="no-underline hover:no-underline">
                      <div className="w-full">
                        <div className="cursor-pointer h-full bg-white flex flex-col transition-all duration-300 overflow-hidden group">
                          {/* Product Image */}
                          <div className="relative h-56 md:h-[24rem] lg:h-72 overflow-hidden bg-slate-200 rounded-none flex items-center justify-center">
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
                              <div className="bg-red-500 text-white px-1 py-0.5 text-[9px] font-bold whitespace-nowrap leading-none flex-shrink-0">NEW</div>
                              <h3 className="text-sm md:text-base lg:text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition line-clamp-2">
                                {product.name}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500 mb-2 font-medium">Only {product.stock} left!</p>

                            {toNumber(product.plastic_recycled_kg) > 0 && (
                              <p className="mb-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 w-fit">
                                ♻️ {formatKg(product.plastic_recycled_kg)} plastic recycled
                              </p>
                            )}

                            {/* Rotating Badges */}
                            <div className="mb-2 text-xs font-bold badge-rotating">
                              <span className={`badge-current ${badges[(badgeIndex - 1 + badges.length) % badges.length].bg} ${badges[(badgeIndex - 1 + badges.length) % badges.length].text} px-2 py-0.5`}>
                                {badges[(badgeIndex - 1 + badges.length) % badges.length].icon} {badges[(badgeIndex - 1 + badges.length) % badges.length].label}
                              </span>
                              <span className={`badge-next ${badges[badgeIndex].bg} ${badges[badgeIndex].text} px-2 py-0.5`}>
                                {badges[badgeIndex].icon} {badges[badgeIndex].label}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-auto">
                              <span className="text-base md:text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
                                D {parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <button
                                onClick={(e) => handleAddToCart(product.id, e)}
                                disabled={addingToCart === product.id}
                                className="text-slate-900 hover:text-slate-700 transition">
                                <FiShoppingCart size={24} />
                              </button>
                            </div>
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center pt-20">
          <p className="text-lg text-slate-600">Loading products...</p>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
