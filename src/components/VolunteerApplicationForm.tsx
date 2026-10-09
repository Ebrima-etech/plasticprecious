'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheckCircle } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getErrorMessage } from '@/lib/api-errors';

// Public form: a plain instance so a stale login never blocks or redirects applicants
const publicApi = axios.create();

const AVAILABILITY = [
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'evenings', label: 'Evenings' },
  { value: 'flexible', label: 'Flexible' },
];

const EMPTY = {
  full_name: '',
  email: '',
  phone: '',
  location: '',
  availability: 'flexible',
  skills: '',
  motivation: '',
  how_heard: '',
};

const inputClass = 'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition';

interface VolunteerApplicationFormProps {
  opportunities: string[];
  // Interest picked by clicking a volunteer card; preselected in the form
  preselected?: string | null;
}

export default function VolunteerApplicationForm({ opportunities, preselected }: VolunteerApplicationFormProps) {
  const [form, setForm] = useState(EMPTY);
  const [interests, setInterests] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (preselected) setInterests(prev => (prev.includes(preselected) ? prev : [...prev, preselected]));
  }, [preselected]);

  const toggleInterest = (title: string) =>
    setInterests(prev => (prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError('Please enter your name and a valid email.');
      return;
    }
    if (form.motivation.trim().length < 10) {
      setError('Please tell us a little about why you want to volunteer.');
      return;
    }
    if (!consent) {
      setError('Please agree to be contacted about volunteering.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await publicApi.post(`${API_BASE_URL}/impact/volunteer-applications/`, { ...form, interests });
      setDone(form.full_name.trim().split(' ')[0]);
      setForm(EMPTY);
      setInterests([]);
      setConsent(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        setError('Too many applications from your network. Please try again later.');
      } else {
        setError(getErrorMessage(err, 'Something went wrong. Please try again.'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-10">
        <FiCheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-slate-900 mb-2">Thank you, {done}!</h3>
        <p className="m-0 text-slate-600 max-w-md mx-auto">
          Your application has been received. Our team will contact you by email or phone about the next steps.
        </p>
        <button onClick={() => setDone(null)} className="mt-6 text-sm font-semibold text-emerald-700 hover:underline">
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full name *</label>
          <input name="full_name" value={form.full_name} onChange={handleChange} maxLength={150} autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone / WhatsApp</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} maxLength={40} autoComplete="tel" placeholder="+220" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Where do you live?</label>
          <input name="location" value={form.location} onChange={handleChange} maxLength={120} placeholder="Town or area" className={inputClass} />
        </div>
      </div>

      {opportunities.length > 0 && (
        <div>
          <p className="m-0 text-xs font-semibold text-slate-600 mb-2">What would you like to help with?</p>
          <div className="flex flex-wrap gap-2">
            {opportunities.map(title => {
              const selected = interests.includes(title);
              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => toggleInterest(title)}
                  aria-pressed={selected}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                    selected ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  {selected ? '✓ ' : ''}{title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">When are you available?</label>
          <select name="availability" value={form.availability} onChange={handleChange} className={inputClass}>
            {AVAILABILITY.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">How did you hear about us?</label>
          <input name="how_heard" value={form.how_heard} onChange={handleChange} maxLength={120} placeholder="Friend, social media, event…" className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Skills or experience</label>
        <textarea name="skills" rows={2} value={form.skills} onChange={handleChange} placeholder="e.g. teaching, carpentry, social media, driving" className={`${inputClass} resize-none`} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Why do you want to volunteer? *</label>
        <textarea name="motivation" rows={3} value={form.motivation} onChange={handleChange} className={`${inputClass} resize-none`} />
      </div>

      <label className="flex items-start gap-3 text-sm text-slate-700 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 w-4 h-4 accent-emerald-600" />
        I agree to be contacted by Precious Plastic Gambia about volunteering.
      </label>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

      <button type="submit" disabled={submitting} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 disabled:opacity-60 transition">
        {submitting ? 'Sending…' : 'Apply to volunteer'}
      </button>
    </form>
  );
}
