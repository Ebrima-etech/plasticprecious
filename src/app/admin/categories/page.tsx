'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';

interface Category {
  id: number;
  name: string;
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

  const deleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

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
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          ➕ Add Category
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No categories yet. <Link href="/admin/categories/new" className="text-green-600 hover:underline">Create one</Link>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(category.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 font-semibold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
