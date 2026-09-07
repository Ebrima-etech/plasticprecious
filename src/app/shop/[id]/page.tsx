'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FiShoppingCart, FiLogIn, FiTruck, FiRotateCcw, FiLock, FiPackage, FiHeart, FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShimmerSkeleton } from '@/components/ShimmerSkeleton';
import { API_BASE_URL } from '@/config/api';
import { cartService } from '@/lib/cartService';
import { getAccessToken } from '@/lib/auth';
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
  category?: number;
  rating?: number;
  reviews_count?: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${productId}/`);
        setProduct(response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const productImages = product?.image
    ? [
        product.image,
        'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=500&h=500&fit=crop',
        'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?w=500&h=500&fit=crop',
      ]
    : [
        'https://via.placeholder.com/500x500?text=Product+Image',
        'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=500&h=500&fit=crop',
        'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?w=500&h=500&fit=crop',
      ];

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setError(null);
    try {
      await cartService.addToCart(Number(productId), quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err: any) {
      setError(err.message || err.response?.data?.detail || 'Failed to add to cart');
      setTimeout(() => setError(null), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return { variant: 'error' as const, text: 'Out of Stock' };
    if (stock < 10) return { variant: 'warning' as const, text: `Only ${stock} left` };
    return { variant: 'success' as const, text: 'In Stock' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar showNavLinks={true} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-6">
              <ShimmerSkeleton className="w-full aspect-square rounded-3xl" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <ShimmerSkeleton key={i} className="w-24 h-24 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <ShimmerSkeleton className="w-3/4 h-8" />
              <ShimmerSkeleton className="w-full h-6" />
              <ShimmerSkeleton className="w-1/2 h-10" />
              <div className="space-y-3">
                <ShimmerSkeleton className="w-full h-4" />
                <ShimmerSkeleton className="w-full h-4" />
                <ShimmerSkeleton className="w-3/4 h-4" />
              </div>
              <ShimmerSkeleton className="w-full h-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar showNavLinks={true} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stockBadge = getStockBadge(product.stock);

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

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">Home</Link>
          <span className="text-slate-400">/</span>
          <Link href="/shop" className="text-emerald-600 hover:text-emerald-700 font-medium">Shop</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 lg:py-20 bg-white relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Images Section */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-50 border border-slate-200 aspect-square flex items-center justify-center">
                <img
                  src={productImages[imageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={() => setImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all shadow-lg"
                >
                  <FiChevronLeft className="w-6 h-6 text-emerald-600" />
                </button>
                <button
                  onClick={() => setImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all shadow-lg"
                >
                  <FiChevronRight className="w-6 h-6 text-emerald-600" />
                </button>

                {/* Stock Badge - Absolute */}
                <div className="absolute top-4 right-4">
                  <Badge variant={stockBadge.variant} size="base">
                    {stockBadge.text}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      imageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-300'
                        : 'border-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 bg-gradient-to-br from-white to-slate-50 hover:from-emerald-50 hover:to-white transition-all duration-300 p-4 text-center hover:-translate-y-1">
                  <div className="text-2xl mb-2">🏆</div>
                  <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-600 transition">Premium Quality</p>
                </div>
                <div className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 bg-gradient-to-br from-white to-slate-50 hover:from-emerald-50 hover:to-white transition-all duration-300 p-4 text-center hover:-translate-y-1">
                  <div className="text-2xl mb-2">♻️</div>
                  <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-600 transition">Eco-Friendly</p>
                </div>
                <div className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 bg-gradient-to-br from-white to-slate-50 hover:from-emerald-50 hover:to-white transition-all duration-300 p-4 text-center hover:-translate-y-1">
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-600 transition">Certified</p>
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-8">
              {/* Header & Rating */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900">{product.name}</h1>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-4">
                    {product.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.round(Number(product.rating) || 0) ? 'text-amber-400' : 'text-slate-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {(Number(product.rating) || 0).toFixed(1)} ({product.reviews_count || 0} reviews)
                        </span>
                      </div>
                    )}
                    {product.rating && <div className="h-6 w-px bg-slate-200"></div>}
                    <span className="text-sm font-semibold text-emerald-600">In Stock</span>
                  </div>
                </div>

                {/* Price */}
                <div className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 transition-all duration-300">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-emerald-600">D {parseFloat(product.price).toLocaleString('en-GM')}</span>
                    <span className="text-lg text-slate-500 line-through">D {(parseFloat(product.price) * 1.2).toLocaleString('en-GM')}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">✓ Free shipping on orders over D 5,000</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-black text-slate-900">About This Product</h3>
                <p className="text-slate-700 leading-relaxed text-base">{product.description}</p>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-6">
                  <div className="flex items-center">
                    <label className="text-sm font-black text-slate-900 mr-4">Quantity:</label>
                    <div className="flex items-center gap-3 border-2 border-slate-200 rounded-xl p-2 bg-slate-50 hover:border-emerald-400 transition-colors">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-white rounded-lg transition"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-black text-slate-900 text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-white rounded-lg transition disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setWishlist(!wishlist)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      wishlist
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${wishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    disabled={product.stock === 0 || addingToCart}
                    className="w-full text-lg font-bold py-4"
                  >
                    <FiShoppingCart className="w-6 h-6 mr-2" />
                    {addingToCart ? 'Adding...' : addedToCart ? '✓ Added to Cart' : 'ADD TO CART'}
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full text-lg font-bold py-4"
                  >
                    <FiShare2 className="w-6 h-6 mr-2" />
                    SHARE PRODUCT
                  </Button>
                </div>
              </div>

              {/* Shipping & Returns Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200">
                <div className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 bg-gradient-to-br from-white to-slate-50 hover:from-emerald-50 hover:to-white transition-all duration-300 p-4 hover:-translate-y-1">
                  <FiTruck className="w-6 h-6 text-emerald-600 mb-3" />
                  <p className="font-black text-slate-900 text-sm group-hover:text-emerald-600 transition">Free Shipping</p>
                  <p className="text-xs text-slate-600 mt-1">Orders over D 5,000</p>
                </div>
                <div className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 bg-gradient-to-br from-white to-slate-50 hover:from-emerald-50 hover:to-white transition-all duration-300 p-4 hover:-translate-y-1">
                  <FiRotateCcw className="w-6 h-6 text-emerald-600 mb-3" />
                  <p className="font-black text-slate-900 text-sm group-hover:text-emerald-600 transition">Easy Returns</p>
                  <p className="text-xs text-slate-600 mt-1">30-day guarantee</p>
                </div>
                <div className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 bg-gradient-to-br from-white to-slate-50 hover:from-emerald-50 hover:to-white transition-all duration-300 p-4 hover:-translate-y-1">
                  <FiLock className="w-6 h-6 text-emerald-600 mb-3" />
                  <p className="font-black text-slate-900 text-sm group-hover:text-emerald-600 transition">Secure Checkout</p>
                  <p className="text-xs text-slate-600 mt-1">SSL encrypted</p>
                </div>
                <div className="group cursor-pointer relative rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 bg-gradient-to-br from-white to-slate-50 hover:from-emerald-50 hover:to-white transition-all duration-300 p-4 hover:-translate-y-1">
                  <FiPackage className="w-6 h-6 text-emerald-600 mb-3" />
                  <p className="font-black text-slate-900 text-sm group-hover:text-emerald-600 transition">Tracked Delivery</p>
                  <p className="text-xs text-slate-600 mt-1">Real-time updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white border-t border-slate-200 relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-black text-slate-900 mb-12">Key Features & Benefits</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '♻️', title: '100% Recycled', desc: 'Made from recycled plastic materials' },
              { icon: '🏆', title: 'Premium Quality', desc: 'ISO certified manufacturing' },
              { icon: '💪', title: 'Durable Design', desc: 'Built to last for years' },
              { icon: '🌍', title: 'Eco-Friendly', desc: 'Sustainable production practices' },
              { icon: '✅', title: 'Tested & Verified', desc: 'Quality assurance passed' },
              { icon: '🚀', title: 'Modern Design', desc: 'Contemporary styling' },
            ].map((feature, idx) => (
              <div key={idx} className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300 p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* You Might Also Like Section */}
      <section className="py-16 lg:py-24 bg-white border-t border-slate-200 relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-black text-slate-900 mb-12">You Might Also Like</h2>
          <div className="text-center py-12 text-slate-600">
            <p className="text-lg">More products coming soon</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
