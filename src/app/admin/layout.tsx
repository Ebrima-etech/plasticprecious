'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import { HiOutlineSquares2X2, HiOutlineShoppingBag, HiOutlineTag, HiOutlineShoppingCart, HiOutlineCurrencyDollar, HiOutlineTicket, HiOutlineUsers, HiOutlineBell } from 'react-icons/hi2';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState('/admin/dashboard');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setIsAuthed(true);
    setLoading(false);
    setActiveRoute(window.location.pathname);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = activeRoute === href;
    return (
      <Link href={href} onClick={() => setActiveRoute(href)}>
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm ${
            isActive
              ? 'bg-gray-100 text-gray-900 border-l-3 border-green-600 font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white">
              <HiOutlineSquares2X2 className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm text-gray-900">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Dashboard Section */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Dashboard</p>
            <div className="space-y-1">
              <NavLink href="/admin/dashboard" icon={HiOutlineSquares2X2} label="Overview" />
            </div>
          </div>

          {/* Catalog Section */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Catalog</p>
            <div className="space-y-1">
              <NavLink href="/admin/products" icon={HiOutlineShoppingBag} label="Products" />
              <NavLink href="/admin/categories" icon={HiOutlineTag} label="Categories" />
            </div>
          </div>

          {/* Orders & Revenue Section */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Orders & Revenue</p>
            <div className="space-y-1">
              <NavLink href="/admin/orders" icon={HiOutlineShoppingCart} label="Orders" />
              <NavLink href="/admin/settings" icon={HiOutlineCurrencyDollar} label="Revenue" />
              <NavLink href="/admin/settings" icon={HiOutlineTicket} label="Vouchers" />
              <NavLink href="/admin/settings" icon={HiOutlineTag} label="Discounts" />
            </div>
          </div>

          {/* Users & Sellers Section */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Users & Sellers</p>
            <div className="space-y-1">
              <NavLink href="/admin/users" icon={HiOutlineUsers} label="Customers" />
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <span>←</span>
              <span>Back to Store</span>
            </button>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              router.push('/admin/login');
            }}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Admin Panel</h2>
          <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
            <HiOutlineBell className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
