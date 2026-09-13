'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

interface Staff {
  id: number;
  user: number;
  user_data?: { username: string; first_name: string; last_name: string; email: string };
  department: number;
  department_name: string;
  role: string;
  role_display: string;
  permissions: string[];
  salary: string;
  hire_date: string;
  is_active: boolean;
  phone_number: string;
  address: string;
}

interface Department {
  id: number;
  name: string;
}

const ROLES = [
  { value: 'manager', label: 'Manager' },
  { value: 'marketer', label: 'Marketer' },
  { value: 'deliverer', label: 'Deliverer' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'technician', label: 'Technician' },
  { value: 'driver', label: 'Driver' },
  { value: 'coordinator', label: 'Coordinator' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'intern', label: 'Intern' },
];

const PERMISSIONS = [
  { value: 'view_reports', label: 'View Reports' },
  { value: 'edit_products', label: 'Edit Products' },
  { value: 'manage_orders', label: 'Manage Orders' },
  { value: 'manage_payments', label: 'Manage Payments' },
  { value: 'manage_users', label: 'Manage Users' },
  { value: 'manage_staff', label: 'Manage Staff' },
  { value: 'view_analytics', label: 'View Analytics' },
  { value: 'manage_inventory', label: 'Manage Inventory' },
  { value: 'export_data', label: 'Export Data' },
  { value: 'create_reports', label: 'Create Reports' },
];

export default function StaffAdmin() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    department: '',
    role: '',
    permissions: [] as string[],
    salary: '',
    hire_date: '',
    phone_number: '',
    address: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = getAccessToken();
      const [staffRes, deptRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/staff/staff/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/staff/departments/`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStaff(staffRes.data.results || staffRes.data);
      setDepartments(deptRes.data.results || deptRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = getAccessToken();
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/staff/staff/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/staff/staff/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setFormData({
        department: '',
        role: '',
        permissions: [],
        salary: '',
        hire_date: '',
        phone_number: '',
        address: ''
      });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error('Failed to save staff:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        const token = getAccessToken();
        await axios.delete(`${API_BASE_URL}/staff/staff/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        console.error('Failed to delete staff:', err);
      }
    }
  };

  const handleEdit = (s: Staff) => {
    setEditingId(s.id);
    setFormData({
      department: s.department.toString(),
      role: s.role,
      permissions: s.permissions,
      salary: s.salary || '',
      hire_date: s.hire_date,
      phone_number: s.phone_number,
      address: s.address
    });
  };

  const togglePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <FiUsers className="text-emerald-600 w-8 h-8" />
        <h1 className="text-3xl font-black text-slate-900">Staff Members</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="font-bold text-slate-900 mb-4">{editingId ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select Role</option>
              {ROLES.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="date"
              value={formData.hire_date}
              onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="border-t pt-4">
            <p className="font-semibold text-sm text-slate-700 mb-3">Permissions:</p>
            <div className="grid grid-cols-2 gap-3">
              {PERMISSIONS.map(perm => (
                <label key={perm.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(perm.value)}
                    onChange={() => togglePermission(perm.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-700">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
            >
              {editingId ? 'Update' : 'Add'} Staff Member
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    department: '',
                    role: '',
                    permissions: [],
                    salary: '',
                    hire_date: '',
                    phone_number: '',
                    address: ''
                  });
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
                <th className="px-6 py-3 text-left font-bold text-slate-900">Name</th>
                <th className="px-6 py-3 text-left font-bold text-slate-900">Role</th>
                <th className="px-6 py-3 text-left font-bold text-slate-900">Department</th>
                <th className="px-6 py-3 text-left font-bold text-slate-900">Email</th>
                <th className="px-6 py-3 text-left font-bold text-slate-900">Hire Date</th>
                <th className="px-6 py-3 text-left font-bold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-900 font-semibold">{s.user_data?.first_name} {s.user_data?.last_name}</td>
                  <td className="px-6 py-3 text-slate-600">{s.role_display}</td>
                  <td className="px-6 py-3 text-slate-600">{s.department_name}</td>
                  <td className="px-6 py-3 text-slate-600">{s.user_data?.email}</td>
                  <td className="px-6 py-3 text-slate-600">{new Date(s.hire_date).toLocaleDateString()}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
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
