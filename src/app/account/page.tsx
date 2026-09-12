'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLogOut, FiUser, FiMail, FiPackage, FiShoppingCart, FiShoppingBag } from 'react-icons/fi';
import { getAccessToken, clearTokens } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.push('/auth/login');
      return;
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar showNavLinks={true} />

      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                <FiUser className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-slate-900">My Account</h1>
                <p className="text-slate-600 mt-1">Manage your profile and orders</p>
              </div>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200 px-8 py-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <FiUser className="text-emerald-600" />
                Account Information
              </h2>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Username</p>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 group-hover:border-emerald-300 transition">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <FiUser className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-semibold">Account Owner</p>
                      <p className="text-slate-900 font-black">Account User</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Email Address</p>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 group-hover:border-blue-300 transition">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <FiMail className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-semibold">Email</p>
                      <p className="text-slate-900 font-black">user@example.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-black text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* My Orders */}
              <Link href="/orders" className="group">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition p-6 h-full flex flex-col">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:from-emerald-600 group-hover:to-teal-600 transition">
                    <FiPackage className="text-emerald-600 text-xl group-hover:text-white transition" />
                  </div>
                  <h4 className="font-black text-slate-900 text-lg mb-1">My Orders</h4>
                  <p className="text-sm text-slate-600 flex-grow">View and track your orders</p>
                  <p className="text-xs text-emerald-600 font-bold mt-4 flex items-center gap-1">View orders →</p>
                </div>
              </Link>

              {/* Shopping Cart */}
              <Link href="/cart" className="group">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition p-6 h-full flex flex-col">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-600 group-hover:to-cyan-600 transition">
                    <FiShoppingCart className="text-blue-600 text-xl group-hover:text-white transition" />
                  </div>
                  <h4 className="font-black text-slate-900 text-lg mb-1">Shopping Cart</h4>
                  <p className="text-sm text-slate-600 flex-grow">Review items in your cart</p>
                  <p className="text-xs text-blue-600 font-bold mt-4 flex items-center gap-1">View cart →</p>
                </div>
              </Link>

              {/* Continue Shopping */}
              <Link href="/shop" className="group">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition p-6 h-full flex flex-col">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:from-purple-600 group-hover:to-pink-600 transition">
                    <FiShoppingBag className="text-purple-600 text-xl group-hover:text-white transition" />
                  </div>
                  <h4 className="font-black text-slate-900 text-lg mb-1">Continue Shopping</h4>
                  <p className="text-sm text-slate-600 flex-grow">Explore our products</p>
                  <p className="text-xs text-purple-600 font-bold mt-4 flex items-center gap-1">Shop now →</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Logout Section */}
          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-200 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1">Sign Out</h3>
                <p className="text-slate-600">End your session and sign out of your account</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg hover:shadow-xl"
              >
                <FiLogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
