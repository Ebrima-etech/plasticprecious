'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  order: number;
  is_active: boolean;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/partners/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPartners(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();

    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/partners/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/partners/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchPartners();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', logo_url: '', order: 0, is_active: true });
    } catch (error) {
      console.error('Failed to save partner:', error);
    }
  };

  const handleEdit = (partner: Partner) => {
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url,
      order: partner.order,
      is_active: partner.is_active
    });
    setEditingId(partner.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/partners/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPartners();
    } catch (error) {
      console.error('Failed to delete partner:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900">Partners</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', logo_url: '', order: 0, is_active: true });
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <FiPlus /> Add Partner
        </button>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Partner</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Partner Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="url"
              placeholder="Logo URL"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span>Active</span>
            </label>
            <div className="flex gap-2">
              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-300 text-slate-900 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white border-2 border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{partner.name}</h3>
                <p className="text-sm text-slate-600">Order: {partner.order}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(partner)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
