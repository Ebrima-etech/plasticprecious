'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setIsAuthed(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6 shadow-lg">
        <Link href="/admin" className="block mb-8">
          <h1 className="text-2xl font-bold text-green-400">♻️ Admin</h1>
          <p className="text-sm text-gray-400">Plasticprecious Management</p>
        </Link>

        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            📦 Products
          </Link>
          <Link
            href="/admin/categories"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            🏷️ Categories
          </Link>
          <Link
            href="/admin/orders"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            🛒 Orders
          </Link>
          <Link
            href="/admin/users"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            👥 Users
          </Link>
          <Link
            href="/admin/content"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            📝 Content
          </Link>
          <Link
            href="/admin/settings"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            ⚙️ Settings
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-gray-700">
          <button
            onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              router.push('/admin/login');
            }}
            className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition text-center"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
}
