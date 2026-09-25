'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { SlideOver } from '@/components/admin/SlideOver';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const openDrawer = (dept?: Department) => {
    if (dept) {
      setEditingId(dept.id);
      setFormData({
        name: dept.name,
        description: dept.description,
        budget_allocation: dept.budget_allocation,
        is_active: dept.is_active
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', budget_allocation: '', is_active: true });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData({ name: '', description: '', budget_allocation: '', is_active: true });
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <FiBriefcase className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
            <p className="text-sm text-slate-600">Manage organization departments and budgets</p>
          </div>
        </div>
        <button
          onClick={() => openDrawer()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition shadow-sm"
        >
          <FiPlus className="w-5 h-5" />
          Add Department
        </button>
      </div>

      {/* Slide-over Drawer */}
      <SlideOver
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={editingId ? 'Edit Department' : 'Create Department'}
        description={editingId ? 'Update department details' : 'Add a new department to your organization'}
        footer={
          <>
            <button
              onClick={closeDrawer}
              className="px-6 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
            >
              {editingId ? 'Update' : 'Create'} Department
            </button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Basic Info Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">Basic Information</label>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">Department Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Operations, Marketing"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">Description</label>
                <textarea
                  placeholder="Department purpose and responsibilities"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Budget & Status Section */}
          <div className="border-t border-slate-200 pt-6">
            <label className="block text-sm font-semibold text-slate-900 mb-3">Budget & Status</label>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1.5">Budget Allocation</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-slate-600 font-medium">D</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.budget_allocation}
                    onChange={(e) => setFormData({ ...formData, budget_allocation: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded accent-emerald-600"
                />
                <label className="text-sm font-medium text-slate-900 cursor-pointer">Mark as active</label>
              </div>
            </div>
          </div>
        </div>
      </SlideOver>

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
