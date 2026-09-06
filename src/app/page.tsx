'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FiShoppingCart, FiSearch, FiUser, FiChevronDown, FiTruck, FiCheck, FiHeart, FiHeadphones, FiPhone, FiMail } from 'react-icons/fi';
import { GiRecycle } from 'react-icons/gi';
import { BiRecycle } from 'react-icons/bi';
import { MdSchool } from 'react-icons/md';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [carouselItems, setCarouselItems] = useState([
    { title: 'Premium Recycled Plastic Products', image: 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=800&h=600&fit=crop' },
    { title: 'Eco-Friendly Packaging Solutions', image: 'https://images.pexels.com/photos/5830900/pexels-photo-5830900.jpeg?w=800&h=600&fit=crop' },
    { title: 'Sustainable Storage Options', image: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=800&h=600&fit=crop' },
  ]);

  const services = [
    {
      icon: GiRecycle,
      title: 'Collections',
      description: 'Community-driven plastic collection programs to reduce environmental waste.',
      image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?w=500&h=300&fit=crop',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: BiRecycle,
      title: 'Recycling',
      description: 'Advanced processing and recycling of plastic waste into quality products.',
      image: 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=500&h=300&fit=crop',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: MdSchool,
      title: 'Workshops',
      description: 'Educational programs and hands-on training in sustainable practices.',
      image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=500&h=300&fit=crop',
      color: 'from-amber-500 to-amber-600'
    },
  ];

  const impacts = [
    { metric: 'Environmental', description: 'Tons of plastic diverted from oceans and landfills', image: 'https://images.pexels.com/photos/3951628/pexels-photo-3951628.jpeg?w=400&h=400&fit=crop' },
    { metric: 'Economic', description: 'Employment created for marginalized communities', image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=400&h=400&fit=crop' },
    { metric: 'Educational', description: 'Awareness and skills transfer in sustainability', image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=400&h=400&fit=crop' },
    { metric: 'Health', description: 'Healthier communities through reduced pollution', image: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?w=400&h=400&fit=crop' },
  ];

  const products = [
    { name: 'Recycled Storage Bins', price: 'D 850', custom: true, description: 'Durable, eco-friendly storage solution made from 100% recycled plastic.' },
    { name: 'Eco Lunch Container Set', price: 'D 1,200', custom: false, description: 'Sustainable meal prep containers perfect for on-the-go lifestyles.' },
    { name: 'Recycled Water Bottle', price: 'D 750', custom: false, description: 'Lightweight, reusable bottle crafted from recycled plastic materials.' },
    { name: 'Sustainable Organizers', price: 'D 1,050', custom: true, description: 'Stylish organizers for your home, made with sustainable practices.' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes borderGradient {
          0% {
            border-top-color: rgb(16, 185, 129);
          }
          50% {
            border-top-color: rgb(34, 197, 94);
          }
          100% {
            border-top-color: rgb(16, 185, 129);
          }
        }
        .animated-border {
          animation: borderGradient 3s ease-in-out infinite;
        }
      `}</style>
      <Navbar showNavLinks={true} sticky={false} showCategories={true} />

      {/* Hero Section */}
      <section className="bg-emerald-900 py-6 lg:py-8 pb-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                From Pollution to
                <span className="block">
                  <span className="text-emerald-100 italic">Solution</span>
                </span>
              </h1>
              <p className="text-base text-emerald-50 mb-6 font-bold leading-relaxed max-w-lg">
                Transforming plastic waste into valuable, sustainable products <br /> while creating positive change for communities and our environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/services" className="bg-white hover:bg-emerald-50 text-emerald-600 font-bold px-10 py-3 transition text-lg rounded-full inline-block text-center">
                  Explore Services
                </Link>
                <a href="/shop" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold px-10 py-3 transition text-lg bg-transparent rounded-full inline-block text-center">
                  Shop Products
                </a>
              </div>

              {/* Feature Callouts */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-emerald-100 text-xs font-bold uppercase mb-2">CUSTOM PRODUCTS</p>
                  <p className="text-white text-sm font-bold">For large businesses <br /> and complex programs</p>
                </div>
                <div>
                  <p className="text-emerald-100 text-xs font-bold uppercase mb-2">READY PRODUCTS</p>
                  <p className="text-white text-sm font-bold">Customizable, <br /> ready-to-buy options</p>
                </div>
              </div>
            </div>

            {/* Right Product Carousel */}
            <div className="relative flex flex-col items-center w-full">
              <div className="relative w-full">
                {/* Main Carousel Container */}
                <div className="rounded-2xl h-[70vh] flex flex-col items-center justify-center overflow-hidden relative">
                  {carouselItems[carouselIndex].image && (
                    <img
                      src={carouselItems[carouselIndex].image}
                      alt={carouselItems[carouselIndex].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Left Arrow */}
                <button
                  onClick={() => setCarouselIndex((carouselIndex - 1 + carouselItems.length) % carouselItems.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-neutral-200 text-teal-950 w-10 h-10 flex items-center justify-center rounded-full transition group">
                  <span className="text-xl group-hover:text-emerald-600">‹</span>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => setCarouselIndex((carouselIndex + 1) % carouselItems.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-neutral-200 text-teal-950 w-10 h-10 flex items-center justify-center rounded-full transition group">
                  <span className="text-xl group-hover:text-emerald-600">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="pt-0 pb-3 md:pb-4 lg:pb-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=150&h=80&fit=crop',
              'https://images.pexels.com/photos/5830900/pexels-photo-5830900.jpeg?w=150&h=80&fit=crop',
              'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=150&h=80&fit=crop',
              'https://images.pexels.com/photos/6474056/pexels-photo-6474056.jpeg?w=150&h=80&fit=crop',
              'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=150&h=80&fit=crop',
            ].map((logo, i) => (
              <div key={i} className="flex items-center justify-center h-20 w-32 grayscale opacity-60 hover:opacity-100 transition">
                <img src={logo} alt={`Partner ${i + 1}`} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="pt-3 md:pt-4 lg:pt-6 pb-12 md:pb-16 lg:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-neutral-900 mb-12 text-center">Featured Collections</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => {
              const dummyImages = [
                'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=500&h=500&fit=crop',
                'https://images.pexels.com/photos/5830900/pexels-photo-5830900.jpeg?w=500&h=500&fit=crop',
                'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=500&h=500&fit=crop',
                'https://images.pexels.com/photos/6474056/pexels-photo-6474056.jpeg?w=500&h=500&fit=crop',
              ];
              return (
                <div key={i} className="group cursor-pointer">
                  <div className="h-64 rounded-2xl overflow-hidden mb-4 group-hover:opacity-80 transition">
                    <img src={dummyImages[i]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-neutral-600 mb-3">{product.description}</p>
                  {product.custom && <p className="text-xs text-emerald-600 font-bold">CUSTOMIZABLE</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="pt-3 md:pt-4 lg:pt-6 pb-12 md:pb-16 lg:pb-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-3">Our Impact</h2>
            <p className="text-neutral-600 font-medium">Measurable change across communities and the environment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((item, i) => (
              <Link key={i} href="/impact" className="group cursor-pointer h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col border border-emerald-100 hover:border-emerald-300">
                  {/* Image Section */}
                  <div className="relative h-40 overflow-hidden bg-gray-200">
                    {item.image && (
                      <img src={item.image} alt={item.metric} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 text-white text-lg font-bold">
                      {i + 1}
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-emerald-600 transition">{item.metric}</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed flex-grow">{item.description}</p>
                    <div className="mt-4 inline-flex items-center text-emerald-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="group-hover:translate-x-1 transition">→</span>
                    </div>
                  </div>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="pt-3 md:pt-4 lg:pt-6 pb-12 md:pb-16 lg:pb-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-3">Our Services</h2>
            <p className="text-neutral-600 font-medium">Comprehensive solutions for sustainable plastic management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <Link key={i} href="/services-detail" className="group cursor-pointer h-full">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                    {/* Image Section */}
                    <div className="relative h-40 overflow-hidden bg-gray-200">
                      {service.image && (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      )}
                      <div className={`absolute inset-0 bg-gradient-to-b ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 text-white text-2xl`}>
                        <IconComponent size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-emerald-600 transition">{service.title}</h3>
                      <p className="text-neutral-700 text-sm leading-relaxed flex-grow">{service.description}</p>
                      <div className="mt-4 inline-flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                        <span>Learn more</span>
                        <span className="group-hover:translate-x-1 transition">→</span>
                      </div>
                    </div>
                  </div>
                </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="mb-2 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white text-sm font-semibold">✉️ Newsletter</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-emerald-50 text-lg mb-8 max-w-lg mx-auto">
            Be the first to know about new collections, exclusive offers, and sustainable practices from our community.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/95 border-0 text-neutral-900 text-sm font-light placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white rounded-lg"
              required
            />
            <Button
              type="submit"
              isLoading={subscribed}
              className="px-8 bg-white hover:bg-emerald-50 text-emerald-600 font-bold rounded-lg transition whitespace-nowrap shadow-lg hover:shadow-xl"
            >
              {subscribed ? '✓ Subscribed!' : 'Subscribe'}
            </Button>
          </form>

          <p className="text-emerald-50 text-xs">We respect your privacy. Unsubscribe anytime.</p>

          {/* Social Proof */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-white text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <span>Join 5,000+ subscribers</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📦</span>
              <span>Weekly updates & offers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-10 lg:pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div>
              <h5 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide">Shop</h5>
              <ul className="text-sm space-y-2 text-neutral-700 font-bold">
                <li><Link href="#" className="hover:text-emerald-600 transition">All Products</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition">Custom Products</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition">Collections</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide">Services</h5>
              <ul className="text-sm space-y-2 text-neutral-700 font-bold">
                <li><Link href="#services" className="hover:text-emerald-600 transition">Collections</Link></li>
                <li><Link href="#services" className="hover:text-emerald-600 transition">Recycling</Link></li>
                <li><Link href="#services" className="hover:text-emerald-600 transition">Workshops</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide">Company</h5>
              <ul className="text-sm space-y-2 text-neutral-700 font-bold">
                <li><a href="#" className="hover:text-emerald-600 transition">About</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Partnerships</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-neutral-900 mb-4 text-sm uppercase tracking-wide">Connect</h5>
              <ul className="text-sm space-y-2 text-neutral-700 font-bold">
                <li><Link href="/contact" className="hover:text-emerald-600 transition">Contact</Link></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-6 text-center text-xs text-neutral-600 font-bold">
            <p>&copy; 2026 Plasticprecious. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
