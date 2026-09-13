'use client';

import Link from 'next/link';
import { FiShoppingBag, FiFileText, FiBarChart, FiUsers } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function B2BPage() {
  const audiences = [
    {
      icon: FiUsers,
      title: 'Hotels & Resorts',
      goal: 'Outfit outdoor spaces with weather-resistant recycled plastic furniture',
      cta: 'Request B2B Catalog',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: FiBarChart3,
      title: 'Municipalities',
      goal: 'Source durable paving materials and public park benches',
      cta: 'Consult Infrastructure Team',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      icon: FiFileText,
      title: 'NGOs & Donors',
      goal: 'Fund ocean-bound plastic recovery and community jobs',
      cta: 'Partner On Impact Project',
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: FiShoppingBag,
      title: 'Retailers',
      goal: 'Stock unique upcycled accessories and home decor',
      cta: 'Explore Wholesale Options',
      color: 'from-orange-600 to-amber-600'
    }
  ];

  const services = [
    {
      title: 'Bulk RFQ Builder',
      description: 'Instantly request quotes for custom orders. Select items, colors, quantities, and submit.',
      icon: '📋'
    },
    {
      title: 'Custom Molding',
      description: 'Upload your logo or design for custom branding on bulk orders.',
      icon: '⚙️'
    },
    {
      title: 'Impact Reporting',
      description: 'Track plastic diverted, jobs created, and students trained through your partnership.',
      icon: '📊'
    },
    {
      title: 'Dedicated Support',
      description: 'Work with our operations team for logistics, customization, and project planning.',
      icon: '💼'
    }
  ];

  const productCategories = [
    {
      name: 'Educational & Institutional',
      items: 'School desks, chairs, study tables',
      price: 'Custom quotes',
      icon: '🎓'
    },
    {
      name: 'Building & Infrastructure',
      items: 'Paving tiles, structural panels, beams',
      price: 'Volume pricing available',
      icon: '🏗️'
    },
    {
      name: 'Coastal & Lifestyle',
      items: 'Coasters, keychains, artisanal pieces',
      price: 'Starting at D50',
      icon: '🌊'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl font-black mb-4 text-center">B2B & Institutional Services</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto text-center">
            Partner with us for custom recycled plastic products and sustainable solutions
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Audience Grid */}
          <h2 className="text-3xl font-black text-slate-900 mb-12">Who We Serve</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <div key={audience.title} className={`bg-gradient-to-br ${audience.color} rounded-2xl p-8 text-white shadow-lg`}>
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-black mb-3">{audience.title}</h3>
                  <p className="opacity-90 mb-6">{audience.goal}</p>
                  <button className="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100">
                    {audience.cta} →
                  </button>
                </div>
              );
            })}
          </div>

          {/* Services */}
          <div className="bg-slate-50 rounded-3xl p-12 border-2 border-slate-200 mb-20">
            <h2 className="text-3xl font-black text-slate-900 mb-12">Our B2B Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200">
                  <p className="text-4xl mb-4">{service.icon}</p>
                  <h3 className="font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Products for B2B */}
          <div className="mb-20">
            <h2 className="text-3xl font-black text-slate-900 mb-12">Product Categories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {productCategories.map((cat) => (
                <div key={cat.name} className="border-2 border-slate-200 rounded-2xl p-8 hover:border-emerald-400 transition">
                  <p className="text-5xl mb-4">{cat.icon}</p>
                  <h3 className="font-black text-slate-900 mb-2 text-lg">{cat.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{cat.items}</p>
                  <p className="font-bold text-emerald-600">{cat.price}</p>
                  <button className="mt-6 w-full px-4 py-2 border-2 border-emerald-600 text-emerald-600 font-bold rounded-lg hover:bg-emerald-50">
                    Request Quote
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RFQ Builder CTA */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white mb-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black mb-4">Instant Bulk RFQ Builder</h2>
              <p className="opacity-90 mb-8">
                Select items, customize colors, upload your logo, and get an instant quote. Perfect for schools, municipalities, and resorts.
              </p>
              <button className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-slate-100">
                Start RFQ Process →
              </button>
            </div>
          </div>

          {/* Impact Portal */}
          <div className="border-2 border-slate-200 rounded-3xl p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-6">Partnership Impact Portal</h2>
                <p className="text-slate-600 mb-6">
                  See real-time metrics of your partnership's environmental and social impact
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">→</span>
                    <span>Kg of plastic diverted from oceans</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">→</span>
                    <span>Jobs created for local communities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">→</span>
                    <span>Students trained in sustainability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">→</span>
                    <span>Custom reporting for CSR initiatives</span>
                  </li>
                </ul>
                <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
                  Learn More
                </button>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-4xl font-black text-emerald-600">2,500kg</p>
                    <p className="text-sm text-slate-600 mt-2">Plastic Recovered (Example)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-blue-600">45</p>
                    <p className="text-sm text-slate-600 mt-2">School Desks Produced</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-black text-purple-600">30</p>
                    <p className="text-sm text-slate-600 mt-2">Jobs Supported</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-20 text-center bg-slate-50 rounded-3xl p-12">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Ready to Partner?</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Contact our B2B team to discuss bulk orders, custom fabrication, and partnership opportunities
            </p>
            <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 mr-4">
              Contact Us
            </button>
            <Link href="/impact">
              <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50">
                View Our Impact
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
