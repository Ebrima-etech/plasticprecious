'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FiShoppingCart, FiSearch, FiUser, FiChevronDown } from 'react-icons/fi';
import { GiRecycle } from 'react-icons/gi';
import { BiRecycle } from 'react-icons/bi';
import { MdSchool } from 'react-icons/md';

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselItems = [
    { title: 'Premium Recycled Plastic Products', icon: '📦' },
    { title: 'Eco-Friendly Packaging Solutions', icon: '📦' },
    { title: 'Sustainable Storage Options', icon: '📦' },
  ];

  const services = [
    {
      icon: GiRecycle,
      title: 'Collections',
      description: 'Community-driven plastic collection programs to reduce environmental waste.',
    },
    {
      icon: BiRecycle,
      title: 'Recycling',
      description: 'Advanced processing and recycling of plastic waste into quality products.',
    },
    {
      icon: MdSchool,
      title: 'Workshops',
      description: 'Educational programs and hands-on training in sustainable practices.',
    },
  ];

  const impacts = [
    { metric: 'Environmental', description: 'Tons of plastic diverted from oceans and landfills' },
    { metric: 'Economic', description: 'Employment created for marginalized communities' },
    { metric: 'Educational', description: 'Awareness and skills transfer in sustainability' },
    { metric: 'Health', description: 'Healthier communities through reduced pollution' },
  ];

  const products = [
    { name: 'Recycled Storage Bins', price: 'D 850', custom: true },
    { name: 'Eco Lunch Container Set', price: 'D 1,200', custom: false },
    { name: 'Recycled Water Bottle', price: 'D 750', custom: false },
    { name: 'Sustainable Organizers', price: 'D 1,050', custom: true },
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-teal-950 border-b border-teal-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-sm font-bold text-white hover:text-emerald-300 transition">
              PLASTICPRECIOUS
            </Link>

            {/* Search Bar - Center */}
            <div className="hidden lg:flex items-center bg-teal-900/50 border border-teal-800 rounded-full px-4 py-2 w-80 mx-8">
              <FiSearch size={18} className="text-teal-400" />
              <input
                type="text"
                placeholder="Search for products"
                className="bg-transparent text-white text-sm placeholder-teal-400 ml-3 w-full focus:outline-none"
              />
            </div>

            {/* Right Navigation & Actions */}
            <div className="flex items-center gap-8">
              <Link href="#services" className="hidden md:block text-sm font-semibold text-white hover:text-emerald-300 transition">
                BROWSE PRODUCTS
              </Link>
              <Button size="sm" className="bg-white hover:bg-neutral-100 text-teal-950 font-semibold text-xs px-6">
                TALK FIRST
              </Button>
              <Link href="/auth/login">
                <button className="text-white hover:text-emerald-300 transition">
                  <FiUser size={20} />
                </button>
              </Link>
              <Link href="/cart">
                <button className="text-white hover:text-emerald-300 transition relative">
                  <FiShoppingCart size={20} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-teal-950 py-24 lg:py-32 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="text-emerald-300 font-light mb-4 text-sm uppercase tracking-wider">Trash to Treasure</p>
              <h1 className="text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
                From Pollution to
                <span className="block">
                  <span className="text-emerald-300 italic">Solution</span>
                </span>
              </h1>
              <p className="text-lg text-neutral-300 mb-10 font-light leading-relaxed max-w-lg">
                Transforming plastic waste into valuable, sustainable products while creating positive change for communities and our environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="bg-white hover:bg-neutral-100 text-teal-950 font-bold px-10 rounded-full">
                  Explore Services
                </Button>
                <Button size="lg" variant="ghost" className="border-2 border-white text-white hover:bg-white hover:text-teal-950 font-bold px-10 rounded-full">
                  Shop Products
                </Button>
              </div>

              {/* Feature Callouts */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-emerald-300 text-xs font-bold uppercase mb-2">CUSTOM PRODUCTS</p>
                  <p className="text-white text-sm font-light">For large businesses and complex programs</p>
                </div>
                <div>
                  <p className="text-emerald-300 text-xs font-bold uppercase mb-2">READY PRODUCTS</p>
                  <p className="text-white text-sm font-light">Customizable, ready-to-buy options</p>
                </div>
              </div>
            </div>

            {/* Right Product Carousel */}
            <div className="relative flex flex-col items-center">
              <div className="relative w-full max-w-md">
                {/* Main Carousel Container */}
                <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-3xl p-20 h-80 flex flex-col items-center justify-center border border-teal-700/50">
                  <div className="text-8xl mb-6">{carouselItems[carouselIndex].icon}</div>
                  <p className="text-white text-2xl font-light text-center">{carouselItems[carouselIndex].title}</p>
                </div>

                {/* Left Arrow */}
                <button
                  onClick={() => setCarouselIndex((carouselIndex - 1 + carouselItems.length) % carouselItems.length)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 bg-teal-900/60 hover:bg-teal-900 text-white p-4 rounded-full transition group">
                  <span className="text-2xl group-hover:text-emerald-300">‹</span>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => setCarouselIndex((carouselIndex + 1) % carouselItems.length)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 bg-teal-900/60 hover:bg-teal-900 text-white p-4 rounded-full transition group">
                  <span className="text-2xl group-hover:text-emerald-300">›</span>
                </button>
              </div>

              {/* Carousel Dots */}
              <div className="flex justify-center gap-3 mt-12">
                {carouselItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className={`w-4 h-4 rounded-full transition ${
                      i === carouselIndex ? 'bg-emerald-400' : 'bg-teal-700 hover:bg-teal-600'
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-28 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-light text-neutral-900 mb-20 text-center">Featured Collections</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {products.map((product, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-neutral-100 h-56 rounded-lg flex items-center justify-center mb-6 group-hover:bg-neutral-200 transition">
                  <div className="text-neutral-400 text-sm font-light">Product Image</div>
                </div>
                <h3 className="text-sm font-medium text-neutral-900 mb-2">{product.name}</h3>
                <p className="text-neutral-600 text-sm mb-4 font-light">{product.price}</p>
                {product.custom && <p className="text-xs text-emerald-600 mb-3 font-medium">CUSTOMIZABLE</p>}
                <Button variant="ghost" size="sm" className="w-full border border-neutral-300 hover:border-neutral-900 text-neutral-900">
                  View
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="#services">
              <Button variant="ghost" size="base" className="border border-neutral-300 hover:border-neutral-900 text-neutral-900">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-28 lg:py-32 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-light text-neutral-900 mb-20 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {services.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <div key={i} className="text-center">
                  <div className="text-5xl mb-6 flex justify-center text-emerald-600">
                    <IconComponent />
                  </div>
                  <h3 className="text-xl font-light text-neutral-900 mb-4">{service.title}</h3>
                  <p className="text-neutral-700 font-light leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-light text-neutral-900 mb-20 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impacts.map((item, i) => (
              <div key={i} className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 text-center hover:border-emerald-500 transition">
                <h3 className="text-2xl font-light text-emerald-600 mb-4">{item.metric}</h3>
                <p className="text-neutral-700 font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 md:py-28 lg:py-32 bg-neutral-50">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-neutral-900 mb-8">Stay Updated</h2>
          <p className="text-neutral-700 font-light mb-10 text-lg">
            Get updates on new collections and exclusive offers.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-white border border-neutral-300 text-neutral-900 text-sm font-light placeholder-neutral-400 focus:outline-none focus:border-emerald-600 rounded"
              required
            />
            <Button type="submit" isLoading={subscribed} className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white">
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </form>
          <p className="text-xs text-neutral-500">We respect your privacy.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div>
              <h5 className="font-light text-neutral-900 mb-6 text-sm tracking-wide">Shop</h5>
              <ul className="text-sm space-y-3 text-neutral-700 font-light">
                <li><Link href="#" className="hover:text-emerald-600 transition">All Products</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition">Custom Products</Link></li>
                <li><Link href="#" className="hover:text-emerald-600 transition">Collections</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-light text-neutral-900 mb-6 text-sm tracking-wide">Services</h5>
              <ul className="text-sm space-y-3 text-neutral-700 font-light">
                <li><Link href="#services" className="hover:text-emerald-600 transition">Collections</Link></li>
                <li><Link href="#services" className="hover:text-emerald-600 transition">Recycling</Link></li>
                <li><Link href="#services" className="hover:text-emerald-600 transition">Workshops</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-light text-neutral-900 mb-6 text-sm tracking-wide">Company</h5>
              <ul className="text-sm space-y-3 text-neutral-700 font-light">
                <li><a href="#" className="hover:text-emerald-600 transition">About</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Partnerships</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-light text-neutral-900 mb-6 text-sm tracking-wide">Connect</h5>
              <ul className="text-sm space-y-3 text-neutral-700 font-light">
                <li><Link href="/contact" className="hover:text-emerald-600 transition">Contact</Link></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-12 text-center text-sm text-neutral-500 font-light">
            <p>&copy; 2026 Plasticprecious. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
