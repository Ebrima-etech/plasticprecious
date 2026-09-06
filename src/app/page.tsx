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
      {/* Top Promo Bar */}
      <div className="sticky top-0 z-50 bg-slate-950 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-1 text-xs text-white overflow-x-auto">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div className="flex items-center gap-2 bg-emerald-900 bg-opacity-60 px-2 py-1">
                <GiRecycle className="text-emerald-300 text-lg" />
                <div>
                  <div className="text-emerald-200 text-xs">Eco-Friendly</div>
                  <div className="font-semibold text-emerald-100">Premium Products</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-900 bg-opacity-60 rounded-lg px-2 py-1">
                <FiTruck className="text-blue-300 text-lg" />
                <div>
                  <div className="text-blue-200 text-xs">Fast & Free</div>
                  <div className="font-semibold text-blue-100">Delivery Available</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-purple-900 bg-opacity-60 rounded-lg px-2 py-1">
                <FiCheck className="text-purple-300 text-lg" />
                <div>
                  <div className="text-purple-200 text-xs">100% Certified</div>
                  <div className="font-semibold text-purple-100">Sustainable</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-red-900 bg-opacity-60 rounded-lg px-2 py-1">
                <FiHeart className="text-red-300 text-lg" />
                <div>
                  <div className="text-red-200 text-xs">Supporting</div>
                  <div className="font-semibold text-red-100">Communities</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <button className="text-emerald-300 hover:text-emerald-200 transition text-xs font-medium">Track Order</button>
              <button className="text-emerald-300 hover:text-emerald-200 transition text-xs font-medium">Support</button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-teal-950 border-b border-teal-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Main Nav Row */}
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-emerald-300 hover:text-emerald-200 transition">
              PLASTICPRECIOUS
            </Link>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl items-center bg-white border-0 px-6 py-3 rounded-full">
              <FiSearch size={18} className="text-teal-900" />
              <input
                type="text"
                placeholder="Search for products"
                className="bg-transparent text-teal-900 text-sm placeholder-emerald-600 ml-3 w-full focus:outline-none"
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
          <div className="hidden lg:flex items-center gap-8 py-3 border-t border-teal-800">
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
      <section className="bg-white py-6 lg:py-8 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            {/* Left Content */}
            <div>
              <p className="text-emerald-600 font-light mb-2 text-sm uppercase tracking-wider">Trash to Treasure</p>
              <h1 className="text-5xl lg:text-6xl font-bold text-teal-950 mb-4 leading-tight">
                From Pollution to
                <span className="block">
                  <span className="text-emerald-600 italic">Solution</span>
                </span>
              </h1>
              <p className="text-base text-neutral-700 mb-6 font-light leading-relaxed max-w-lg">
                Transforming plastic waste into valuable, sustainable products while <br /> creating positive change for communities and our environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button className="bg-teal-950 hover:bg-teal-900 text-white font-bold px-10 py-3 transition text-lg rounded-full">
                  Explore Services
                </button>
                <button className="border-2 border-teal-950 text-teal-950 hover:bg-teal-950 hover:text-white font-bold px-10 py-3 transition text-lg bg-transparent rounded-full">
                  Shop Products
                </button>
              </div>

              {/* Feature Callouts */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-emerald-600 text-xs font-bold uppercase mb-2">CUSTOM PRODUCTS</p>
                  <p className="text-teal-950 text-sm font-light">For large businesses <br /> and complex programs</p>
                </div>
                <div>
                  <p className="text-emerald-600 text-xs font-bold uppercase mb-2">READY PRODUCTS</p>
                  <p className="text-teal-950 text-sm font-light">Customizable, <br /> ready-to-buy options</p>
                </div>
              </div>
            </div>

            {/* Right Product Carousel */}
            <div className="relative flex flex-col items-center w-full">
              <div className="relative w-11/12 lg:w-full">
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

      {/* Impact Section */}
      <section className="py-6 md:py-8 lg:py-10 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-light text-neutral-900 mb-12 text-center">Our Impact</h2>
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
