'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const [page, setPage] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [pageRes, featuresRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/pages/about/`),
        axios.get(`${API_BASE_URL}/features/`),
      ]);
      setPage(pageRes.data);
      setFeatures(featuresRes.data.results || featuresRes.data);
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
            📖 ABOUT US
          </div>
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">Learn Our Mission</h1>
          <p className="text-xl max-w-2xl text-emerald-50">Discover the story behind our commitment to sustainability and positive impact</p>
        </div>
      </section>

      {/* Content */}
      {page && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <div className="prose prose-lg max-w-none text-slate-700">
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="py-16 lg:py-24 bg-white relative overflow-hidden grid-pattern">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="mb-16">
              <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                ✨ WHY CHOOSE US
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.id} className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col h-full hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300">
                  <div className="px-6 pt-6 pb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-3xl">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow px-6 pb-6">
                    <h3 className="font-black text-slate-900 text-2xl leading-tight mb-3 group-hover:text-emerald-600 transition">{feature.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed flex-grow">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
