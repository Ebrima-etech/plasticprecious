'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { getErrorMessage } from '@/lib/api-errors';
import { ListCard } from '@/components/ios/ListCard';
import { ToggleSwitch } from '@/components/ios/ToggleSwitch';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';
import { ListCardGridSkeleton } from '@/components/ShimmerSkeleton';
import {
  AUTO_VALUES, ImpactMetric, ImpactSummary, formatAmount, formatKg, formatMonth,
} from '@/lib/impact';
import { HiOutlineArrowPath, HiOutlineClipboardDocumentList, HiOutlinePlus } from 'react-icons/hi2';

type Period = 'month' | '3m' | 'ytd' | '12m' | 'all';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'month', label: 'This month' },
  { value: '3m', label: 'Last 3 months' },
  { value: 'ytd', label: 'Year to date' },
  { value: '12m', label: 'Last 12 months' },
  { value: 'all', label: 'All time' },
];

const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const periodRange = (period: Period): { start?: string; end?: string } => {
  const today = new Date();
  switch (period) {
    case 'month':
      return { start: isoDate(new Date(today.getFullYear(), today.getMonth(), 1)), end: isoDate(today) };
    case '3m':
      return { start: isoDate(new Date(today.getFullYear(), today.getMonth() - 2, 1)), end: isoDate(today) };
    case 'ytd':
      return { start: isoDate(new Date(today.getFullYear(), 0, 1)), end: isoDate(today) };
    case '12m':
      return { start: isoDate(new Date(today.getFullYear(), today.getMonth() - 11, 1)), end: isoDate(today) };
    default:
      return {};
  }
};

const EMPTY_METRIC = { label: '', value: '', auto_value: '', description: '', order: 0, is_active: true };

const authHeaders = () => ({ Authorization: `Bearer ${getAccessToken()}` });

export default function ImpactDashboardPage() {
  const [period, setPeriod] = useState<Period>('12m');
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_METRIC);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    setSummaryError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/impact/summary/`, {
        headers: authHeaders(),
        params: periodRange(period),
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch impact summary:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setSummaryError('Impact tracking is not available yet. Deploy the latest backend to enable it.');
      } else {
        setSummaryError(getErrorMessage(error, 'Failed to load impact summary.'));
      }
    } finally {
      setSummaryLoading(false);
    }
  }, [period]);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/impact/metrics/`, { headers: authHeaders() });
      setMetrics(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSync = async () => {
    const refresh = confirm(
      'Recalculate sales impact from confirmed orders.\n\n' +
      'OK = also update past sales with the current product impact values.\n' +
      'Cancel = only add missing sales.'
    );
    setSyncing(true);
    setSyncMessage('');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/impact/entries/recalculate_sales/`,
        { refresh },
        { headers: authHeaders() }
      );
      const { created, updated, removed } = response.data;
      setSyncMessage(`Sales synced: ${created} added, ${updated} updated, ${removed} removed.`);
      fetchSummary();
      fetchMetrics();
    } catch (error) {
      setSyncMessage(getErrorMessage(error, 'Failed to sync sales.'));
    } finally {
      setSyncing(false);
    }
  };

  // --- Headline metrics ---------------------------------------------------

  const openForm = (metric?: ImpactMetric) => {
    if (metric) {
      setEditingId(metric.id);
      setFormData({
        label: metric.label,
        value: metric.value || '',
        auto_value: metric.auto_value || '',
        description: metric.description || '',
        order: metric.order ?? 0,
        is_active: metric.is_active ?? true,
      });
    } else {
      setEditingId(null);
      setFormData({ ...EMPTY_METRIC, order: metrics.length });
    }
    setFormError('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(EMPTY_METRIC);
    setFormError('');
  };

  const handleSubmit = async () => {
    if (!formData.label.trim()) {
      setFormError('Label is required.');
      return;
    }
    if (!formData.auto_value && !formData.value.trim()) {
      setFormError('Enter a value or choose a live value.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/impact/metrics/${editingId}/`, formData, { headers: authHeaders() });
      } else {
        await axios.post(`${API_BASE_URL}/impact/metrics/`, formData, { headers: authHeaders() });
      }
      fetchMetrics();
      closeForm();
    } catch (error) {
      console.error('Failed to save metric:', error);
      setFormError(getErrorMessage(error, 'Failed to save metric.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this metric?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/impact/metrics/${id}/`, { headers: authHeaders() });
      fetchMetrics();
    } catch (error) {
      console.error('Failed to delete metric:', error);
      alert(getErrorMessage(error, 'Failed to delete metric.'));
    }
  };

  const toggleMetric = async (metric: ImpactMetric, checked: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/impact/metrics/${metric.id}/`, { is_active: checked }, { headers: authHeaders() });
      fetchMetrics();
    } catch (error) {
      console.error('Failed to update metric:', error);
    }
  };

  const totals = summary?.totals;
  const maxMonthly = Math.max(
    1,
    ...(summary?.monthly || []).map(m => m.plastic_collected_kg + m.plastic_sold_kg)
  );
  const maxSource = Math.max(1, ...(summary?.by_source || []).map(s => s.plastic_kg));
  const maxType = Math.max(1, ...(summary?.by_plastic_type || []).map(t => t.plastic_kg));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Impact</h1>
          <p className="text-sm text-slate-600 mt-1">
            Environmental and social impact of the business, tracked from sales and the impact log.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <HiOutlineArrowPath className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync sales
          </button>
          <Link
            href="/admin/impact/log"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            <HiOutlineClipboardDocumentList className="w-4 h-4" />
            Impact log
          </Link>
        </div>
      </div>

      {syncMessage && (
        <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">{syncMessage}</div>
      )}

      {summaryError ? (
        <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">{summaryError}</div>
      ) : summaryLoading || !totals ? (
        <ListCardGridSkeleton count={3} />
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Plastic diverted', value: formatKg(totals.plastic_diverted_kg), sub: `≈ ${formatAmount(totals.bottles_equivalent, 0)} bottles`, tone: 'emerald' },
              { label: 'CO₂ saved', value: formatKg(totals.co2_saved_kg), sub: 'vs. virgin plastic', tone: 'teal' },
              { label: 'Products sold', value: formatAmount(totals.products_sold, 0), sub: `${formatKg(totals.plastic_in_products_sold_kg)} recycled plastic`, tone: 'blue' },
              { label: 'People engaged', value: formatAmount(totals.people_engaged, 0), sub: 'events, workshops, collections', tone: 'amber' },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-2xl p-5 border border-slate-200/70">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-3 tabular-nums">{card.value}</p>
                <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Plastic collected', value: formatKg(totals.plastic_collected_kg) },
              { label: 'Water saved', value: `${formatAmount(totals.water_saved_liters)} L` },
              { label: 'Items produced', value: formatAmount(totals.items_produced, 0) },
              { label: 'Log entries', value: formatAmount(totals.entries_count, 0) },
            ].map(card => (
              <div key={card.label} className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200/70">
                <p className="text-xs text-slate-500">{card.label}</p>
                <p className="text-lg font-semibold text-slate-900 tabular-nums">{card.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 -mt-4">
            “Plastic diverted” is the larger of plastic collected and recycled plastic in products sold, so the same plastic is not counted twice.
          </p>

          {/* Monthly trend */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/70">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Plastic by month</h2>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500" />Collected</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-sky-500" />In products sold</span>
              </div>
            </div>
            {summary.monthly.every(m => !m.plastic_collected_kg && !m.plastic_sold_kg) ? (
              <p className="text-sm text-slate-500 py-10 text-center">No impact recorded in this period yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex items-end gap-2 h-56 min-w-[480px]">
                  {summary.monthly.map(m => {
                    const total = m.plastic_collected_kg + m.plastic_sold_kg;
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full">
                        <div
                          className="w-full flex-1 flex flex-col justify-end"
                          title={`${formatMonth(m.month)}: ${formatKg(m.plastic_collected_kg)} collected, ${formatKg(m.plastic_sold_kg)} in products sold, ${m.products_sold} sold`}
                        >
                          {total > 0 && (
                            <p className="text-[10px] text-slate-500 text-center mb-1 tabular-nums">{formatAmount(total, 0)}</p>
                          )}
                          <div className="w-full rounded-t-md overflow-hidden flex flex-col-reverse" style={{ height: `${(total / maxMonthly) * 100}%` }}>
                            <div className="bg-emerald-500" style={{ height: `${total ? (m.plastic_collected_kg / total) * 100 : 0}%` }} />
                            <div className="bg-sky-500" style={{ height: `${total ? (m.plastic_sold_kg / total) * 100 : 0}%` }} />
                          </div>
                        </div>
                        <p className="m-0 text-[10px] text-slate-500 whitespace-nowrap">{formatMonth(m.month)}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-3">Values in kg. Hover a bar for details.</p>
              </div>
            )}
          </div>

          {/* Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/70">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-5">By source</h2>
              {summary.by_source.length === 0 ? (
                <p className="text-sm text-slate-500">Nothing recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {summary.by_source.map(s => (
                    <div key={s.source}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-800">{s.label}</span>
                        <span className="text-slate-600 tabular-nums">{formatKg(s.plastic_kg)} · {s.entries} entries</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(s.plastic_kg / maxSource) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/70">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-5">By plastic type</h2>
              {summary.by_plastic_type.length === 0 ? (
                <p className="text-sm text-slate-500">Nothing recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {summary.by_plastic_type.map(t => (
                    <div key={t.plastic_type || 'none'}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-800">{t.label}</span>
                        <span className="text-slate-600 tabular-nums">{formatKg(t.plastic_kg)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(t.plastic_kg / maxType) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/70">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-5">Top products by impact</h2>
              {!summary.top_products || summary.top_products.length === 0 ? (
                <p className="text-sm text-slate-500">No confirmed sales with impact data in this period.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wide">
                      <th className="pb-2 font-semibold">Product</th>
                      <th className="pb-2 font-semibold text-right">Sold</th>
                      <th className="pb-2 font-semibold text-right">Plastic</th>
                      <th className="pb-2 font-semibold text-right">CO₂</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary.top_products.map(p => (
                      <tr key={p.product_id}>
                        <td className="py-2.5 font-medium text-slate-800">
                          <Link href={`/admin/products/${p.product_id}/edit`} className="hover:text-emerald-700">{p.name}</Link>
                        </td>
                        <td className="py-2.5 text-right tabular-nums">{p.units_sold}</td>
                        <td className="py-2.5 text-right tabular-nums">{formatKg(p.plastic_kg)}</td>
                        <td className="py-2.5 text-right tabular-nums">{formatKg(p.co2_saved_kg)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/70">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-5">Catalog coverage</h2>
              {summary.catalog ? (
                <>
                  <p className="text-3xl font-bold text-slate-900 tabular-nums">
                    {summary.catalog.products_with_impact}
                    <span className="text-lg text-slate-400 font-medium"> / {summary.catalog.products_total}</span>
                  </p>
                  <p className="text-sm text-slate-600 mt-1">active products have impact data</p>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden mt-4">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${summary.catalog.products_total ? (summary.catalog.products_with_impact / summary.catalog.products_total) * 100 : 0}%` }}
                    />
                  </div>
                  {summary.catalog.products_with_impact < summary.catalog.products_total && (
                    <Link href="/admin/products" className="inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800 mt-4">
                      Add impact to remaining products →
                    </Link>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500">Not available.</p>
              )}
            </div>
          </div>

          {summary.by_zone.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/70">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">By collection zone</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {summary.by_zone.map(z => (
                  <div key={z.zone_id} className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200/70">
                    <p className="text-xs text-slate-500 truncate">{z.name}</p>
                    <p className="text-lg font-semibold text-slate-900 tabular-nums">{formatKg(z.plastic_kg)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Headline metrics */}
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Headline metrics</h2>
            <p className="text-sm text-slate-600">Shown on the public Impact page. Use a live value to keep them up to date automatically.</p>
          </div>
          <button
            onClick={() => openForm()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            <HiOutlinePlus className="w-4 h-4" /> Add metric
          </button>
        </div>

        {isFormOpen && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
            <h3 className="font-semibold text-slate-900">{editingId ? 'Edit metric' : 'New metric'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Label *</label>
                <input
                  type="text"
                  maxLength={100}
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Plastic diverted"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Value source</label>
                <select
                  value={formData.auto_value}
                  onChange={(e) => setFormData({ ...formData, auto_value: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Typed in manually</option>
                  {AUTO_VALUES.map(a => <option key={a.value} value={a.value}>Live: {a.label}</option>)}
                </select>
              </div>
              {!formData.auto_value && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Value *</label>
                  <input
                    type="text"
                    maxLength={50}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g. 2,500 kg"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Display order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value || '0', 10) })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-600 block mb-2">Description</label>
                <input
                  type="text"
                  maxLength={255}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Kept out of landfills and the ocean"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <label className="text-sm font-medium text-slate-900">Show on public site</label>
              <ToggleSwitch checked={formData.is_active} onChange={(checked) => setFormData({ ...formData, is_active: checked })} />
            </div>
            {formError && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{formError}</div>
            )}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button onClick={closeForm} className="px-6 py-2 text-slate-700 font-medium hover:bg-white rounded-lg">Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        )}

        {metricsLoading ? (
          <ListCardGridSkeleton count={3} />
        ) : metrics.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200/60">
            <p className="text-slate-600">No headline metrics yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {metrics.map(metric => (
              <ListCard key={metric.id}>
                <div className="flex items-center gap-4 p-4">
                  <div className="min-w-[96px] px-3 py-2 rounded-xl bg-emerald-50 text-center">
                    <p className="text-lg font-bold text-emerald-800 tabular-nums">{metric.display_value || metric.value || '—'}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">{metric.label}</h3>
                    <p className="text-xs text-slate-600 truncate mt-0.5">{metric.description}</p>
                    {metric.auto_value && (
                      <span className="inline-block text-[11px] font-medium bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full mt-1.5">
                        Live: {AUTO_VALUES.find(a => a.value === metric.auto_value)?.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {metric.is_active !== undefined && (
                      <ToggleSwitch checked={metric.is_active} onChange={(checked) => toggleMetric(metric, checked)} />
                    )}
                    <CMSActionMenu onEdit={() => openForm(metric)} onDelete={() => handleDelete(metric.id)} />
                  </div>
                </div>
              </ListCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
