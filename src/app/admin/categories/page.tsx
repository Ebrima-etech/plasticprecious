'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { ShimmerSkeleton } from '@/components/ShimmerSkeleton';

interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories/`);
        setCategories(response.data.results || response.data || []);
      } catch (err: any) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your products by category</p>
        </div>
        <Link href="/admin/categories/new">
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm">
            + Add Category
          </button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 font-medium">No categories yet</p>
          <p className="text-sm text-gray-500 mt-1">Create your first category to organize products</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Created {new Date(category.created_at).toLocaleDateString()}
                </p>
              </div>
              {category.description && (
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              )}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Link href={`/admin/categories/${category.id}/edit`} className="flex-1">
                  <button className="w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition"
                >
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
