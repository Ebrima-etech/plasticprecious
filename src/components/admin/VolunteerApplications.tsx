'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { getErrorMessage } from '@/lib/api-errors';
import { ListCardGridSkeleton } from '@/components/ShimmerSkeleton';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineEnvelope, HiOutlinePhone, HiOutlineTrash, HiOutlineUserPlus } from 'react-icons/hi2';

export interface VolunteerApplication {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  interests: string[];
  availability: string;
  availability_label: string;
  skills: string;
  motivation: string;
  how_heard: string;
  status: 'new' | 'contacted' | 'approved' | 'declined';
  status_label: string;
  admin_notes: string;
  team_member: number | null;
  team_member_name: string | null;
  created_at: string;
}

export interface ApplicationStats {
  total: number;
  by_status: Record<string, number>;
  last_30_days: number;
  top_interests: { title: string; count: number }[];
}

const STATUSES = [
  { value: 'new', label: 'New', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'contacted', label: 'Contacted', style: 'bg-sky-50 text-sky-700 border-sky-200' },
  { value: 'approved', label: 'Approved', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'declined', label: 'Declined', style: 'bg-slate-100 text-slate-600 border-slate-200' },
] as const;

const authHeaders = () => ({ headers: { Authorization: `Bearer ${getAccessToken()}` } });

interface VolunteerApplicationsProps {
  onStats?: (stats: ApplicationStats) => void;
  onMemberAdded?: () => void;
}

export default function VolunteerApplications({ onStats, onMemberAdded }: VolunteerApplicationsProps) {
  const [items, setItems] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadStats = useCallback(() => {
    axios.get(`${API_BASE_URL}/impact/volunteer-applications/stats/`, authHeaders())
      .then(res => onStats?.(res.data))
      .catch(() => {});
  }, [onStats]);

  const load = useCallback(async () => {
    setError('');
    try {
      const params: Record<string, string | number> = { page_size: 200, ordering };
      if (statusFilter) params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const res = await axios.get(`${API_BASE_URL}/impact/volunteer-applications/`, { ...authHeaders(), params });
      setItems(res.data.results || res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load applications.'));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, ordering]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const replace = (updated: VolunteerApplication) => setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));

  const update = async (app: VolunteerApplication, changes: Partial<VolunteerApplication>) => {
    setBusyId(app.id);
    try {
      const res = await axios.patch(`${API_BASE_URL}/impact/volunteer-applications/${app.id}/`, changes, authHeaders());
      replace(res.data);
      loadStats();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update the application.'));
    } finally {
      setBusyId(null);
    }
  };

  const addToTeam = async (app: VolunteerApplication) => {
    const role = window.prompt(`Add ${app.full_name} to the team as a volunteer. Role shown on the Team page:`, app.interests[0] ? `${app.interests[0]} Volunteer` : 'Volunteer');
    if (role === null) return;
    setBusyId(app.id);
    try {
      const res = await axios.post(`${API_BASE_URL}/impact/volunteer-applications/${app.id}/add_to_team/`, { role }, authHeaders());
      replace(res.data);
      loadStats();
      onMemberAdded?.();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to add to the team.'));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (app: VolunteerApplication) => {
    if (!confirm(`Delete the application from ${app.full_name}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/impact/volunteer-applications/${app.id}/`, authHeaders());
      setItems(prev => prev.filter(i => i.id !== app.id));
      loadStats();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete.'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, phone, skills"
          className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm" aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={ordering} onChange={(e) => setOrdering(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm" aria-label="Sort">
          <option value="-created_at">Newest first</option>
          <option value="created_at">Oldest first</option>
          <option value="full_name">Name A–Z</option>
          <option value="-full_name">Name Z–A</option>
        </select>
      </div>

      {error ? (
        <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">{error}</div>
      ) : loading ? (
        <ListCardGridSkeleton count={4} />
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60 text-slate-600">
          No applications found. They appear here when people apply on the Get Involved page.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(app => {
            const open = expanded === app.id;
            const status = STATUSES.find(s => s.value === app.status) || STATUSES[0];
            const note = notes[app.id] ?? app.admin_notes ?? '';
            return (
              <div key={app.id} className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-3 p-4">
                  <button onClick={() => setExpanded(open ? null : app.id)} className="flex-1 min-w-0 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{app.full_name}</h3>
                      {app.team_member && <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">On team</span>}
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5 truncate">
                      {[app.location, app.availability_label, app.interests.join(', ')].filter(Boolean).join(' · ')}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Applied {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </button>
                  <div className="flex items-center gap-2">
                    <select
                      value={app.status}
                      disabled={busyId === app.id}
                      onChange={(e) => update(app, { status: e.target.value as VolunteerApplication['status'] })}
                      className={`px-3 py-2 rounded-lg border text-sm font-semibold ${status.style}`}
                      aria-label="Status"
                    >
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    {!app.team_member && (
                      <button
                        onClick={() => addToTeam(app)}
                        disabled={busyId === app.id}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                        title="Approve and add to the team as a volunteer"
                      >
                        <HiOutlineUserPlus className="w-4 h-4" /> Add to team
                      </button>
                    )}
                    <button onClick={() => setExpanded(open ? null : app.id)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Details">
                      {open ? <HiOutlineChevronUp className="w-5 h-5" /> : <HiOutlineChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <a href={`mailto:${app.email}?subject=${encodeURIComponent('Volunteering with Precious Plastic Gambia')}`} className="flex items-center gap-2 text-emerald-700 hover:underline">
                          <HiOutlineEnvelope className="w-4 h-4" /> {app.email}
                        </a>
                        {app.phone && (
                          <a href={`tel:${app.phone}`} className="flex items-center gap-2 text-emerald-700 hover:underline">
                            <HiOutlinePhone className="w-4 h-4" /> {app.phone}
                          </a>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">Why they want to volunteer</p>
                        <p className="text-slate-800 whitespace-pre-line">{app.motivation}</p>
                      </div>
                      {app.skills && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">Skills / experience</p>
                          <p className="text-slate-800 whitespace-pre-line">{app.skills}</p>
                        </div>
                      )}
                      {app.how_heard && <p className="text-xs text-slate-500">Heard about us: {app.how_heard}</p>}
                      {app.team_member_name && <p className="text-xs text-emerald-700">Added to the team as {app.team_member_name}.</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Internal notes</label>
                      <textarea
                        rows={4}
                        value={note}
                        onChange={(e) => setNotes({ ...notes, [app.id]: e.target.value })}
                        placeholder="e.g. Called on 12 Oct, joining the Saturday cleanup"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <button onClick={() => remove(app)} className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                          <HiOutlineTrash className="w-4 h-4" /> Delete
                        </button>
                        <button
                          onClick={() => update(app, { admin_notes: note })}
                          disabled={busyId === app.id || note === (app.admin_notes ?? '')}
                          className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold disabled:opacity-40"
                        >
                          Save notes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
