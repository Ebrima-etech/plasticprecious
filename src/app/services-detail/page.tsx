'use client';

import Link from 'next/link';
import { GiRecycle, BiRecycle, MdSchool } from 'react-icons/gi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ServicesDetailPage() {
  const services = [
    {
      id: 1,
      icon: GiRecycle,
      title: 'Collections',
      image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?w=800&h=600&fit=crop',
      color: 'from-blue-500 to-blue-600',
      fullDescription: 'Our community-driven collection programs bring together individuals and organizations to gather plastic waste that would otherwise pollute our environment. We work with local communities to identify collection points, organize drives, and educate about proper waste segregation.',
      features: [
        'Door-to-door collection services',
        'Community collection points',
        'Partnership with local businesses',
        'Educational awareness programs',
        'Zero-waste event management',
      ],
      process: [
        { step: 1, title: 'Identify', description: 'We identify plastic waste sources in communities' },
        { step: 2, title: 'Collect', description: 'Organize and conduct collection drives' },
        { step: 3, title: 'Sort', description: 'Segregate plastics by type and quality' },
        { step: 4, title: 'Transport', description: 'Deliver to processing facilities' },
      ],
      stats: {
        tons: '500+',
        locations: '50+',
        volunteers: '1000+',
      },
    },
    {
      id: 2,
      icon: BiRecycle,
      title: 'Recycling',
      image: 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=800&h=600&fit=crop',
      color: 'from-emerald-500 to-emerald-600',
      fullDescription: 'Advanced processing and recycling of plastic waste into quality products. Our state-of-the-art recycling facility transforms collected plastic into sustainable, durable products that serve communities while reducing environmental impact.',
      features: [
        'Advanced sorting technology',
        'Quality control systems',
        'Multiple product lines',
        'ISO certified processes',
        'Sustainable manufacturing practices',
      ],
      process: [
        { step: 1, title: 'Intake', description: 'Receive and inspect collected plastics' },
        { step: 2, title: 'Process', description: 'Shred, wash, and prepare materials' },
        { step: 3, title: 'Transform', description: 'Convert into usable plastic pellets' },
        { step: 4, title: 'Produce', description: 'Manufacture finished products' },
      ],
      stats: {
        products: '150+',
        capacity: '50 tons/day',
        efficiency: '95%',
      },
    },
    {
      id: 3,
      icon: MdSchool,
      title: 'Workshops',
      image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=800&h=600&fit=crop',
      color: 'from-amber-500 to-amber-600',
      fullDescription: 'Educational programs and hands-on training in sustainable practices. We conduct comprehensive workshops to build awareness, transfer skills, and empower communities to make environmentally responsible choices.',
      features: [
        'School curricula programs',
        'Community workshops',
        'Vocational training',
        'Corporate training',
        'Certification programs',
      ],
      process: [
        { step: 1, title: 'Plan', description: 'Assess community needs and learning goals' },
        { step: 2, title: 'Design', description: 'Create tailored workshop programs' },
        { step: 3, title: 'Deliver', description: 'Conduct engaging training sessions' },
        { step: 4, title: 'Support', description: 'Provide ongoing mentorship and resources' },
      ],
      stats: {
        trained: '2000+',
        workshops: '150+',
        schools: '50+',
      },
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-emerald-50 max-w-2xl">
            Comprehensive solutions for sustainable plastic management from collection to transformation.
          </p>
        </div>
      </section>

      {/* Services Details */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, idx) => {
              const IconComponent = service.icon;
              return (
                <div key={service.id} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'md:grid-cols-2' : ''}`}>
                  {/* Image - alternating sides */}
                  <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                    <div className="rounded-2xl overflow-hidden h-96 shadow-lg">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={idx % 2 === 1 ? 'md:order-1' : ''}>
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-xl`}>
                        <IconComponent />
                      </div>
                      <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wide">Service</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{service.title}</h2>
                    <p className="text-neutral-600 text-lg mb-6 leading-relaxed">
                      {service.fullDescription}
                    </p>

                    {/* Key Features */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Key Features</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-emerald-600 text-xl mt-1">✓</span>
                            <span className="text-neutral-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Process */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">Our Process</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {service.process.map((proc, i) => (
                          <div key={i} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                            <div className="text-emerald-600 font-bold text-2xl mb-2">{proc.step}</div>
                            <p className="font-semibold text-neutral-900 text-sm mb-1">{proc.title}</p>
                            <p className="text-xs text-neutral-600">{proc.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 pt-8 border-t border-neutral-200 grid grid-cols-3 gap-4">
                      {Object.entries(service.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-2xl font-bold text-emerald-600">{value}</p>
                          <p className="text-xs text-neutral-600 uppercase font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Ready to Partner With Us?</h2>
          <p className="text-neutral-600 text-lg mb-8 max-w-2xl mx-auto">
            Whether you're a business, community, or individual, we have solutions tailored to your needs. Get in touch to learn how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition">
                Get in Touch
              </button>
            </Link>
            <Link href="/shop">
              <button className="px-8 py-3 bg-white hover:bg-emerald-50 text-emerald-600 font-bold rounded-lg border border-emerald-600 transition">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
