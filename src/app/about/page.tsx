'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import Navbar from '@/components/Navbar';

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
      <Navbar />
      {/* Header */}
      <section className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-4 text-xl">Learn more about our mission and values</p>
        </div>
      </section>

      {/* Content */}
      {page && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.id} className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
