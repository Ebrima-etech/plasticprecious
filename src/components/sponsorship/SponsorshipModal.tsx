'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiX, FiMinus, FiPlus, FiCheckCircle } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getErrorMessage } from '@/lib/api-errors';
import { DEFAULT_SPONSORSHIP_OPTION, Sponsorship, SponsorshipOption, formatMoney } from '@/lib/sponsorship';

// Plain instance: no auth headers or 401 redirects for this public form
const publicApi = axios.create();

const EMPTY_FORM = {
  sponsor_type: 'individual' as 'individual' | 'organization',
  sponsor_name: '',
  organization_name: '',
  sponsor_email: '',
  sponsor_phone: '',
  items_count: 1,
  message: '',
  is_anonymous: false,
};

const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition';

interface SponsorshipModalProps {
  open: boolean;
  onClose: () => void;
  initialCount?: number;
}

export default function SponsorshipModal({ open, onClose, initialCount = 1 }: SponsorshipModalProps) {
  const [option, setOption] = useState<SponsorshipOption>(DEFAULT_SPONSORSHIP_OPTION);
  const [form, setForm] = useState({ ...EMPTY_FORM, items_count: initialCount });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<Sponsorship | null>(null);

  useEffect(() => {
    if (!open) return;
    publicApi
      .get(`${API_BASE_URL}/impact/sponsorship/options/`)
      .then(res => res.data.items?.[0] && setOption(res.data.items[0]))
      .catch(() => { /* keep the default option */ });
  }, [open]);

  // Close on Escape and stop the page behind from scrolling
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const total = option.unit_price * form.items_count;
  const setCount = (n: number) => setForm({ ...form, items_count: Math.max(1, Math.min(1000, Math.round(n) || 1)) });

  function handleClose() {
    onClose();
    // Reset after the modal is gone so a new pledge starts clean
    setTimeout(() => {
      setForm({ ...EMPTY_FORM, items_count: initialCount });
      setSubmitted(null);
      setError('');
    }, 200);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sponsor_name.trim() || !form.sponsor_email.trim()) {
      setError('Please enter your name and email.');
      return;
    }
    if (form.sponsor_type === 'organization' && !form.organization_name.trim()) {
      setError('Please enter your organization’s name.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const response = await publicApi.post(`${API_BASE_URL}/impact/sponsorship/`, {
        ...form,
        item_type: option.item_type,
        organization_name: form.sponsor_type === 'organization' ? form.organization_name : '',
      });
      setSubmitted(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        setError('Too many submissions from your network. Please try again later.');
      } else {
        setError(getErrorMessage(err, 'Something went wrong. Please try again.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sponsorship-title"
    >
      <div
        className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 sm:p-10 text-center">
            <FiCheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 id="sponsorship-title" className="text-2xl font-black text-slate-900 mb-2">Thank you, {submitted.sponsor_name.split(' ')[0]}!</h2>
            <p className="m-0 text-slate-600">
              Your pledge to sponsor <strong>{submitted.items_count} {submitted.item_type.toLowerCase()}{submitted.items_count > 1 ? 's' : ''}</strong>{' '}
              ({formatMoney(submitted.amount, submitted.currency)}) has been received.
            </p>
            <div className="my-6 inline-block px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <p className="m-0 text-xs font-bold text-emerald-700 uppercase tracking-widest">Your reference</p>
              <p className="m-0 text-2xl font-black text-emerald-900 tracking-wider">{submitted.reference}</p>
            </div>
            <div className="text-left bg-slate-50 rounded-2xl p-5 text-sm text-slate-700 space-y-2">
              <p className="m-0 font-bold text-slate-900">What happens next</p>
              <p className="m-0">1. Our team will contact you at <strong>{submitted.sponsor_email}</strong> with payment details.</p>
              <p className="m-0">2. We make the desks from recycled plastic and deliver them to a school.</p>
              <p className="m-0">3. You receive a certificate of impact with photos of the delivery.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button onClick={handleClose} className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700">
                Done
              </button>
              <Link href="/impact" onClick={handleClose} className="px-6 py-3 rounded-xl border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-50">
                See our impact
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white px-6 sm:px-8 pt-8 pb-6 rounded-t-3xl">
              <p className="m-0 text-xs font-black text-emerald-200 uppercase tracking-widest mb-2">Sponsorship</p>
              <h2 id="sponsorship-title" className="text-2xl sm:text-3xl font-black text-white mb-2">Sponsor a {option.item_type.toLowerCase()}</h2>
              <p className="m-0 text-emerald-100 text-sm">{option.description}</p>
            </div>

            <div className="px-6 sm:px-8 py-6 space-y-5">
              {/* Quantity */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="m-0 text-sm font-bold text-slate-900">How many {option.item_type.toLowerCase()}s?</p>
                    <p className="m-0 text-xs text-slate-600">{formatMoney(option.unit_price, option.currency)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setCount(form.items_count - 1)} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50" aria-label="Fewer">
                      <FiMinus />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={form.items_count}
                      onChange={(e) => setCount(parseInt(e.target.value, 10))}
                      className="w-16 text-center px-2 py-2 rounded-lg border border-slate-200 font-bold"
                      aria-label="Number to sponsor"
                    />
                    <button type="button" onClick={() => setCount(form.items_count + 1)} className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50" aria-label="More">
                      <FiPlus />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[1, 5, 10, 25].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCount(n)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${form.items_count === n ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'}`}
                    >
                      {n === 25 ? 'A classroom (25)' : n}
                    </button>
                  ))}
                </div>
                <div className="flex items-end justify-between mt-4 pt-4 border-t border-emerald-200">
                  <p className="m-0 text-xs text-slate-600">
                    👧 {form.items_count} student{form.items_count > 1 ? 's' : ''} · ♻️ {option.plastic_kg * form.items_count} kg plastic recycled
                  </p>
                  <p className="m-0 text-2xl font-black text-emerald-800">{formatMoney(total, option.currency)}</p>
                </div>
              </div>

              {/* Sponsor type */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100">
                {(['individual', 'organization'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm({ ...form, sponsor_type: type })}
                    className={`py-2 rounded-lg text-sm font-semibold transition ${form.sponsor_type === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                  >
                    {type === 'individual' ? 'Individual' : 'Organization'}
                  </button>
                ))}
              </div>

              {form.sponsor_type === 'organization' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Organization name *</label>
                  <input type="text" maxLength={255} value={form.organization_name} onChange={(e) => setForm({ ...form, organization_name: e.target.value })} className={inputClass} />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{form.sponsor_type === 'organization' ? 'Contact person *' : 'Full name *'}</label>
                  <input type="text" required maxLength={255} autoComplete="name" value={form.sponsor_name} onChange={(e) => setForm({ ...form, sponsor_name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone / WhatsApp</label>
                  <input type="tel" maxLength={30} autoComplete="tel" value={form.sponsor_phone} onChange={(e) => setForm({ ...form, sponsor_phone: e.target.value })} placeholder="+220" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
                <input type="email" required autoComplete="email" value={form.sponsor_email} onChange={(e) => setForm({ ...form, sponsor_email: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dedication or message <span className="font-normal text-slate-400">(optional)</span></label>
                <textarea rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="e.g. In memory of my grandmother, for a school in Gunjur" className={`${inputClass} resize-none`} />
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={form.is_anonymous} onChange={(e) => setForm({ ...form, is_anonymous: e.target.checked })} className="mt-0.5 w-4 h-4 accent-emerald-600" />
                Keep my sponsorship anonymous (don’t mention my name publicly)
              </label>

              {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

              <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl bg-emerald-600 text-white font-black text-lg hover:bg-emerald-700 disabled:opacity-60 transition">
                {submitting ? 'Sending…' : `Pledge ${formatMoney(total, option.currency)}`}
              </button>
              <p className="m-0 text-xs text-slate-500 text-center">
                No payment now. We’ll contact you with payment details and send a certificate of impact once the desks are delivered.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
