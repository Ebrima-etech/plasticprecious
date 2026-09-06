'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FiShoppingCart, FiSearch, FiUser, FiChevronDown, FiTruck, FiCheck, FiHeart } from 'react-icons/fi';
import { GiRecycle } from 'react-icons/gi';
import { BiRecycle } from 'react-icons/bi';
import { MdSchool } from 'react-icons/md';

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselItems, setCarouselItems] = useState([
    { title: 'Premium Recycled Plastic Products', image: 'https://images.unsplash.com/photo-1557804506-669714128632?w=800&h=600&fit=crop' },
    { title: 'Eco-Friendly Packaging Solutions', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop' },
    { title: 'Sustainable Storage Options', image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=600&fit=crop' },
  ]);

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
      {/* Top Promo Bar */}
      <div className="hidden lg:block sticky top-0 z-50 bg-emerald-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-xs text-white overflow-x-auto">
            <div className="flex items-center gap-6 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <GiRecycle className="text-white text-lg" />
                <div>
                  <div className="text-gray-200 text-xs">Eco-Friendly</div>
                  <div className="font-semibold text-white">Premium Products</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiTruck className="text-white text-lg" />
                <div>
                  <div className="text-gray-200 text-xs">Fast</div>
                  <div className="font-semibold text-white">Delivery Available</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="text-white text-lg" />
                <div>
                  <div className="text-gray-200 text-xs">100% Certified</div>
                  <div className="font-semibold text-white">Sustainable</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiHeart className="text-white text-lg" />
                <div>
                  <div className="text-gray-200 text-xs">Supporting</div>
                  <div className="font-semibold text-white">Communities</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <button className="text-white hover:text-gray-200 transition text-xs font-medium">Track Order</button>
              <button className="text-white hover:text-gray-200 transition text-xs font-medium">Support</button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-emerald-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Main Nav Row */}
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-white hover:text-emerald-100 transition">
              PLASTICPRECIOUS
            </Link>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-sm items-center bg-white border-0 px-4 py-2 rounded-full">
              <FiSearch size={16} className="text-emerald-600" />
              <input
                type="text"
                placeholder="Search for products"
                className="bg-transparent text-teal-900 text-sm placeholder-gray-500 placeholder-opacity-50 ml-3 w-full focus:outline-none"
              />
            </div>

            {/* Language Selector */}
            <button className="hidden lg:flex items-center gap-1 text-white hover:text-emerald-300 transition text-sm font-medium ml-auto">
              Eng
              <FiChevronDown size={16} />
            </button>

            {/* Right Navigation & Actions */}
            <div className="flex items-center gap-8">
              <Link href="/auth/login">
                <div className="flex items-center gap-2 text-white hover:text-emerald-300 transition cursor-pointer">
                  <FiUser size={20} />
                  <span className="text-sm font-medium">My Account</span>
                </div>
              </Link>
              <Link href="/cart">
                <div className="flex items-center gap-2 text-white hover:text-emerald-300 transition cursor-pointer relative">
                  <FiShoppingCart size={20} />
                  <span className="text-sm font-medium">Cart</span>
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Categories Row */}
          <div className="hidden items-center gap-8 py-3 border-t border-teal-800">
            <Link href="#" className="text-white hover:text-emerald-300 transition text-sm">
              Collections
            </Link>
            <Link href="#" className="text-white hover:text-emerald-300 transition text-sm">
              Custom Products
            </Link>
            <Link href="#" className="text-white hover:text-emerald-300 transition text-sm">
              Sale
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-emerald-600 py-6 lg:py-8 pb-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            {/* Left Content */}
            <div>
              <p className="text-emerald-100 font-bold mb-2 text-sm uppercase tracking-wider">Trash to Treasure</p>
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
                <button className="bg-white hover:bg-emerald-50 text-emerald-600 font-bold px-10 py-3 transition text-lg rounded-full">
                  Explore Services
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-bold px-10 py-3 transition text-lg bg-transparent rounded-full">
                  Shop Products
                </button>
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
              'https://images.unsplash.com/photo-1557804506-669714128632?w=150&h=80&fit=crop',
              'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150&h=80&fit=crop',
              'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=150&h=80&fit=crop',
              'https://images.unsplash.com/photo-1578500494198-246f612d782b?w=150&h=80&fit=crop',
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&h=80&fit=crop',
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
                'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&h=500&fit=crop',
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop',
                'https://images.unsplash.com/photo-1602143407151-7e536bbee0dd?w=500&h=500&fit=crop',
                'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=500&fit=crop',
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
      <section className="pt-3 md:pt-4 lg:pt-6 pb-12 md:pb-16 lg:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-neutral-900 mb-12 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((item, i) => (
              <div key={i} className="text-center">
                <h3 className="text-2xl font-bold text-emerald-600 mb-3">{item.metric}</h3>
                <p className="text-neutral-700 font-bold text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="pt-3 md:pt-4 lg:pt-6 pb-12 md:pb-16 lg:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-neutral-900 mb-12 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <div key={i} className="text-center">
                  <div className="text-5xl mb-4 flex justify-center text-emerald-600">
                    <IconComponent />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-3">{service.title}</h3>
                  <p className="text-neutral-700 font-bold text-sm leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="pt-3 md:pt-4 lg:pt-6 pb-12 md:pb-16 lg:pb-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-neutral-900 mb-6">Stay Updated</h2>
          <p className="text-neutral-700 font-bold text-sm mb-8">
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
