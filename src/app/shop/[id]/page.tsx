'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FiShoppingCart, FiLogIn, FiTruck, FiRotateCcw, FiLock, FiPackage } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
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
  category?: number;
  rating?: number;
  reviews_count?: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

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

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return { variant: 'error' as const, text: 'Out of Stock' };
    if (stock < 10) return { variant: 'warning' as const, text: `Only ${stock} left` };
    return { variant: 'success' as const, text: 'In Stock' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Product Not Found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stockBadge = getStockBadge(product.stock);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-neutral-100">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-primary-600 hover:text-primary-700">Home</Link>
          <span className="text-neutral-400">/</span>
          <Link href="/shop" className="text-primary-600 hover:text-primary-700">Shop</Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-600">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiPackage className="w-24 h-24 text-primary-400" />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-neutral-900 mb-2">{product.name}</h1>
                  {product.rating && (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">
                        {'⭐'.repeat(Math.round(product.rating))}
                      </span>
                      <span className="text-sm text-neutral-600">
                        ({product.reviews_count || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
                <Badge variant={stockBadge.variant} size="base">
                  {stockBadge.text}
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="border-b border-neutral-200 pb-6">
              <p className="text-5xl font-bold text-primary-600">
                D {parseFloat(product.price).toLocaleString('en-GM')}
              </p>
              <p className="text-neutral-600 mt-2">Free shipping on orders over D 5,000</p>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">About This Product</h3>
              <p className="text-neutral-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div className="bg-neutral-50 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-neutral-900">Why Choose This Product?</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span>Made from 100% recycled plastic materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span>Durable and long-lasting design</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span>Environmentally friendly and sustainable</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">✓</span>
                  <span>ISO certified quality assurance</span>
                </li>
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="border-t border-neutral-200 pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-neutral-700">Quantity:</label>
                <div className="flex items-center gap-3 border border-neutral-200 rounded-lg p-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-neutral-600 hover:text-neutral-900"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="text-neutral-600 hover:text-neutral-900 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                disabled={product.stock === 0}
                className="w-full"
              >
                {addedToCart ? '✓ Added to Cart' : 'ADD TO CART'}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="w-full"
              >
                CONTINUE SHOPPING
              </Button>
            </div>

            {/* Shipping Info */}
            <Card shadow="sm">
              <CardBody>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <FiTruck className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-neutral-900">Free Shipping</p>
                      <p className="text-neutral-600">On orders over D 5,000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiRotateCcw className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-neutral-900">Easy Returns</p>
                      <p className="text-neutral-600">30-day money-back guarantee</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiLock className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-neutral-900">Secure Checkout</p>
                      <p className="text-neutral-600">SSL encrypted transactions</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="bg-neutral-50 py-16 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">You Might Also Like</h2>
          <div className="text-center py-8 text-neutral-600">
            <p>More products coming soon</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
