'use client';
import { ListCardGridSkeleton } from '@/components/ShimmerSkeleton';

import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { ListCard } from '@/components/ios/ListCard';
import { ToggleSwitch } from '@/components/ios/ToggleSwitch';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';
import { MultiStepForm } from '@/components/ios/MultiStepForm';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import VolunteerApplications, { ApplicationStats } from '@/components/admin/VolunteerApplications';
import { getErrorMessage } from '@/lib/api-errors';
import { HiOutlinePlus } from 'react-icons/hi2';

type Category = 'founder' | 'staff' | 'volunteer';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  category?: Category;
  description: string;
  image?: string | null;
  image_url: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

const TABS: { value: Category; label: string; singular: string; rolePlaceholder: string }[] = [
  { value: 'founder', label: 'Founders', singular: 'founder', rolePlaceholder: 'e.g. Co-Founder' },
  { value: 'staff', label: 'Staff', singular: 'staff member', rolePlaceholder: 'e.g. Machine Operator' },
  { value: 'volunteer', label: 'Volunteers', singular: 'volunteer', rolePlaceholder: 'e.g. Beach Cleanup Volunteer' },
];

const FORM_STEPS = [
  { id: 'personal', title: 'Personal Info', description: 'Name and photo' },
  { id: 'role', title: 'Role & Bio', description: 'Group, position and description' }
];

const SORTS = [
  { value: 'order', label: 'Display order' },
  { value: 'name', label: 'Name A–Z' },
  { value: '-name', label: 'Name Z–A' },
  { value: '-created_at', label: 'Newest first' },
  { value: 'created_at', label: 'Oldest first' },
];

// Older members may not have a category yet; fall back to the role text
const categoryOf = (m: TeamMember): Category => {
  if (m.category) return m.category;
  const role = m.role.toLowerCase();
  return role.includes('founder') ? 'founder' : role.includes('volunteer') ? 'volunteer' : 'staff';
};

const EMPTY_FORM = { name: '', role: '', description: '', category: 'staff' as Category, is_active: true };
const DAY_MS = 24 * 60 * 60 * 1000;

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Category>('founder');
  const [volunteerView, setVolunteerView] = useState<'members' | 'applications'>('members');
  const [appStats, setAppStats] = useState<ApplicationStats | null>(null);

  // Toolbar
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('order');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'hidden'>('all');
  const [photoFilter, setPhotoFilter] = useState<'all' | 'with' | 'without'>('all');

  // Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchMembers = useCallback(async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/team-members/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 500 },
      });
      // Uploaded photos are stored in `image`; `image_url` holds manually set links
      const data: TeamMember[] = response.data.results || response.data;
      setMembers(data.map(m => ({ ...m, image_url: m.image || m.image_url })));
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Load application stats once so the Volunteers tab can show the "new" badge
  useEffect(() => {
    axios.get(`${API_BASE_URL}/impact/volunteer-applications/stats/`, { headers: { Authorization: `Bearer ${getAccessToken()}` } })
      .then(res => setAppStats(res.data))
      .catch(() => {});
  }, []);

  const handleAppStats = useCallback((stats: ApplicationStats) => setAppStats(stats), []);

  const counts = useMemo(() => {
    const c: Record<Category, number> = { founder: 0, staff: 0, volunteer: 0 };
    members.forEach(m => { c[categoryOf(m)] += 1; });
    return c;
  }, [members]);

  const inTab = useMemo(() => members.filter(m => categoryOf(m) === tab), [members, tab]);

  const summary = useMemo(() => {
    const now = Date.now();
    const active = inTab.filter(m => m.is_active).length;
    const withPhoto = inTab.filter(m => !!m.image_url).length;
    const recent = inTab.filter(m => m.created_at && now - new Date(m.created_at).getTime() < 30 * DAY_MS).length;
    const roles = new Set(inTab.map(m => m.role.trim().toLowerCase()).filter(Boolean)).size;
    return { total: inTab.length, active, hidden: inTab.length - active, withPhoto, recent, roles };
  }, [inTab]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = inTab.filter(m => {
      if (statusFilter === 'active' && !m.is_active) return false;
      if (statusFilter === 'hidden' && m.is_active) return false;
      if (photoFilter === 'with' && !m.image_url) return false;
      if (photoFilter === 'without' && m.image_url) return false;
      if (!term) return true;
      return [m.name, m.role, m.description].some(v => (v || '').toLowerCase().includes(term));
    });
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case 'name': return a.name.localeCompare(b.name);
        case '-name': return b.name.localeCompare(a.name);
        case '-created_at': return (b.created_at || '').localeCompare(a.created_at || '');
        case 'created_at': return (a.created_at || '').localeCompare(b.created_at || '');
        default: return (a.order - b.order) || a.name.localeCompare(b.name);
      }
    });
    return sorted;
  }, [inTab, search, sort, statusFilter, photoFilter]);

  const tabInfo = TABS.find(t => t.value === tab)!;
  const filtersActive = !!search || statusFilter !== 'all' || photoFilter !== 'all';

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setFormError('Name is required.');
      setCurrentStep(0);
      return;
    }
    if (!formData.role.trim()) {
      setFormError('Role is required.');
      setCurrentStep(1);
      return;
    }
    setFormError('');
    setSubmitting(true);
    const token = getAccessToken();
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('is_active', formData.is_active.toString());
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/team-members/${editingId}/`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // New members go to the end of their group
        const last = members.filter(m => categoryOf(m) === formData.category).reduce((max, m) => Math.max(max, m.order), -1);
        submitData.append('order', String(last + 1));
        await axios.post(`${API_BASE_URL}/team-members/`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      await fetchMembers();
      setTab(formData.category);
      closeForm();
    } catch (error) {
      console.error('Failed to save:', error);
      setFormError(getErrorMessage(error, 'Failed to save team member.'));
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
        category: categoryOf(member),
        is_active: member.is_active
      });
      setImagePreview(member.image_url);
    } else {
      setEditingId(null);
      setFormData({ ...EMPTY_FORM, category: tab });
      setImagePreview(null);
    }
    setImageFile(null);
    setFormError('');
    setCurrentStep(0);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData(EMPTY_FORM);
      setImageFile(null);
      setImagePreview(null);
      setCurrentStep(0);
    }, 300);
  };

  const handleDelete = async (member: TeamMember) => {
    if (!confirm(`Remove ${member.name} from the team?`)) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/team-members/${member.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMembers();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to delete.'));
    }
  };

  const toggleActive = async (member: TeamMember, checked: boolean) => {
    try {
      const token = getAccessToken();
      await axios.patch(`${API_BASE_URL}/team-members/${member.id}/`, { is_active: checked }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMembers();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to update.'));
    }
  };

  const showApplications = tab === 'volunteer' && volunteerView === 'applications';
  const newApplications = appStats?.by_status?.new ?? 0;

  const cards = showApplications && appStats
    ? [
        { label: 'Applications', value: appStats.total, sub: `${appStats.last_30_days} in the last 30 days` },
        { label: 'New', value: appStats.by_status.new ?? 0, sub: 'waiting for a reply' },
        { label: 'Approved', value: appStats.by_status.approved ?? 0, sub: `${appStats.by_status.contacted ?? 0} contacted` },
        {
          label: 'Top interest',
          value: appStats.top_interests[0]?.title ?? '—',
          sub: appStats.top_interests[0] ? `${appStats.top_interests[0].count} applicants` : 'no data yet',
        },
      ]
    : [
        { label: `Total ${tabInfo.label.toLowerCase()}`, value: summary.total, sub: `${summary.roles} different role${summary.roles === 1 ? '' : 's'}` },
        { label: 'Shown on site', value: summary.active, sub: summary.hidden ? `${summary.hidden} hidden` : 'none hidden' },
        {
          label: 'With photo',
          value: summary.total ? `${Math.round((summary.withPhoto / summary.total) * 100)}%` : '—',
          sub: `${summary.total - summary.withPhoto} missing a photo`,
        },
        tab === 'volunteer'
          ? { label: 'New applications', value: newApplications, sub: 'see the Applications view' }
          : { label: 'Added recently', value: summary.recent, sub: 'in the last 30 days' },
      ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team</h1>
          <p className="text-sm text-slate-600 mt-1">
            Founders, staff and volunteers shown on the Team page. {members.length} people in total.
          </p>
        </div>
        {!showApplications && (
          <button
            onClick={() => openForm()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            <HiOutlinePlus className="w-4 h-4" /> Add {tabInfo.singular}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100 w-full sm:w-fit overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => { setTab(t.value); setSearch(''); setStatusFilter('all'); setPhotoFilter('all'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${tab === t.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.value ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{counts[t.value]}</span>
            {t.value === 'volunteer' && newApplications > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold">{newApplications} new</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'volunteer' && (
        <div className="flex gap-2">
          {(['members', 'applications'] as const).map(view => (
            <button
              key={view}
              onClick={() => setVolunteerView(view)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${volunteerView === view ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
            >
              {view === 'members' ? 'Team volunteers' : `Applications${newApplications ? ` (${newApplications} new)` : ''}`}
            </button>
          ))}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-slate-200/70">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-2 truncate tabular-nums">{card.value}</p>
            <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {showApplications ? (
        <VolunteerApplications onStats={handleAppStats} onMemberAdded={fetchMembers} />
      ) : (
        <>
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
                {formError && (
                  <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{formError}</div>
                )}
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
                    <ImageUploadField
                      label="Photo"
                      value={imageFile}
                      preview={imagePreview}
                      onChange={setImageFile}
                      onPreviewChange={setImagePreview}
                    />
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-2">Group *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {TABS.map(t => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: t.value })}
                            className={`py-2.5 rounded-xl text-sm font-semibold border transition ${formData.category === t.value ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-2">Role *</label>
                      <input
                        type="text"
                        placeholder={TABS.find(t => t.value === formData.category)?.rolePlaceholder}
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
                      <label className="text-sm font-medium text-slate-900">Show on the Team page</label>
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

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${tabInfo.label.toLowerCase()} by name, role or bio`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <div className="flex flex-wrap gap-2">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm" aria-label="Filter by visibility">
                <option value="all">All</option>
                <option value="active">Shown on site</option>
                <option value="hidden">Hidden</option>
              </select>
              <select value={photoFilter} onChange={(e) => setPhotoFilter(e.target.value as typeof photoFilter)} className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm" aria-label="Filter by photo">
                <option value="all">Any photo</option>
                <option value="with">With photo</option>
                <option value="without">Missing photo</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm" aria-label="Sort">
                {SORTS.map(s => <option key={s.value} value={s.value}>Sort: {s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Members List */}
          {loading ? (
            <ListCardGridSkeleton count={5} />
          ) : visible.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
              <p className="text-slate-600">
                {filtersActive ? 'No one matches these filters.' : `No ${tabInfo.label.toLowerCase()} yet.`}
              </p>
              {filtersActive && (
                <button onClick={() => { setSearch(''); setStatusFilter('all'); setPhotoFilter('all'); }} className="mt-2 text-sm font-semibold text-emerald-700 hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Showing {visible.length} of {inTab.length}</p>
              {visible.map((member) => (
                <ListCard key={member.id}>
                  <div className="flex items-center gap-4 p-4">
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
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">{member.name}</h3>
                        {!member.is_active && <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Hidden</span>}
                        {!member.image_url && <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">No photo</span>}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 truncate">{member.role}</p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <ToggleSwitch checked={member.is_active} onChange={(checked) => toggleActive(member, checked)} />
                      <CMSActionMenu onEdit={() => openForm(member)} onDelete={() => handleDelete(member)} />
                    </div>
                  </div>
                </ListCard>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
