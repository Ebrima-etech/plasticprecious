'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { SlideOver } from '@/components/admin/SlideOver';
import { ListCard } from '@/components/ios/ListCard';
import { DragHandle } from '@/components/ios/DragHandle';
import { ToggleSwitch } from '@/components/ios/ToggleSwitch';
import { CMSHeader } from '@/components/ios/CMSHeader';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    image_url: '',
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

  const handleSubmit = async () => {
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
      closeDrawer();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const openDrawer = (member?: TeamMember) => {
    if (member) {
      setEditingId(member.id);
      setFormData({
        name: member.name,
        role: member.role,
        description: member.description,
        image_url: member.image_url,
        is_active: member.is_active
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', role: '', description: '', image_url: '', is_active: true });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData({ name: '', role: '', description: '', image_url: '', is_active: true });
    }, 300);
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
      console.error('Failed to delete:', error);
    }
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <CMSHeader
        title="Team Members"
        itemCount={filteredMembers.length}
        onAddClick={() => openDrawer()}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <SlideOver
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={editingId ? 'Edit Member' : 'Add Member'}
        description={editingId ? 'Update team member details' : 'Add a new team member'}
        footer={
          <>
            <button onClick={closeDrawer} className="px-6 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-lg transition">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">
              {editingId ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Full Name *</label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Role *</label>
            <input
              type="text"
              placeholder="e.g., Creative Director"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Bio</label>
            <textarea
              placeholder="Brief description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none h-24"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Photo URL</label>
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-900">Active</label>
            <ToggleSwitch
              checked={formData.is_active}
              onChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>
        </div>
      </SlideOver>

      {loading ? (
        <div className="text-center py-12"><p className="text-slate-600">Loading...</p></div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No team members found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <ListCard key={member.id}>
              <div className="flex items-center gap-4 p-4">
                <DragHandle />

                <div className="w-12 h-12 rounded-full border border-slate-200 flex-shrink-0 overflow-hidden bg-slate-100">
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{member.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">{member.role}</p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <ToggleSwitch
                    checked={member.is_active}
                    onChange={async (checked) => {
                      try {
                        const token = getAccessToken();
                        await axios.patch(`${API_BASE_URL}/team-members/${member.id}/`, { is_active: checked }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        fetchMembers();
                      } catch (error) {
                        console.error('Failed to update:', error);
                      }
                    }}
                  />
                  <CMSActionMenu
                    onEdit={() => openDrawer(member)}
                    onDelete={() => handleDelete(member.id)}
                  />
                </div>
              </div>
            </ListCard>
          ))}
        </div>
      )}
    </div>
  );
}
