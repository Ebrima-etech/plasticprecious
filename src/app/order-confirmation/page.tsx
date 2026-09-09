'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiTruck, FiMail } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const [orderDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-200 rounded-full blur-lg animate-pulse"></div>
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                <FiCheckCircle className="w-20 h-20 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 mb-4">Order Confirmed!</h1>
            <p className="text-xl text-slate-600">Thank you for your purchase. Your order has been successfully placed.</p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white border-2 border-emerald-200 rounded-3xl p-8 shadow-sm mb-8">
            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-slate-200">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Order ID</p>
                <p className="text-lg font-black text-slate-900">{orderId}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Date</p>
                <p className="text-lg font-black text-slate-900">{orderDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <FiPackage className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-semibold text-slate-900">Confirmed</p>
                <p className="text-xs text-slate-600">Order received</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <FiTruck className="w-6 h-6 text-slate-600" />
                </div>
                <p className="font-semibold text-slate-900">Processing</p>
                <p className="text-xs text-slate-600">Preparing shipment</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                  <FiTruck className="w-6 h-6 text-slate-600" />
                </div>
                <p className="font-semibold text-slate-900">Shipping</p>
                <p className="text-xs text-slate-600">On its way to you</p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
            <div className="flex gap-4">
              <FiMail className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Confirmation Email Sent</h3>
                <p className="text-sm text-slate-600">A confirmation email with your order details and tracking information has been sent to your email address.</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-slate-900">What's Next?</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold">1.</span>
                <span className="text-slate-700">You'll receive a shipping confirmation as soon as your order is dispatched</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold">2.</span>
                <span className="text-slate-700">Track your package using the tracking number provided in the shipping email</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-600 font-bold">3.</span>
                <span className="text-slate-700">Estimated delivery: 3-5 business days for most areas</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/shop" className="block">
              <Button size="lg" variant="secondary" className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
