'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { getErrorMessage } from '@/lib/api-errors';
import { ListCardGridSkeleton } from '@/components/ShimmerSkeleton';
import { SPONSORSHIP_STATUSES, Sponsorship, SponsorshipStatus, formatMoney } from '@/lib/sponsorship';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineEnvelope, HiOutlinePhone, HiOutlineTrash } from 'react-icons/hi2';

type Stats = Record<string, { count: number; items: number; amount: Record<string, number> }>;

const authHeaders = () => ({ Authorization: `Bearer ${getAccessToken()}` });

const statusStyle = (status: string) =>
  SPONSORSHIP_STATUSES.find(s => s.value === status)?.style || 'bg-slate-100 text-slate-600 border-slate-200';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const sumAmounts = (stats: Stats, statuses: string[]) => {
  const totals: Record<string, number> = {};
  statuses.forEach(s => Object.entries(stats[s]?.amount || {}).forEach(([cur, amt]) => { totals[cur] = (totals[cur] || 0) + amt; }));
  return Object.entries(totals).map(([cur, amt]) => formatMoney(amt, cur)).join(' + ') || formatMoney(0, 'USD');
};

export default function SponsorshipAdmin() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | SponsorshipStatus>('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoadError('');
    try {
      const params: Record<string, string | number> = { page_size: 200 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const [listRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/impact/sponsorship/`, { headers: authHeaders(), params }),
        axios.get(`${API_BASE_URL}/impact/sponsorship/stats/`, { headers: authHeaders() }).catch(() => null),
      ]);
      setSponsorships(listRes.data.results || listRes.data);
      if (statsRes) setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch sponsorships:', err);
      setLoadError(getErrorMessage(err, 'Failed to load sponsorships.'));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchData, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchData, search]);

  const update = async (sponsorship: Sponsorship, changes: Partial<Sponsorship>) => {
    setSavingId(sponsorship.id);
    try {
      const res = await axios.patch(`${API_BASE_URL}/impact/sponsorship/${sponsorship.id}/`, changes, { headers: authHeaders() });
      setSponsorships(prev => prev.map(s => (s.id === sponsorship.id ? res.data : s)));
      axios.get(`${API_BASE_URL}/impact/sponsorship/stats/`, { headers: authHeaders() }).then(r => setStats(r.data)).catch(() => {});
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update sponsorship.'));
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (sponsorship: Sponsorship) => {
    if (!confirm(`Delete sponsorship ${sponsorship.reference} from ${sponsorship.sponsor_name}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/impact/sponsorship/${sponsorship.id}/`, { headers: authHeaders() });
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to delete sponsorship.'));
    }
  };

  const openCount = (stats.pending?.count || 0) + (stats.contacted?.count || 0);
  const committedItems = ['paid', 'delivered'].reduce((n, s) => n + (stats[s]?.items || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Sponsorships</h1>
        <p className="text-sm text-slate-600 mt-1">
          Pledges from the “Sponsor Now” form. Contact the sponsor, mark as paid, then delivered. Delivered desks are added to the impact log automatically.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Awaiting follow-up', value: String(openCount), sub: 'pending + contacted' },
          { label: 'Pledged (open)', value: sumAmounts(stats, ['pending', 'contacted']), sub: 'not yet paid' },
          { label: 'Received', value: sumAmounts(stats, ['paid', 'delivered']), sub: 'paid + delivered' },
          { label: 'Desks funded', value: String(committedItems), sub: `${stats.delivered?.items || 0} delivered` },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-slate-200/70">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{card.value}</p>
            <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {[{ value: '', label: 'All' }, ...SPONSORSHIP_STATUSES].map(s => (
            <button
              key={s.value || 'all'}
              onClick={() => setStatusFilter(s.value as '' | SponsorshipStatus)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                statusFilter === s.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s.label}
              {s.value && stats[s.value] ? <span className="ml-1.5 opacity-70">{stats[s.value].count}</span> : null}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reference, name, email, phone"
          className="w-full md:w-80 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* List */}
      {loadError ? (
        <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">{loadError}</div>
      ) : loading ? (
        <ListCardGridSkeleton count={5} />
      ) : sponsorships.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No sponsorships found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sponsorships.map(s => {
            const isOpen = expanded === s.id;
            const notes = notesDraft[s.id] ?? s.admin_notes ?? '';
            return (
              <div key={s.id} className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                  <button onClick={() => setExpanded(isOpen ? null : s.id)} className="flex-1 min-w-0 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{s.reference}</span>
                      <h3 className="font-semibold text-slate-900 truncate">
                        {s.sponsor_type === 'organization' && s.organization_name ? `${s.organization_name} · ` : ''}{s.sponsor_name}
                      </h3>
                      {s.is_anonymous && <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Anonymous</span>}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {s.items_count} × {s.item_type} · <strong className="text-slate-900">{formatMoney(s.amount, s.currency)}</strong> · {formatDate(s.created_at)}
                    </p>
                  </button>
                  <div className="flex items-center gap-2">
                    <select
                      value={s.status}
                      disabled={savingId === s.id}
                      onChange={(e) => update(s, { status: e.target.value as SponsorshipStatus })}
                      className={`px-3 py-2 rounded-lg border text-sm font-semibold ${statusStyle(s.status)}`}
                      aria-label="Status"
                    >
                      {SPONSORSHIP_STATUSES.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
                    </select>
                    <button onClick={() => setExpanded(isOpen ? null : s.id)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Details">
                      {isOpen ? <HiOutlineChevronUp className="w-5 h-5" /> : <HiOutlineChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <a href={`mailto:${s.sponsor_email}?subject=${encodeURIComponent(`Your sponsorship ${s.reference}`)}`} className="flex items-center gap-2 text-emerald-700 hover:underline">
                        <HiOutlineEnvelope className="w-4 h-4" /> {s.sponsor_email}
                      </a>
                      {s.sponsor_phone && (
                        <a href={`tel:${s.sponsor_phone}`} className="flex items-center gap-2 text-emerald-700 hover:underline">
                          <HiOutlinePhone className="w-4 h-4" /> {s.sponsor_phone}
                        </a>
                      )}
                      {s.message && (
                        <div className="mt-2 p-3 rounded-xl bg-white border border-slate-200">
                          <p className="text-xs font-semibold text-slate-500 mb-1">Message from sponsor</p>
                          <p className="text-slate-800 whitespace-pre-line">{s.message}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Internal notes</label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotesDraft({ ...notesDraft, [s.id]: e.target.value })}
                        placeholder="e.g. Called on 3 Oct, paying by bank transfer"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <button onClick={() => handleDelete(s)} className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
                          <HiOutlineTrash className="w-4 h-4" /> Delete
                        </button>
                        <button
                          onClick={() => update(s, { admin_notes: notes })}
                          disabled={savingId === s.id || notes === (s.admin_notes ?? '')}
                          className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40"
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
