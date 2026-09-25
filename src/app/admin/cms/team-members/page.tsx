'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { ListCard } from '@/components/ios/ListCard';
import { DragHandle } from '@/components/ios/DragHandle';
import { ToggleSwitch } from '@/components/ios/ToggleSwitch';
import { CMSHeader } from '@/components/ios/CMSHeader';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';
import { MultiStepForm } from '@/components/ios/MultiStepForm';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

const FORM_STEPS = [
  { id: 'personal', title: 'Personal Info', description: 'Name and photo' },
  { id: 'role', title: 'Role & Bio', description: 'Position and description' }
];

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
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
    setSubmitting(true);
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
      closeForm();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openForm = (member?: TeamMember) => {
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
    setCurrentStep(0);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData({ name: '', role: '', description: '', image_url: '', is_active: true });
      setCurrentStep(0);
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
        onAddClick={() => openForm()}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Inline Form */}
      {isFormOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <MultiStepForm
            steps={FORM_STEPS}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitLabel={editingId ? 'Update' : 'Create'}
            loading={submitting}
          >
            {currentStep === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Photo URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  />
                </div>
                {formData.image_url && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-slate-600">Photo preview</span>
                  </div>
                )}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Role *</label>
                  <input
                    type="text"
                    placeholder="e.g., Creative Director"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Bio</label>
                  <textarea
                    placeholder="Brief description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none h-24"
                  />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <label className="text-sm font-medium text-slate-900">Active</label>
                  <ToggleSwitch
                    checked={formData.is_active}
                    onChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
            )}
          </MultiStepForm>
        </div>
      )}

      {/* Members List */}
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
                    onEdit={() => openForm(member)}
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
