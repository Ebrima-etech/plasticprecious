'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FiShoppingCart, FiTruck, FiLock, FiRotateCcw, FiHeart } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { ShimmerSkeleton } from '@/components/ShimmerSkeleton';
import { API_BASE_URL } from '@/config/api';
import { cartService } from '@/lib/cartService';
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
}

export default function ProductDetailPage() {
  const params = useParams();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar showNavLinks={true} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <ShimmerSkeleton className="w-full aspect-square rounded-lg" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <ShimmerSkeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <ShimmerSkeleton className="w-3/4 h-8" />
              <ShimmerSkeleton className="w-full h-6" />
              <ShimmerSkeleton className="w-1/2 h-10" />
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-slate-900">Shop</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-4 lg:py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Images Section */}
            <div className="lg:col-span-2 flex gap-3">
              {/* Thumbnail Images - Left Side */}
              <div className="flex flex-col gap-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-16 h-16 rounded-none overflow-hidden flex-shrink-0 border-2 transition-all ${
                      imageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-300'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-slate-100 rounded-none overflow-hidden aspect-square flex items-center justify-center">
                <img
                  src={productImages[imageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-3">
              {/* Title & Stock */}
              <div className="space-y-1">
                <p className="text-xs text-slate-600">Precious Plastic</p>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                  <span>✓</span>
                  <span>In Stock</span>
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  D {parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Description */}
              <p className="text-slate-700 text-xs leading-relaxed">{product.description}</p>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-900">Quantity</label>
                <div className="flex items-center gap-2 border border-slate-300 rounded-lg w-fit p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded transition text-sm"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-semibold text-slate-900 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded transition disabled:opacity-50 text-sm"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-slate-500">{product.stock} available</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  {error}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  disabled={product.stock === 0 || addingToCart}
                  className="w-full text-sm font-bold py-2"
                >
                  <FiShoppingCart className="w-4 h-4 mr-2" />
                  {addingToCart ? 'Adding...' : addedToCart ? '✓ Added' : 'ADD TO CART'}
                </Button>

                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`w-full py-2 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                    wishlist
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <FiHeart className={`w-4 h-4 ${wishlist ? 'fill-current' : ''}`} />
                  Add to Wishlist
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200">
                <div className="text-center space-y-1 py-2">
                  <FiTruck className="w-5 h-5 text-emerald-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-900">Free Shipping</p>
                  <p className="text-xs text-slate-500">Orders over D 5,000</p>
                </div>
                <div className="text-center space-y-1 py-2">
                  <FiLock className="w-5 h-5 text-emerald-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-900">Secure Payment</p>
                  <p className="text-xs text-slate-500">100% protected</p>
                </div>
                <div className="text-center space-y-1 py-2">
                  <FiRotateCcw className="w-5 h-5 text-emerald-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-900">Easy Returns</p>
                  <p className="text-xs text-slate-500">30-day guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-emerald-50 border-t border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h3 className="text-sm font-black text-emerald-600 uppercase tracking-wide mb-2">Product Information</h3>
            <h2 className="text-4xl font-black text-slate-900 mb-4">Detailed Specifications</h2>
            <p className="text-slate-600 text-lg">Complete details about this recycled plastic product</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Main Specifications */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Product Details</h3>
              <div className="space-y-6">
                <div className="pb-6 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Product Name</p>
                  <p className="text-base font-semibold text-slate-900">{product.name}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-6">
              {/* Warranty & Certifications Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-6">Warranty & Certifications</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">🏆</div>
                    <div>
                      <p className="font-bold text-slate-900">ISO Certified</p>
                      <p className="text-sm text-slate-600">International quality standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">🛡️</div>
                    <div>
                      <p className="font-bold text-slate-900">2-Year Limited Warranty</p>
                      <p className="text-sm text-slate-600">Full coverage and support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">♻️</div>
                    <div>
                      <p className="font-bold text-slate-900">Eco-Certified</p>
                      <p className="text-sm text-slate-600">Sustainable production verified</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Care & Recycling */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-6">Care & Recycling</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Clean with mild soap and warm water</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Avoid direct sunlight and high heat</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Store in dry environment</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Fully recyclable when end-of-life reached</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white border-t border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h3 className="text-sm font-black text-emerald-600 uppercase tracking-wide mb-2">Why Choose This Product</h3>
            <h2 className="text-4xl font-black text-slate-900">Recycled, Reliable & Responsible</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '♻️', title: '100% Recycled Plastic', desc: 'Upcycled from waste plastic materials' },
              { icon: '🌍', title: 'Reduces Waste', desc: 'Keeps plastic out of landfills' },
              { icon: '💪', title: 'High Durability', desc: 'Built tough and long-lasting' },
              { icon: '🏆', title: 'Certified Quality', desc: 'ISO standards & quality tested' },
              { icon: '🌱', title: 'Climate Positive', desc: 'Supports sustainable future' },
              { icon: '👌', title: 'Premium Finish', desc: 'Beautiful, modern design' },
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
      <section className="py-16 lg:py-24 bg-white border-t border-slate-200 relative overflow-hidden">
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
