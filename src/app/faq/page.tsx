'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/faqs/`);
      setFaqs(response.data.results || response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .grid-pattern {
          background-image:
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 0 0;
        }
      `}</style>
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
            ❓ FAQ
          </div>
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">Frequently Asked Questions</h1>
          <p className="text-xl max-w-2xl text-emerald-50">Find answers to common questions about our products and services</p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden grid-pattern">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300">
                <button
                  onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left font-black text-slate-900 flex justify-between items-center group-hover:text-emerald-600 transition"
                >
                  {faq.question}
                  <span className="text-emerald-600 group-hover:text-emerald-700 transition text-xl">
                    {expanded === faq.id ? '−' : '+'}
                  </span>
                </button>
                {expanded === faq.id && (
                  <div className="px-6 py-4 bg-emerald-50/30 border-t border-slate-200">
                    <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
