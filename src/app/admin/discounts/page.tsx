'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi2';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { AdminTableSkeleton } from '@/components/ShimmerSkeleton';

interface Discount {
  id: number;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  product_names: string[];
  category_names: string[];
  is_active: boolean;
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: string;
    valid_until: string;
  }>({
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    valid_until: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/discounts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscounts(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getAccessToken();
      const payload = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
      };

      if (editingId) {
        await axios.patch(`${API_BASE_URL}/discounts/${editingId}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE_URL}/discounts/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchDiscounts();
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        valid_until: '',
      });
      setEditingId(null);
    } catch (err) {
      console.error('Failed to save discount:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/discounts/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDiscounts();
    } catch (err) {
      console.error('Failed to delete discount:', err);
    }
  };

  const handleEdit = (discount: Discount) => {
    setFormData({
      name: discount.name,
      description: '',
      discount_type: discount.discount_type,
      discount_value: discount.discount_value.toString(),
      valid_until: '',
    });
    setEditingId(discount.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminTableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Discounts</h1>
          <p className="text-slate-600 mt-2">Create and manage product and category discounts</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              discount_type: 'percentage',
              discount_value: '',
              valid_until: '',
            });
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
        >
          + New Discount
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editingId ? 'Edit Discount' : 'Create New Discount'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Summer Sale"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Value {formData.discount_type === 'percentage' ? '(%)' : '(D)'} *
                </label>
                <input
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valid Until</label>
                <input
                  type="datetime-local"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-20"
                placeholder="Discount description"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
              >
                {editingId ? 'Update' : 'Create'} Discount
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discounts List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {discounts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 font-medium">No discounts created yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first discount to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Value</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount) => (
                  <tr key={discount.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{discount.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {discount.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {discount.discount_type === 'percentage' ? `${discount.discount_value}%` : `D ${discount.discount_value}`}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          discount.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {discount.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(discount)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(discount.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
