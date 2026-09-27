'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiShoppingBag, FiFileText, FiBarChart, FiUsers, FiX } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function B2BPage() {
  const [showRFQForm, setShowRFQForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    category: '',
    customCategory: '',
    quantity: '',
    specifications: ''
  });

  const handleRFQSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const rfqData = {
        organization_name: formData.company,
        contact_person_name: formData.contact,
        contact_email: formData.email,
        contact_phone: formData.phone,
        product_category: formData.category,
        quantity: parseInt(formData.quantity) || 0,
        custom_requirements: formData.specifications,
      };

      const response = await fetch('https://preciousback.onrender.com/api/impact/rfq/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rfqData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          company: '',
          contact: '',
          email: '',
          phone: '',
          category: '',
          customCategory: '',
          quantity: '',
          specifications: ''
        });
        setTimeout(() => {
          setShowRFQForm(false);
          setSubmitSuccess(false);
        }, 2000);
      } else {
        console.error('RFQ submission failed:', response.status);
      }
    } catch (error) {
      console.error('Error submitting RFQ:', error);
    } finally {
      setSubmitting(false);
    }
  };
  const audiences = [
    {
      icon: FiUsers,
      title: 'Hotels & Resorts',
      goal: 'Outfit outdoor spaces with weather-resistant recycled plastic furniture',
      cta: 'Request B2B Catalog',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: FiBarChart,
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
          <h1 className="text-5xl font-black mb-4 text-center text-white">B2B & Institutional Services</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto text-center text-white">
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
                  <Icon className="w-12 h-12 mb-4 text-white" />
                  <h3 className="text-2xl font-black mb-3 text-white">{audience.title}</h3>
                  <p className="opacity-90 mb-6 text-white">{audience.goal}</p>
                  <button
                    onClick={() => setShowRFQForm(true)}
                    className="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition"
                  >
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
                  <button
                    onClick={() => setShowRFQForm(true)}
                    className="mt-6 w-full px-4 py-2 border-2 border-emerald-600 text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition"
                  >
                    Request Quote
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RFQ Builder CTA */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white mb-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black mb-4 text-white">Instant Bulk RFQ Builder</h2>
              <p className="opacity-90 mb-8 text-white">
                Select items, customize colors, upload your logo, and get an instant quote. Perfect for schools, municipalities, and resorts.
              </p>
              <button
                onClick={() => setShowRFQForm(true)}
                className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-slate-100 transition"
              >
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
                <Link href="/impact">
                  <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
                    Learn More
                  </button>
                </Link>
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
            <button
              onClick={() => setShowRFQForm(true)}
              className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 mr-4 transition"
            >
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

      {/* RFQ Form Modal */}
      {showRFQForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-8 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-3xl font-black text-white">Request for Quote</h2>
                <p className="text-emerald-50 text-sm mt-1">Fill in your details to get a custom quote</p>
              </div>
              <button
                onClick={() => setShowRFQForm(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition text-white"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleRFQSubmit} className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto space-y-8">
              {submitSuccess && (
                <div className="p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-700 font-semibold text-center animate-slideDown">
                  <p className="text-lg">✓ Success!</p>
                  <p className="text-sm mt-2">Your RFQ has been submitted. We'll contact you within 24 hours.</p>
                </div>
              )}

              {/* Contact Information Section */}
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-600 rounded-full"></span>
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2.5 tracking-wide">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 hover:bg-white transition"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2.5 tracking-wide">Contact Person *</label>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 hover:bg-white transition"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2.5 tracking-wide">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 hover:bg-white transition"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2.5 tracking-wide">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 hover:bg-white transition"
                      placeholder="+220 XXXX XXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Product Information Section */}
              <div className="pt-4 border-t-2 border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-teal-600 rounded-full"></span>
                  Product Details
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2.5 tracking-wide">Product Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 hover:bg-white transition font-medium"
                    >
                      <option value="">Select Category</option>
                      <option value="educational">🎓 Educational & Institutional</option>
                      <option value="infrastructure">🏗️ Building & Infrastructure</option>
                      <option value="lifestyle">🌊 Coastal & Lifestyle</option>
                      <option value="custom">✨ Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2.5 tracking-wide">Quantity *</label>
                    <input
                      type="number"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 hover:bg-white transition"
                      placeholder="Units needed"
                      min="1"
                    />
                  </div>
                </div>

                {/* Custom Category Input - Shows when "custom" is selected */}
                {formData.category === 'custom' && (
                  <div className="mt-4 p-5 bg-blue-50 border-2 border-blue-200 rounded-xl animate-slideDown">
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2.5 tracking-wide">Describe Your Custom Product *</label>
                    <input
                      type="text"
                      required={formData.category === 'custom'}
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full px-4 py-3.5 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-blue-50 transition"
                      placeholder="e.g., Custom plastic signage with logo branding..."
                    />
                    <p className="text-xs text-blue-600 mt-2">✨ Tell us what custom product you need and we'll provide a tailored quote</p>
                  </div>
                )}
              </div>

              {/* Specifications Section */}
              <div className="pt-4 border-t-2 border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                  Specifications
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2.5 tracking-wide">Custom Requirements</label>
                  <textarea
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    className="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 hover:bg-white transition"
                    rows={4}
                    placeholder="Describe your custom requirements, colors, designs, materials, delivery timeline, etc."
                  />
                  <p className="text-xs text-slate-500 mt-2">Include any specific colors, branding, materials, or delivery requirements</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t-2 border-slate-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRFQForm(false)}
                  disabled={submitting}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {submitting ? '⏳ Submitting...' : '✓ Submit RFQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
