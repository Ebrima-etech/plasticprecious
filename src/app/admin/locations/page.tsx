'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { HiOutlineTrash, HiOutlinePencil, HiOutlinePlus } from 'react-icons/hi2';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { AdminTableSkeleton } from '@/components/ShimmerSkeleton';

interface Location {
  id: number;
  name: string;
  description: string;
  default_delivery_price: number;
  is_active: boolean;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    default_delivery_price: '',
    is_active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAccessToken();

      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/locations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Locations response:', response.data);
      const locationsData = response.data.results || response.data || [];
      setLocations(Array.isArray(locationsData) ? locationsData : []);

      if (Array.isArray(locationsData) && locationsData.length === 0) {
        setError('No locations found. Create one to get started.');
      }
    } catch (err: any) {
      console.error('Failed to fetch locations:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to load locations';
      setError(errorMsg);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target as any;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();

    try {
      const payload = {
        ...formData,
        default_delivery_price: parseFloat(formData.default_delivery_price),
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/locations/${editingId}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_BASE_URL}/locations/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        default_delivery_price: '',
        is_active: true,
      });
      fetchLocations();
    } catch (err) {
      console.error('Failed to save location:', err);
    }
  };

  const handleEdit = (location: Location) => {
    setFormData({
      name: location.name,
      description: location.description,
      default_delivery_price: location.default_delivery_price.toString(),
      is_active: location.is_active,
    });
    setEditingId(location.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    const token = getAccessToken();
    try {
      await axios.delete(`${API_BASE_URL}/locations/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLocations();
    } catch (err) {
      console.error('Failed to delete location:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      default_delivery_price: '',
      is_active: true,
    });
  };

  if (loading) {
    return <AdminTableSkeleton rows={5} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Delivery Locations</h1>
          <p className="text-slate-600 mt-1">Manage delivery locations and default prices</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', description: '', default_delivery_price: '', is_active: true });
          }}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition"
        >
          <HiOutlinePlus size={20} />
          Add Location
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-semibold mb-6">
          ⚠️ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="p-8 text-center text-slate-500">
          <p>Loading locations...</p>
        </div>
      )}

      {/* Locations Table */}
      {!loading && (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Location Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Description</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Default Delivery Price</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Status</th>
              <th className="px-6 py-4 text-right text-sm font-bold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {locations.map((location) => (
              <tr key={location.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-semibold text-slate-900">{location.name}</td>
                <td className="px-6 py-4 text-slate-600 text-sm">{location.description || '-'}</td>
                <td className="px-6 py-4 font-bold text-emerald-600">D {location.default_delivery_price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    location.is_active
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {location.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                  <button
                    onClick={() => handleEdit(location)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                  >
                    <HiOutlinePencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(location.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 rounded-t-2xl">
              <h2 className="text-2xl font-black text-white">
                {editingId ? 'Edit Location' : 'Add New Location'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Location Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Banjul"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Location details"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 uppercase mb-2">Default Delivery Price *</label>
                <input
                  type="number"
                  name="default_delivery_price"
                  required
                  step="0.01"
                  min="0"
                  value={formData.default_delivery_price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
                <p className="text-xs text-slate-500 mt-1">Used if no specific price is set for product</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label className="text-sm font-semibold text-slate-700">Active</label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
