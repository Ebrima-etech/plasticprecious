'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
  color_from: string;
  color_to: string;
  order: number;
  is_active: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color_from: 'emerald-600',
    color_to: 'teal-600',
    order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/services/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();

    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/services/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/services/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchServices();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', description: '', icon: '', color_from: 'emerald-600', color_to: 'teal-600', order: 0, is_active: true });
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      icon: service.icon,
      color_from: service.color_from,
      color_to: service.color_to,
      order: service.order,
      is_active: service.is_active
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/services/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900">Services</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', description: '', icon: '', color_from: 'emerald-600', color_to: 'teal-600', order: 0, is_active: true });
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <FiPlus /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Service</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Service Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Icon (e.g., GiRecycle)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Color From</label>
                <input
                  type="text"
                  placeholder="e.g., emerald-600"
                  value={formData.color_from}
                  onChange={(e) => setFormData({ ...formData, color_from: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Color To</label>
                <input
                  type="text"
                  placeholder="e.g., teal-600"
                  value={formData.color_to}
                  onChange={(e) => setFormData({ ...formData, color_to: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
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
          {services.map((service) => (
            <div key={service.id} className="bg-white border-2 border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{service.name}</h3>
                <p className="text-sm text-slate-600">Order: {service.order} • {service.color_from} → {service.color_to}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
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
