'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { ShimmerSkeleton } from '@/components/ShimmerSkeleton';
import { formatDate } from '@/lib/format-utils';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { HiOutlineTag } from 'react-icons/hi2';

interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  created_at: string;
  product_count?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        let allCategories: Category[] = [];
        let nextUrl = `${API_BASE_URL}/categories/?limit=1000&offset=0`;

        while (nextUrl) {
          const response = await axios.get(nextUrl);
          const pageCategories = response.data.results || response.data || [];
          if (!Array.isArray(pageCategories)) {
            break;
          }
          allCategories = [...allCategories, ...pageCategories];
          nextUrl = response.data.next || null;

          if (!nextUrl && response.data.results && response.data.count > allCategories.length) {
            const nextOffset = allCategories.length;
            nextUrl = `${API_BASE_URL}/categories/?limit=1000&offset=${nextOffset}`;
          }
        }

        setCategories(allCategories);
      } catch (err: any) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      handleDeleteConfirm(id);
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/categories/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="w-40 h-8 bg-gray-200 rounded shimmer-loading mb-2"></div>
            <div className="w-60 h-4 bg-gray-200 rounded shimmer-loading"></div>
          </div>
          <div className="w-40 h-10 bg-gray-200 rounded shimmer-loading"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div>
                <ShimmerSkeleton className="w-32 h-6 mb-2" />
                <ShimmerSkeleton className="w-40 h-3" />
              </div>
              <ShimmerSkeleton className="w-full h-12" />
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <ShimmerSkeleton className="flex-1 h-8" />
                <ShimmerSkeleton className="flex-1 h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <HiOutlineTag className="text-emerald-600 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
              <p className="text-sm text-slate-600 mt-0.5">Organize your products by category</p>
            </div>
          </div>
        </div>
        <Link href="/admin/categories/new">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm shadow-sm">
            + Add Category
          </button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-600 font-medium">No categories yet</p>
          <p className="text-sm text-slate-500 mt-1">Create your first category to organize products</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-slate-200/80 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 truncate">{category.name}</h3>
                  {category.slug && (
                    <p className="text-xs text-slate-500 mt-1 font-mono truncate">/{category.slug}</p>
                  )}
                </div>
                {(category.product_count !== undefined) && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex-shrink-0">
                    {category.product_count} {category.product_count === 1 ? 'Product' : 'Products'}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Created {formatDate(category.created_at, 'MMM dd, yyyy')}
              </p>

              {category.description && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{category.description}</p>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Link href={`/admin/categories/${category.id}/edit`} className="flex-1">
                  <button className="w-full px-3 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition flex items-center justify-center gap-2">
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
