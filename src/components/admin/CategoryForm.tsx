'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';

interface CategoryFormProps {
  categoryId?: number;
}

export default function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryId) {
      const fetchCategory = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/`);
          setFormData({ name: response.data.name });
        } catch (err) {
          setError('Failed to load category');
        }
      };
      fetchCategory();
    }
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      if (categoryId) {
        await axios.put(`${API_BASE_URL}/categories/${categoryId}/`, formData, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/categories/`, formData, { headers });
      }

      router.push('/admin/categories');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {categoryId ? 'Edit Category' : 'Add New Category'}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Recycled Plastic"
          />
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Category'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
