'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { getErrorMessage } from '@/lib/api-errors';
import { Pagination } from '@/components/admin/Pagination';
import { ListCardGridSkeleton } from '@/components/ShimmerSkeleton';
import { IMPACT_SOURCES, PLASTIC_TYPES, formatKg, formatAmount, toNumber } from '@/lib/impact';
import { HiOutlineArrowDownTray, HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';

interface ImpactEntry {
  id: number;
  date: string;
  source: string;
  source_label: string;
  title: string;
  plastic_type: string;
  plastic_type_label: string;
  plastic_kg: string;
  co2_saved_kg: string;
  water_saved_liters: string;
  items_count: number;
  people_engaged: number;
  product: number | null;
  product_name: string | null;
  zone: number | null;
  zone_name: string | null;
  notes: string;
  is_automatic: boolean;
  created_by_email: string | null;
}

interface Option {
  id: number;
  name: string;
}

const SOURCE_FILTERS = [{ value: 'sale', label: 'Product sale' }, ...IMPACT_SOURCES.filter(s => s.value !== 'sale')];

const SOURCE_STYLES: Record<string, string> = {
  sale: 'bg-sky-50 text-sky-700',
  collection: 'bg-emerald-50 text-emerald-700',
  production: 'bg-violet-50 text-violet-700',
  event: 'bg-amber-50 text-amber-700',
  adjustment: 'bg-slate-100 text-slate-700',
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const emptyForm = () => ({
  date: today(),
  source: 'collection',
  title: '',
  plastic_type: '',
  plastic_kg: '',
  co2_saved_kg: '',
  water_saved_liters: '',
  items_count: '',
  people_engaged: '',
  product: '',
  zone: '',
  notes: '',
});

const authHeaders = () => ({ Authorization: `Bearer ${getAccessToken()}` });

const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20';

export default function ImpactLogPage() {
  const [entries, setEntries] = useState<ImpactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({ source: '', start: '', end: '', search: '' });

  const [products, setProducts] = useState<Option[]>([]);
  const [zones, setZones] = useState<Option[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm());
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const queryParams = useCallback(() => {
    const params: Record<string, string | number> = { page, page_size: pageSize };
    if (filters.source) params.source = filters.source;
    if (filters.start) params.start = filters.start;
    if (filters.end) params.end = filters.end;
    if (filters.search) params.search = filters.search;
    return params;
  }, [page, pageSize, filters]);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/impact/entries/`, { headers: authHeaders(), params: queryParams() });
      setEntries(response.data.results || response.data);
      setTotalCount(response.data.count ?? (response.data.results || response.data).length);
    } catch (error) {
      console.error('Failed to fetch impact log:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setLoadError('The impact log is not available yet. Deploy the latest backend to enable it.');
      } else {
        setLoadError(getErrorMessage(error, 'Failed to load the impact log.'));
      }
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [productsRes, zonesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products/`, { params: { page_size: 500 } }),
          axios.get(`${API_BASE_URL}/impact/zones/`, { headers: authHeaders(), params: { page_size: 500 } }).catch(() => null),
        ]);
        setProducts((productsRes.data.results || productsRes.data).map((p: Option) => ({ id: p.id, name: p.name })));
        if (zonesRes) {
          setZones((zonesRes.data.results || zonesRes.data).map((z: Option) => ({ id: z.id, name: z.name })));
        }
      } catch (error) {
        console.error('Failed to load products/zones:', error);
      }
    };
    fetchOptions();
  }, []);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const openForm = (entry?: ImpactEntry) => {
    if (entry) {
      setEditingId(entry.id);
      setFormData({
        date: entry.date,
        source: entry.source,
        title: entry.title,
        plastic_type: entry.plastic_type,
        plastic_kg: toNumber(entry.plastic_kg) ? String(toNumber(entry.plastic_kg)) : '',
        co2_saved_kg: toNumber(entry.co2_saved_kg) ? String(toNumber(entry.co2_saved_kg)) : '',
        water_saved_liters: toNumber(entry.water_saved_liters) ? String(toNumber(entry.water_saved_liters)) : '',
        items_count: entry.items_count ? String(entry.items_count) : '',
        people_engaged: entry.people_engaged ? String(entry.people_engaged) : '',
        product: entry.product ? String(entry.product) : '',
        zone: entry.zone ? String(entry.zone) : '',
        notes: entry.notes,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm());
    }
    setFormError('');
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(emptyForm());
    setFormError('');
  };

  const handleSubmit = async () => {
    if (!formData.date) {
      setFormError('Date is required.');
      return;
    }
    const isSale = formData.source === 'sale';
    if (isSale && (!formData.product || !formData.items_count)) {
      setFormError('An offline sale needs a product and the number of units sold.');
      return;
    }
    const hasNumbers = [formData.plastic_kg, formData.co2_saved_kg, formData.water_saved_liters, formData.items_count, formData.people_engaged]
      .some(v => toNumber(v) > 0);
    if (!hasNumbers) {
      setFormError('Enter at least one amount (plastic, CO₂, water, items or people).');
      return;
    }

    setFormError('');
    setSubmitting(true);
    const payload = {
      date: formData.date,
      source: formData.source,
      title: formData.title,
      plastic_type: formData.plastic_type,
      plastic_kg: formData.plastic_kg || '0',
      co2_saved_kg: formData.co2_saved_kg || '0',
      water_saved_liters: formData.water_saved_liters || '0',
      items_count: parseInt(formData.items_count || '0', 10),
      people_engaged: parseInt(formData.people_engaged || '0', 10),
      product: formData.product ? Number(formData.product) : null,
      zone: formData.zone ? Number(formData.zone) : null,
      notes: formData.notes,
    };
    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/impact/entries/${editingId}/`, payload, { headers: authHeaders() });
      } else {
        await axios.post(`${API_BASE_URL}/impact/entries/`, payload, { headers: authHeaders() });
      }
      closeForm();
      fetchEntries();
    } catch (error) {
      console.error('Failed to save entry:', error);
      setFormError(getErrorMessage(error, 'Failed to save entry.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (entry: ImpactEntry) => {
    if (!confirm(`Delete "${entry.title || entry.source_label}" from ${entry.date}?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/impact/entries/${entry.id}/`, { headers: authHeaders() });
      fetchEntries();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to delete entry.'));
    }
  };

  const handleExport = async () => {
    try {
      const params = { ...queryParams() };
      delete params.page;
      delete params.page_size;
      const response = await axios.get(`${API_BASE_URL}/impact/entries/export/`, {
        headers: authHeaders(),
        params,
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `impact-log-${today()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to export.'));
    }
  };

  const isSaleForm = formData.source === 'sale';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <Link href="/admin/impact" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-2">
            <HiOutlineArrowLeft className="w-4 h-4" /> Impact dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Impact log</h1>
          <p className="text-sm text-slate-600 mt-1">
            Every collection, production run and event. Online sales are added automatically when an order is confirmed.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <HiOutlineArrowDownTray className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => openForm()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            <HiOutlinePlus className="w-4 h-4" /> Log impact
          </button>
        </div>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5">
          <h3 className="font-semibold text-slate-900">{editingId ? 'Edit entry' : 'New impact entry'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Type *</label>
              <select value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className={inputClass}>
                {IMPACT_SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Date *</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Title</label>
              <input
                type="text"
                maxLength={255}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={isSaleForm ? 'e.g. Saturday market' : 'e.g. Kololi beach cleanup'}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Product{isSaleForm ? ' *' : ''}</label>
              <select value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className={inputClass}>
                <option value="">None</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                {isSaleForm ? 'Units sold *' : formData.source === 'production' ? 'Items produced' : 'Items'}
              </label>
              <input type="number" min="0" step="1" value={formData.items_count} onChange={(e) => setFormData({ ...formData, items_count: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Collection zone</label>
              <select value={formData.zone} onChange={(e) => setFormData({ ...formData, zone: e.target.value })} className={inputClass}>
                <option value="">None</option>
                {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Plastic (kg)</label>
              <input type="number" min="0" step="0.001" value={formData.plastic_kg} onChange={(e) => setFormData({ ...formData, plastic_kg: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Plastic type</label>
              <select value={formData.plastic_type} onChange={(e) => setFormData({ ...formData, plastic_type: e.target.value })} className={inputClass}>
                <option value="">Not specified</option>
                {PLASTIC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">CO₂ saved (kg)</label>
              <input type="number" min="0" step="0.001" value={formData.co2_saved_kg} onChange={(e) => setFormData({ ...formData, co2_saved_kg: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Water saved (L)</label>
              <input type="number" min="0" step="0.01" value={formData.water_saved_liters} onChange={(e) => setFormData({ ...formData, water_saved_liters: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">People engaged</label>
              <input type="number" min="0" step="1" value={formData.people_engaged} onChange={(e) => setFormData({ ...formData, people_engaged: e.target.value })} className={inputClass} />
            </div>
          </div>
          {isSaleForm && (
            <p className="text-xs text-slate-500 -mt-2">
              Leave plastic, CO₂ and water empty to calculate them from the product’s impact × units sold.
            </p>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Notes</label>
            <textarea rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className={`${inputClass} resize-none`} />
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
              {submitting ? 'Saving...' : editingId ? 'Update' : 'Save entry'}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input
          type="search"
          placeholder="Search title, notes, product"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className={`${inputClass} col-span-2 md:col-span-1`}
        />
        <select value={filters.source} onChange={(e) => updateFilter('source', e.target.value)} className={inputClass}>
          <option value="">All types</option>
          {SOURCE_FILTERS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <input type="date" value={filters.start} onChange={(e) => updateFilter('start', e.target.value)} className={inputClass} aria-label="From date" />
        <input type="date" value={filters.end} onChange={(e) => updateFilter('end', e.target.value)} className={inputClass} aria-label="To date" />
      </div>

      {/* Entries */}
      {loadError ? (
        <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">{loadError}</div>
      ) : loading ? (
        <ListCardGridSkeleton count={5} />
      ) : entries.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No entries found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/70 overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Details</th>
                <th className="px-4 py-3 font-semibold text-right">Plastic</th>
                <th className="px-4 py-3 font-semibold text-right">CO₂</th>
                <th className="px-4 py-3 font-semibold text-right">Items</th>
                <th className="px-4 py-3 font-semibold text-right">People</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-700">{entry.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${SOURCE_STYLES[entry.source] || SOURCE_STYLES.adjustment}`}>
                      {entry.source_label}
                    </span>
                    {entry.is_automatic && <span className="block text-[10px] text-slate-400 mt-1">Auto from order</span>}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium text-slate-900 truncate">{entry.title || entry.product_name || '—'}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {[entry.plastic_type_label, entry.zone_name, entry.notes].filter(Boolean).join(' · ')}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{toNumber(entry.plastic_kg) ? formatKg(entry.plastic_kg) : '—'}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{toNumber(entry.co2_saved_kg) ? formatKg(entry.co2_saved_kg) : '—'}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{entry.items_count ? formatAmount(entry.items_count, 0) : '—'}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{entry.people_engaged ? formatAmount(entry.people_engaged, 0) : '—'}</td>
                  <td className="px-4 py-3">
                    {!entry.is_automatic && (
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openForm(entry)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Edit">
                          <HiOutlinePencilSquare className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(entry)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600" title="Delete">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !loadError && totalCount > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(totalCount / pageSize))}
          onPageChange={setPage}
          itemsPerPage={pageSize}
          onItemsPerPageChange={(n) => { setPageSize(n); setPage(1); }}
          totalItems={totalCount}
        />
      )}
    </div>
  );
}
