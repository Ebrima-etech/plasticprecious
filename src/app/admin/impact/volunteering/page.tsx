'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { getErrorMessage } from '@/lib/api-errors';
import { ListCardGridSkeleton } from '@/components/ShimmerSkeleton';
import { ToggleSwitch } from '@/components/ios/ToggleSwitch';
import { VOLUNTEER_COLORS, VOLUNTEER_ICONS, VolunteerOpportunity } from '@/lib/volunteer';
import { HiOutlineArrowDown, HiOutlineArrowUp, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${getAccessToken()}` } });
const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20';

export default function VolunteeringAdminPage() {
  const [items, setItems] = useState<VolunteerOpportunity[]>([]);
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/impact/volunteer-opportunities/`, authHeaders());
      const list: VolunteerOpportunity[] = res.data.results || res.data;
      setItems([...list].sort((a, b) => a.order - b.order));
      setRemovedIds([]);
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err, 'Failed to load volunteer opportunities.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (index: number, changes: Partial<VolunteerOpportunity>) =>
    setItems(items.map((item, i) => (i === index ? { ...item, ...changes } : item)));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  const remove = (index: number) => {
    const item = items[index];
    if (item.id) setRemovedIds([...removedIds, item.id]);
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (items.some(item => !item.title.trim() || !item.description.trim())) {
      setMessage({ type: 'error', text: 'Each card needs a title and a short description.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      for (const id of removedIds) {
        await axios.delete(`${API_BASE_URL}/impact/volunteer-opportunities/${id}/`, authHeaders());
      }
      for (const [index, item] of items.entries()) {
        const payload = { title: item.title.trim(), description: item.description.trim(), icon: item.icon, color: item.color, order: index, is_active: item.is_active };
        if (item.id) {
          await axios.patch(`${API_BASE_URL}/impact/volunteer-opportunities/${item.id}/`, payload, authHeaders());
        } else {
          await axios.post(`${API_BASE_URL}/impact/volunteer-opportunities/`, payload, authHeaders());
        }
      }
      setMessage({ type: 'ok', text: 'Saved. The Get Involved page now shows these cards.' });
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err, 'Failed to save.') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Volunteering</h1>
          <p className="text-sm text-slate-600 mt-1">The &quot;Ways to volunteer&quot; cards on the Get Involved page.</p>
        </div>
        <div className="flex gap-2">
          <a href="/get-involved" target="_blank" rel="noopener noreferrer" className="px-3 py-2 text-sm font-semibold text-emerald-700 hover:underline">
            View page ↗
          </a>
          <button
            type="button"
            onClick={() => setItems([...items, { title: '', description: '', icon: 'users', color: 'emerald', order: items.length, is_active: true }])}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            <HiOutlinePlus className="w-4 h-4" /> Add card
          </button>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm border ${message.type === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <ListCardGridSkeleton count={4} />
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60 text-slate-600">
          No cards yet. Add one to show it on Get Involved.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const { Icon } = VOLUNTEER_ICONS[item.icon] || VOLUNTEER_ICONS.users;
            const gradient = (VOLUNTEER_COLORS[item.color] || VOLUNTEER_COLORS.emerald).gradient;
            return (
              <div key={item.id ?? `new-${index}`} className="bg-white rounded-2xl border border-slate-200/70 p-4 grid grid-cols-1 lg:grid-cols-[180px_1fr_auto] gap-4 items-start">
                {/* Preview */}
                <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 text-white ${item.is_active ? '' : 'opacity-40'}`}>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <Icon size={22} className="text-white" />
                  </div>
                  <p className="m-0 font-black text-white truncate">{item.title || 'Title'}</p>
                  <p className="m-0 text-xs text-white/90 line-clamp-2">{item.description || 'Short description'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    maxLength={100}
                    value={item.title}
                    onChange={(e) => update(index, { title: e.target.value })}
                    placeholder="Title, e.g. Beach Cleanups"
                    aria-label="Title"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    maxLength={255}
                    value={item.description}
                    onChange={(e) => update(index, { description: e.target.value })}
                    placeholder="Short description"
                    aria-label="Description"
                    className={inputClass}
                  />
                  <select value={item.icon} onChange={(e) => update(index, { icon: e.target.value })} aria-label="Icon" className={inputClass}>
                    {Object.entries(VOLUNTEER_ICONS).map(([key, { label }]) => <option key={key} value={key}>Icon: {label}</option>)}
                  </select>
                  <select value={item.color} onChange={(e) => update(index, { color: e.target.value })} aria-label="Colour" className={inputClass}>
                    {Object.entries(VOLUNTEER_COLORS).map(([key, { label }]) => <option key={key} value={key}>Colour: {label}</option>)}
                  </select>
                </div>

                <div className="flex lg:flex-col items-center gap-2">
                  <ToggleSwitch checked={item.is_active} onChange={(checked) => update(index, { is_active: checked })} />
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move up">
                      <HiOutlineArrowUp className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move down">
                      <HiOutlineArrowDown className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => remove(index)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" aria-label="Remove">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && (
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      )}
    </div>
  );
}
