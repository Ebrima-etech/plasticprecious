'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

interface Department {
  id: number;
  name: string;
  description: string;
  manager: number | null;
  manager_name?: string;
  budget_allocation: string;
  is_active: boolean;
  staff_count?: number;
}

export default function DepartmentsAdmin() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', budget_allocation: '', is_active: true });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAccessToken();
      console.log('Fetching departments with token:', token ? 'present' : 'missing');
      const response = await axios.get(`${API_BASE_URL}/staff/departments/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Departments response:', response.data);
      const deptData = response.data.results || response.data;
      console.log('Departments data:', deptData);
      setDepartments(Array.isArray(deptData) ? deptData : []);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch departments:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch departments');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = getAccessToken();
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/staff/departments/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/staff/departments/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setFormData({ name: '', description: '', budget_allocation: '', is_active: true });
      setEditingId(null);
      fetchDepartments();
    } catch (err) {
      console.error('Failed to save department:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        const token = getAccessToken();
        await axios.delete(`${API_BASE_URL}/staff/departments/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDepartments();
      } catch (err) {
        console.error('Failed to delete department:', err);
      }
    }
  };

  const handleEdit = (dept: Department) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name,
      description: dept.description,
      budget_allocation: dept.budget_allocation,
      is_active: dept.is_active
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <FiBriefcase className="text-emerald-600 w-8 h-8" />
        <h1 className="text-3xl font-black text-slate-900">Departments</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="font-bold text-slate-900 mb-4">{editingId ? 'Edit Department' : 'Add New Department'}</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24"
          />
          <input
            type="number"
            placeholder="Budget Allocation (D)"
            value={formData.budget_allocation}
            onChange={(e) => setFormData({ ...formData, budget_allocation: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Active</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
            >
              {editingId ? 'Update' : 'Add'} Department
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', description: '', budget_allocation: '', is_active: true });
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
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-4">
            <p className="text-sm text-red-800 font-semibold">Error: {error}</p>
          </div>
        )}
        {loading && (
          <div className="p-8 text-center">
            <p className="text-slate-600">Loading departments...</p>
          </div>
        )}
        {!loading && departments.length === 0 && !error && (
          <div className="p-8 text-center">
            <p className="text-slate-600">No departments found. Create one to get started.</p>
          </div>
        )}
        {!loading && departments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Department</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Budget (D)</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Staff</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left font-bold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-900 font-semibold">{dept.name}</td>
                    <td className="px-6 py-3 text-slate-600">D {dept.budget_allocation}</td>
                    <td className="px-6 py-3 text-slate-600">{dept.staff_count || 0}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${dept.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {dept.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
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
        )}
      </div>
    </div>
  );
}
