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
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Images Section */}
            <div className="lg:col-span-2 flex gap-4">
              {/* Thumbnail Images - Left Side */}
              <div className="flex flex-col gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
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
              <div className="flex-1 bg-slate-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <img
                  src={productImages[imageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              {/* Title & Stock */}
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Precious Plastic</p>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{product.name}</h1>
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <span>✓</span>
                  <span>In Stock</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <p className="text-3xl font-bold text-slate-900">
                  D {parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Description */}
              <p className="text-slate-700 text-sm leading-relaxed">{product.description}</p>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900">Quantity</label>
                <div className="flex items-center gap-3 border border-slate-300 rounded-lg w-fit p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded transition"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded transition disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-slate-500">{product.stock} available</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  disabled={product.stock === 0 || addingToCart}
                  className="w-full text-base font-bold py-3"
                >
                  <FiShoppingCart className="w-5 h-5 mr-2" />
                  {addingToCart ? 'Adding...' : addedToCart ? '✓ Added' : 'ADD TO CART'}
                </Button>

                <button
                  onClick={() => setWishlist(!wishlist)}
                  className={`w-full py-3 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                    wishlist
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${wishlist ? 'fill-current' : ''}`} />
                  Add to Wishlist
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-8 border-t border-slate-200">
                <div className="text-center space-y-2 py-4">
                  <FiTruck className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-900">Free Shipping</p>
                  <p className="text-xs text-slate-500">Orders over D 5,000</p>
                </div>
                <div className="text-center space-y-2 py-4">
                  <FiLock className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-900">Secure Payment</p>
                  <p className="text-xs text-slate-500">100% protected</p>
                </div>
                <div className="text-center space-y-2 py-4">
                  <FiRotateCcw className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-900">Easy Returns</p>
                  <p className="text-xs text-slate-500">30-day guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
