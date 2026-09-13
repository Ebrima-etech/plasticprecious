'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

interface ImpactMetric {
  id: number;
  label: string;
  value: string;
  description: string;
}

export default function ImpactMetricsAdmin() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ label: '', value: '', description: '' });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/impact/metrics/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetrics(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = getAccessToken();
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/impact/metrics/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/impact/metrics/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setFormData({ label: '', value: '', description: '' });
      setEditingId(null);
      fetchMetrics();
    } catch (err) {
      console.error('Failed to save metric:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/impact/metrics/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMetrics();
    } catch (err) {
      console.error('Failed to delete metric:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <FiTrendingUp className="text-emerald-600 w-8 h-8" />
        <h1 className="text-3xl font-black text-slate-900">Impact Metrics</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="font-bold text-slate-900 mb-4">{editingId ? 'Edit Metric' : 'Add New Metric'}</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Label (e.g., Tons Recovered)"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="Value (e.g., 6.4+)"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
            >
              {editingId ? 'Update' : 'Add'} Metric
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({ label: '', value: '', description: '' });
                }}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-slate-900">Label</th>
                <th className="px-6 py-3 text-left font-bold text-slate-900">Value</th>
                <th className="px-6 py-3 text-left font-bold text-slate-900">Description</th>
                <th className="px-6 py-3 text-left font-bold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-900 font-semibold">{metric.label}</td>
                  <td className="px-6 py-3 text-slate-600">{metric.value}</td>
                  <td className="px-6 py-3 text-slate-600 text-sm">{metric.description}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(metric.id);
                        setFormData(metric);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(metric.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
