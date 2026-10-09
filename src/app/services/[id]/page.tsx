'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceIcon from '@/components/ServiceIcon';

interface Service {
  id: number;
  name: string;
  description: string;
  details?: string;
  icon?: string;
  image?: string | null;
}

// Public content: a plain instance so a stale login never redirects visitors
const publicApi = axios.create();

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [others, setOthers] = useState<Service[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    setState('loading');
    Promise.all([
      publicApi.get(`${API_BASE_URL}/services/${id}/`),
      publicApi.get(`${API_BASE_URL}/services/`).catch(() => null),
    ])
      .then(([serviceRes, listRes]) => {
        setService(serviceRes.data);
        const list: Service[] = listRes ? (listRes.data.results || listRes.data) : [];
        setOthers(list.filter(s => String(s.id) !== id));
        setState('ready');
      })
      .catch(() => setState('missing'));
  }, [id]);

  const paragraphs = (service?.details || '').split(/\n+/).map(p => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      {state === 'loading' && (
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-24 text-center text-slate-500">Loading…</div>
      )}

      {state === 'missing' && (
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Service not found</h1>
          <Link href="/services" className="text-emerald-700 font-bold hover:underline">← All services</Link>
        </div>
      )}

      {state === 'ready' && service && (
        <>
          <section className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white overflow-hidden">
            {service.image && (
              <img src={service.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            )}
            <div className="relative max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
              <Link href="/services" className="inline-block text-sm font-semibold text-emerald-50 hover:text-white mb-6">← All services</Link>
              <div className="flex items-center gap-4">
                <ServiceIcon icon={service.icon} size={48} className="text-white" />
                <h1 className="text-4xl lg:text-5xl font-black leading-tight text-white">{service.name}</h1>
              </div>
              <p className="m-0 mt-5 text-lg lg:text-xl max-w-3xl text-emerald-50">{service.description}</p>
            </div>
          </section>

          <section className={`max-w-5xl mx-auto px-6 lg:px-8 py-14 lg:py-20 grid grid-cols-1 gap-10 ${paragraphs.length > 0 ? 'lg:grid-cols-3' : ''}`}>
            {/* The longer "Details" text from the admin; without it the hero description is enough */}
            {paragraphs.length > 0 && (
              <div className="lg:col-span-2 space-y-5 text-lg leading-relaxed text-slate-700">
                {paragraphs.map((p, i) => <p key={i} className="m-0">{p}</p>)}
              </div>
            )}
            <aside className={`rounded-3xl border border-emerald-200 bg-emerald-50 p-6 h-fit ${paragraphs.length > 0 ? '' : 'max-w-md w-full mx-auto text-center'}`}>
              <h2 className="text-xl font-black text-slate-900 mb-2">Interested in {service.name.toLowerCase()}?</h2>
              <p className="m-0 text-sm text-slate-600 mb-5">Tell us what you need and our team will get back to you.</p>
              <Link href="/contact" className="block text-center px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">
                Contact us
              </Link>
              <Link href="/b2b" className="block text-center mt-2 px-5 py-3 rounded-xl border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-white transition">
                Business enquiries
              </Link>
            </aside>
          </section>

          {others.length > 0 && (
            <section className="bg-slate-50 border-t border-slate-200 py-14">
              <div className="max-w-5xl mx-auto px-6 lg:px-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Other services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {others.map(other => (
                    <Link key={other.id} href={`/services/${other.id}`} className="block rounded-2xl bg-white border border-slate-200 p-5 hover:border-emerald-400 transition">
                      <p className="m-0 font-bold text-slate-900 flex items-center gap-2"><ServiceIcon icon={other.icon} size={18} className="text-emerald-600" />{other.name}</p>
                      <p className="m-0 mt-1 text-sm text-slate-600 line-clamp-2">{other.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}
