'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image_url: string;
  order: number;
  is_active: boolean;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    image_url: '',
    order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/team-members/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();

    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/team-members/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/team-members/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchMembers();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', role: '', description: '', image_url: '', order: 0, is_active: true });
    } catch (error) {
      console.error('Failed to save team member:', error);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description,
      image_url: member.image_url,
      order: member.order,
      is_active: member.is_active
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/team-members/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMembers();
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900">Team Members</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: '', role: '', description: '', image_url: '', order: 0, is_active: true });
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <FiPlus /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Team Member</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-24"
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
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
          {members.map((member) => (
            <div key={member.id} className="bg-white border-2 border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="text-sm text-slate-600">{member.role} • Order: {member.order}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
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
