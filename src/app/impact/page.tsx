'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiBarChart, FiTrendingUp, FiAward, FiGlobe } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import CustomerCommunityImpact from '@/components/impact/CustomerCommunityImpact';
import { API_BASE_URL } from '@/config/api';
import { ImpactMetric, ImpactSummary, formatAmount, formatKg, formatMonth } from '@/lib/impact';

interface MetricCard {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
}

const METRIC_ICONS = [
  <FiTrendingUp key="trend" className="w-8 h-8" />,
  <FiGlobe key="globe" className="w-8 h-8" />,
  <FiAward key="award" className="w-8 h-8" />,
  <FiBarChart key="bar" className="w-8 h-8" />,
];

// Shown until live impact data is available
const fallbackMetrics: MetricCard[] = [
  {
    icon: <FiTrendingUp className="w-8 h-8" />,
    value: '2,847',
    label: 'Tons of Plastic Recycled',
    description: 'Diverted from landfills and oceans'
  },
  {
    icon: <FiGlobe className="w-8 h-8" />,
    value: '145K',
    label: 'CO₂ Emissions Avoided',
    description: 'Equivalent to planting 12,000 trees'
  },
  {
    icon: <FiAward className="w-8 h-8" />,
    value: '8,500+',
    label: 'Products Created',
    description: 'From recycled plastic materials'
  },
  {
    icon: <FiBarChart className="w-8 h-8" />,
    value: '156',
    label: 'Lives Impacted',
    description: 'Jobs created in waste management'
  }
];

const impactAreas = [
  {
    title: 'Ocean Conservation',
    description: 'We recover and upcycle ghost nets and ocean-bound plastic, preventing harm to marine ecosystems.',
    stats: '523 tons of ocean plastic recovered',
    icon: '🌊'
  },
  {
    title: 'Carbon Reduction',
    description: 'Recycling plastic reduces manufacturing emissions by up to 40% compared to virgin plastic production.',
    stats: '145,000 kg CO₂ saved annually',
    icon: '🌍'
  },
  {
    title: 'Community Impact',
    description: 'We partner with local communities to create employment and provide sustainable livelihoods.',
    stats: '156 jobs created in West Africa',
    icon: '👥'
  },
  {
    title: 'Circular Economy',
    description: 'Our products support a circular economy model, reducing waste and maximizing resource efficiency.',
    stats: '8,500+ products from recycled materials',
    icon: '♻️'
  }
];

export default function ImpactPage() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [headlineMetrics, setHeadlineMetrics] = useState<ImpactMetric[]>([]);
  const [summary, setSummary] = useState<ImpactSummary | null>(null);

  useEffect(() => {
    // Plain instance: skips the global auth interceptors, so a 401 here never redirects visitors to login.
    // Each request falls back independently, so the page still works with an older backend.
    const publicApi = axios.create();
    publicApi.get(`${API_BASE_URL}/impact/metrics/`)
      .then(res => setHeadlineMetrics(res.data.results || res.data))
      .catch(() => setHeadlineMetrics([]));
    publicApi.get(`${API_BASE_URL}/impact/summary/`)
      .then(res => setSummary(res.data))
      .catch(() => setSummary(null));
  }, []);

  const totals = summary && summary.totals.entries_count > 0 ? summary.totals : null;

  let metrics: MetricCard[] = fallbackMetrics;
  if (headlineMetrics.length > 0) {
    metrics = headlineMetrics.map((m, idx) => ({
      icon: METRIC_ICONS[idx % METRIC_ICONS.length],
      value: m.display_value || m.value,
      label: m.label,
      description: m.description,
    }));
  } else if (totals) {
    metrics = [
      { icon: METRIC_ICONS[0], value: formatKg(totals.plastic_diverted_kg), label: 'Plastic Diverted', description: `About ${formatAmount(totals.bottles_equivalent, 0)} plastic bottles` },
      { icon: METRIC_ICONS[1], value: formatKg(totals.co2_saved_kg), label: 'CO₂ Emissions Avoided', description: 'Compared to virgin plastic' },
      { icon: METRIC_ICONS[2], value: formatAmount(totals.products_sold + totals.items_produced, 0), label: 'Products Created & Sold', description: 'From recycled plastic materials' },
      { icon: METRIC_ICONS[3], value: formatAmount(totals.people_engaged, 0), label: 'People Engaged', description: 'Through collections, events and workshops' },
    ];
  }

  // Swap the static figures in the impact areas for live ones when we have them
  const areas = impactAreas.map(area => {
    if (!totals) return area;
    switch (area.title) {
      case 'Ocean Conservation':
        return totals.plastic_collected_kg > 0 ? { ...area, stats: `${formatKg(totals.plastic_collected_kg)} of plastic collected` } : area;
      case 'Carbon Reduction':
        return totals.co2_saved_kg > 0 ? { ...area, stats: `${formatKg(totals.co2_saved_kg)} CO₂ saved` } : area;
      case 'Community Impact':
        return totals.people_engaged > 0 ? { ...area, stats: `${formatAmount(totals.people_engaged, 0)} people engaged` } : area;
      case 'Circular Economy':
        return totals.products_sold > 0 ? { ...area, stats: `${formatAmount(totals.products_sold, 0)} recycled products sold` } : area;
      default:
        return area;
    }
  });

  const monthly = summary?.monthly || [];
  const maxMonthly = Math.max(1, ...monthly.map(m => m.plastic_collected_kg + m.plastic_sold_kg));
  const hasMonthly = monthly.some(m => m.plastic_collected_kg + m.plastic_sold_kg > 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-emerald-900 to-emerald-800 text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-black mb-6">Our Impact</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Measuring our commitment to a sustainable future through plastic recycling and community transformation
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black text-slate-900 mb-16 text-center">Our Achievements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-400 hover:shadow-lg transition"
              >
                <div className="text-emerald-600 mb-4">{metric.icon}</div>
                <p className="text-4xl font-black text-slate-900 mb-2">{metric.value}</p>
                <p className="font-bold text-slate-900 mb-2">{metric.label}</p>
                <p className="text-sm text-slate-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live trend */}
      {hasMonthly && (
        <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-3 text-center">Plastic Recycled, Month by Month</h2>
            <p className="text-slate-600 text-center mb-10">Tracked from our collections and every product sold over the last 12 months.</p>
            <div className="overflow-x-auto">
              <div className="flex items-end gap-2 h-56 min-w-[480px]">
                {monthly.map(m => {
                  const total = m.plastic_collected_kg + m.plastic_sold_kg;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full" title={`${formatMonth(m.month)}: ${formatKg(total)}`}>
                      <div className="w-full flex-1 flex flex-col justify-end">
                        {total > 0 && <p className="text-[10px] text-slate-500 text-center mb-1">{formatKg(total)}</p>}
                        <div className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-teal-400" style={{ height: `${(total / maxMonthly) * 100}%` }} />
                      </div>
                      <p className="m-0 text-[10px] text-slate-500 whitespace-nowrap">{formatMonth(m.month)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            {summary && summary.by_plastic_type.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {summary.by_plastic_type.map(t => (
                  <span key={t.plastic_type || 'none'} className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                    {t.label}: <strong>{formatKg(t.plastic_kg)}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Customer impact */}
      {summary?.customers && summary.customers.supporters > 0 && <CustomerCommunityImpact customers={summary.customers} />}

      {/* Impact Areas */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black text-slate-900 mb-16 text-center">Impact Areas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {areas.map((area, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200"
              >
                <div className="text-5xl mb-4">{area.icon}</div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{area.title}</h3>
                <p className="text-slate-700 mb-6">{area.description}</p>
                <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-600">
                  <p className="text-sm font-bold text-emerald-600 uppercase">Key Metric</p>
                  <p className="text-lg font-black text-slate-900">{area.stats}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-6">Be Part of the Change</h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
            Every product you buy contributes to reducing plastic waste and transforming lives. Join thousands of customers making a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <button className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition">
                Shop Sustainable Products
              </button>
            </Link>
            <Link href="/material-lab">
              <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-emerald-600 transition">
                Explore Materials
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">Our Commitment to Transparency</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-12 border-2 border-emerald-100">
              <p className="text-slate-700 mb-6 leading-relaxed">
                We believe in measuring and sharing our impact honestly. Every product lists the recycled plastic it contains, and our figures are tracked continuously from each sale, collection drive, production run and community event we record.
              </p>
              <p className="text-slate-700 mb-8 leading-relaxed">
                We're committed to continuous improvement and transparency in all our operations. Our goal is not just to sell products, but to create measurable positive change in environmental conservation and community development.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition">
                  Download Impact Report
                </button>
                <button
                  onClick={() => setIsContactFormOpen(true)}
                  className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </div>
  );
}
