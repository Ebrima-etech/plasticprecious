'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { AdminTableSkeleton } from '@/components/ShimmerSkeleton';

interface Voucher {
  id: number;
  code: string;
  discount_percentage: number;
  max_uses: number | null;
  times_used: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    description: '',
    max_uses: '',
    valid_until: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/vouchers/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVouchers(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch vouchers:', err);
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
        discount_percentage: parseFloat(formData.discount_percentage),
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      };

      if (editingId) {
        await axios.patch(`${API_BASE_URL}/vouchers/${editingId}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE_URL}/vouchers/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchVouchers();
      setShowForm(false);
      setFormData({ code: '', discount_percentage: '', description: '', max_uses: '', valid_until: '' });
      setEditingId(null);
    } catch (err) {
      console.error('Failed to save voucher:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this voucher?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/vouchers/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVouchers();
    } catch (err) {
      console.error('Failed to delete voucher:', err);
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setFormData({
      code: voucher.code,
      discount_percentage: voucher.discount_percentage.toString(),
      description: '',
      max_uses: voucher.max_uses?.toString() || '',
      valid_until: voucher.valid_until || '',
    });
    setEditingId(voucher.id);
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
          <h1 className="text-3xl font-bold text-slate-900">Vouchers</h1>
          <p className="text-slate-600 mt-2">Create and manage discount vouchers and promotional codes</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ code: '', discount_percentage: '', description: '', max_uses: '', valid_until: '' });
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
        >
          + New Voucher
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editingId ? 'Edit Voucher' : 'Create New Voucher'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., SUMMER2024"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Discount % *</label>
                <input
                  type="number"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Uses</label>
                <input
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Leave empty for unlimited"
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
                placeholder="Voucher description"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
              >
                {editingId ? 'Update' : 'Create'} Voucher
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

      {/* Vouchers List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {vouchers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 font-medium">No vouchers created yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first voucher to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Discount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Uses</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{voucher.code}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{voucher.discount_percentage}%</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {voucher.times_used}{voucher.max_uses ? `/${voucher.max_uses}` : ''}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          voucher.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {voucher.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(voucher)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(voucher.id)}
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
