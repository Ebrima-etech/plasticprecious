'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ImpactPage() {
  const impactDetails = [
    {
      id: 1,
      title: 'Environmental Impact',
      metric: 'Environmental',
      description: 'Tons of plastic diverted from oceans and landfills',
      image: 'https://images.pexels.com/photos/3951628/pexels-photo-3951628.jpeg?w=800&h=600&fit=crop',
      fullDescription: 'Our environmental initiatives focus on reducing plastic waste that would otherwise end up in landfills and oceans. By collecting, processing, and recycling plastic materials, we divert thousands of tons annually from harmful disposal methods.',
      stats: [
        { label: 'Plastic Collected', value: '500+', unit: 'Tons/Year' },
        { label: 'Ocean Waste Prevented', value: '2000+', unit: 'Tons' },
        { label: 'Landfill Reduction', value: '75%', unit: 'Decrease' },
      ],
      highlights: [
        'Advanced sorting and processing facilities',
        'Community-driven collection programs',
        'Partnerships with local environmental groups',
        'Ocean cleanup initiatives in West Africa',
      ],
    },
    {
      id: 2,
      title: 'Economic Impact',
      metric: 'Economic',
      description: 'Employment created for marginalized communities',
      image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=800&h=600&fit=crop',
      fullDescription: 'We believe sustainable practices should also create economic opportunities for marginalized communities. Through our programs, we provide fair wages, skills training, and employment paths for hundreds of workers.',
      stats: [
        { label: 'Jobs Created', value: '300+', unit: 'Direct Employment' },
        { label: 'Average Wage Increase', value: '45%', unit: 'Year-over-Year' },
        { label: 'Women Employed', value: '60%', unit: 'Workforce' },
      ],
      highlights: [
        'Fair wage employment opportunities',
        'Skills development programs',
        'Cooperative business models',
        'Women-led initiatives and support',
      ],
    },
    {
      id: 3,
      title: 'Educational Impact',
      metric: 'Educational',
      description: 'Awareness and skills transfer in sustainability',
      image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=800&h=600&fit=crop',
      fullDescription: 'Education is central to sustainable change. We conduct workshops, training programs, and awareness campaigns to educate communities about environmental responsibility and sustainable practices.',
      stats: [
        { label: 'People Trained', value: '2000+', unit: 'Annually' },
        { label: 'Workshops Conducted', value: '150+', unit: 'Per Year' },
        { label: 'Schools Engaged', value: '50+', unit: 'Partnerships' },
      ],
      highlights: [
        'Hands-on sustainability workshops',
        'School environmental programs',
        'Community awareness campaigns',
        'Skills transfer initiatives',
      ],
    },
    {
      id: 4,
      title: 'Health Impact',
      metric: 'Health',
      description: 'Healthier communities through reduced pollution',
      image: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?w=800&h=600&fit=crop',
      fullDescription: 'Plastic pollution poses serious health risks through air and water contamination. Our initiatives reduce these health hazards by preventing plastic waste from contaminating water sources and releasing harmful chemicals.',
      stats: [
        { label: 'People Benefited', value: '50000+', unit: 'Direct Impact' },
        { label: 'Water Sources Cleaned', value: '100+', unit: 'Locations' },
        { label: 'Air Quality Improved', value: '30%', unit: 'Better' },
      ],
      highlights: [
        'Water source restoration projects',
        'Reduced air pollution in communities',
        'Health awareness programs',
        'Medical support initiatives',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link href="/" className="text-emerald-50 hover:text-white mb-4 inline-block text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Impact</h1>
          <p className="text-lg text-emerald-50 max-w-2xl">
            Measurable change across communities and the environment through our sustainable practices and programs.
          </p>
        </div>
      </section>

      {/* Impact Details */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-20">
            {impactDetails.map((impact, idx) => (
              <div key={impact.id} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'md:grid-cols-2 md:auto-cols-max' : ''}`}>
                {/* Image - alternating sides */}
                <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="rounded-2xl overflow-hidden h-96 shadow-lg">
                    <img src={impact.image} alt={impact.title} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Content */}
                <div className={idx % 2 === 1 ? 'md:order-1' : ''}>
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-lg font-bold">
                      {impact.id}
                    </div>
                    <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">Impact Area</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{impact.title}</h2>
                  <p className="text-neutral-600 text-lg mb-6 leading-relaxed">
                    {impact.fullDescription}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {impact.stats.map((stat, i) => (
                      <div key={i} className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                        <p className="text-2xl font-bold text-emerald-600 mb-1">{stat.value}</p>
                        <p className="text-xs text-neutral-600 font-semibold uppercase">{stat.label}</p>
                        <p className="text-xs text-neutral-500">{stat.unit}</p>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">Key Initiatives</h3>
                    <ul className="space-y-3">
                      {impact.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-emerald-600 text-xl mt-1">✓</span>
                          <span className="text-neutral-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Join Our Mission</h2>
          <p className="text-neutral-600 text-lg mb-8 max-w-2xl mx-auto">
            Be part of the solution. Whether through supporting our initiatives, volunteering, or purchasing sustainable products, together we can create meaningful change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition">
                Learn About Our Services
              </button>
            </Link>
            <Link href="/shop">
              <button className="px-8 py-3 bg-white hover:bg-emerald-50 text-emerald-600 font-bold rounded-lg border border-emerald-600 transition">
                Shop Sustainable Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
