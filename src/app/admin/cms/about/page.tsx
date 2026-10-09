'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { getErrorMessage } from '@/lib/api-errors';
import { ListCardGridSkeleton } from '@/components/ShimmerSkeleton';
import { ToggleSwitch } from '@/components/ios/ToggleSwitch';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi2';

// The About page is built from these CMS pages (by slug) plus the Core Values list
const SECTIONS = [
  { slug: 'about', title: 'About Us', hint: 'Who you are and your story. One paragraph per line.', rows: 8 },
  { slug: 'mission', title: 'Our Mission', hint: 'What you set out to do.', rows: 4 },
  { slug: 'vision', title: 'Our Vision', hint: 'The future you are working towards.', rows: 4 },
] as const;

type Slug = (typeof SECTIONS)[number]['slug'];

interface PageRecord {
  id: number;
  slug: string;
  title: string;
  content: string;
  is_published: boolean;
}

interface CoreValue {
  id?: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  is_active: boolean;
}

const authHeaders = () => ({ headers: { Authorization: `Bearer ${getAccessToken()}` } });
const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition';

export default function AboutAdminPage() {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Partial<Record<Slug, PageRecord>>>({});
  const [texts, setTexts] = useState<Record<Slug, string>>({ about: '', mission: '', vision: '' });
  const [values, setValues] = useState<CoreValue[]>([]);
  const [removedValueIds, setRemovedValueIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [pagesRes, valuesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/pages/`, { ...authHeaders(), params: { page_size: 100 } }),
        axios.get(`${API_BASE_URL}/features/`, { ...authHeaders(), params: { page_size: 100 } }),
      ]);
      const allPages: PageRecord[] = pagesRes.data.results || pagesRes.data;
      const bySlug: Partial<Record<Slug, PageRecord>> = {};
      const nextTexts: Record<Slug, string> = { about: '', mission: '', vision: '' };
      SECTIONS.forEach(({ slug }) => {
        const page = allPages.find(p => p.slug === slug);
        if (page) {
          bySlug[slug] = page;
          nextTexts[slug] = page.is_published ? page.content : '';
        }
      });
      setPages(bySlug);
      setTexts(nextTexts);
      const list: CoreValue[] = valuesRes.data.results || valuesRes.data;
      setValues([...list].sort((a, b) => a.order - b.order));
      setRemovedValueIds([]);
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err, 'Failed to load the About page content.') });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const savePage = async (slug: Slug, title: string) => {
    const content = texts[slug].trim();
    const existing = pages[slug];
    if (existing) {
      // Empty text hides the section (content can't be blank)
      const payload = content ? { content, title, is_published: true } : { is_published: false };
      await axios.patch(`${API_BASE_URL}/pages/${slug}/`, payload, authHeaders());
    } else if (content) {
      await axios.post(`${API_BASE_URL}/pages/`, { slug, title, content, is_published: true }, authHeaders());
    }
  };

  const handleSave = async () => {
    const incomplete = values.find(v => !v.title.trim() || !v.description.trim());
    if (incomplete) {
      setMessage({ type: 'error', text: 'Each core value needs a title and a description.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      for (const section of SECTIONS) {
        await savePage(section.slug, section.title);
      }
      for (const id of removedValueIds) {
        await axios.delete(`${API_BASE_URL}/features/${id}/`, authHeaders());
      }
      for (const [index, value] of values.entries()) {
        const payload = { title: value.title.trim(), description: value.description.trim(), icon: value.icon.trim() || '🌱', order: index, is_active: value.is_active };
        if (value.id) {
          await axios.patch(`${API_BASE_URL}/features/${value.id}/`, payload, authHeaders());
        } else {
          await axios.post(`${API_BASE_URL}/features/`, payload, authHeaders());
        }
      }
      setMessage({ type: 'ok', text: 'Saved. The About page now shows your changes.' });
      await load();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err, 'Failed to save.') });
    } finally {
      setSaving(false);
    }
  };

  const updateValue = (index: number, changes: Partial<CoreValue>) =>
    setValues(values.map((v, i) => (i === index ? { ...v, ...changes } : v)));

  const moveValue = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    setValues(next);
  };

  const removeValue = (index: number) => {
    const value = values[index];
    if (value.id) setRemovedValueIds([...removedValueIds, value.id]);
    setValues(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">About Us</h1>
          <p className="text-sm text-slate-600 mt-1">
            Edit the About page: your story, mission, vision and core values. Leave a box empty to hide that section.
          </p>
        </div>
        <a href="/about" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-emerald-700 hover:underline">
          View About page ↗
        </a>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm border ${message.type === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <ListCardGridSkeleton count={3} />
      ) : (
        <>
          {SECTIONS.map(section => (
            <div key={section.slug} className="bg-white rounded-2xl border border-slate-200/70 p-6">
              <label className="block text-sm font-semibold text-slate-900 mb-1">{section.title}</label>
              <p className="text-xs text-slate-500 mb-3">{section.hint}</p>
              <textarea
                rows={section.rows}
                value={texts[section.slug]}
                onChange={(e) => setTexts({ ...texts, [section.slug]: e.target.value })}
                className={inputClass}
              />
            </div>
          ))}

          <div className="bg-white rounded-2xl border border-slate-200/70 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Core Values</h2>
                <p className="text-xs text-slate-500">Cards shown under &quot;Our Core Values&quot;. Use an emoji as the icon.</p>
              </div>
              <button
                type="button"
                onClick={() => setValues([...values, { title: '', description: '', icon: '🌱', order: values.length, is_active: true }])}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
              >
                <HiOutlinePlus className="w-4 h-4" /> Add value
              </button>
            </div>

            {values.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No core values yet.</p>
            ) : (
              <div className="space-y-3">
                {values.map((value, index) => (
                  <div key={value.id ?? `new-${index}`} className="rounded-xl border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-[72px_1fr_auto] gap-3 items-start">
                    <input
                      type="text"
                      maxLength={50}
                      value={value.icon}
                      onChange={(e) => updateValue(index, { icon: e.target.value })}
                      aria-label="Icon"
                      className={`${inputClass} text-center text-2xl px-2`}
                    />
                    <div className="space-y-2">
                      <input
                        type="text"
                        maxLength={255}
                        value={value.title}
                        onChange={(e) => updateValue(index, { title: e.target.value })}
                        placeholder="e.g. Community first"
                        aria-label="Title"
                        className={inputClass}
                      />
                      <textarea
                        rows={2}
                        value={value.description}
                        onChange={(e) => updateValue(index, { description: e.target.value })}
                        placeholder="A sentence or two about this value"
                        aria-label="Description"
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <div className="flex md:flex-col items-center gap-2">
                      <ToggleSwitch checked={value.is_active} onChange={(checked) => updateValue(index, { is_active: checked })} />
                      <div className="flex gap-1">
                        <button type="button" onClick={() => moveValue(index, -1)} disabled={index === 0} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move up">
                          <HiOutlineArrowUp className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => moveValue(index, 1)} disabled={index === values.length - 1} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move down">
                          <HiOutlineArrowDown className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => removeValue(index)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50" aria-label="Remove">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
