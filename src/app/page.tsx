'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { FiShoppingCart, FiSearch, FiUser, FiChevronDown, FiTruck, FiCheck, FiHeart, FiHeadphones, FiPhone, FiMail, FiPackage, FiTag } from 'react-icons/fi';
import { GiRecycle } from 'react-icons/gi';
import { BiRecycle } from 'react-icons/bi';
import { MdSchool } from 'react-icons/md';
import Navbar from '@/components/Navbar';
import { ProductGridSkeleton } from '@/components/ShimmerSkeleton';
import { API_BASE_URL } from '@/config/api';

interface Product {
  id: number;
  name: string;
  price: string;
  description?: string;
  image?: string;
  category_name?: string;
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productCarouselIndex, setProductCarouselIndex] = useState(0);
  const [badgeIndex, setBadgeIndex] = useState(0);

  const badgeItems = [
    '🌱 RECYCLED & SUSTAINABLE',
    '♻️ TRASH TO TREASURE'
  ];
  const [carouselItems, setCarouselItems] = useState([
    { title: 'Plastic Waste Recycling & Processing', image: 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=800&h=600&fit=crop' },
    { title: 'Transforming Plastic into Quality Products', image: 'https://images.pexels.com/photos/8723319/pexels-photo-8723319.jpeg?w=800&h=600&fit=crop' },
    { title: 'Sustainable Recycled Plastic Solutions', image: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=800&h=600&fit=crop' },
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
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/`);
        const fetchedProducts = response.data.results || response.data || [];
        const productsToDisplay = fetchedProducts.slice(0, 4);

        // Debug: Log product data to check image field
        console.log('Fetched products:', productsToDisplay);
        productsToDisplay.forEach((p: Product, idx: number) => {
          console.log(`Product ${idx}:`, {
            name: p.name,
            image: p.image,
            hasImage: !!p.image
          });
        });

        setProducts(productsToDisplay);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeIndex((prev) => (prev + 1) % badgeItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [badgeItems.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animated-border {
          animation: borderGradient 3s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s ease-out forwards;
        }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .grid-pattern {
          background-image:
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 0 0;
        }
        @keyframes badgeDisappear {
          0% { opacity: 1; }
          1% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes badgeSlideUp {
          0% { transform: translateY(20px); }
          15% { transform: translateY(0); }
          85% { transform: translateY(0); }
          100% { transform: translateY(0); }
        }
        .badge-current {
          animation: badgeDisappear 6s ease-in-out;
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
          background-color: rgb(209, 250, 229);
          color: rgb(5, 122, 85);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .badge-next {
          animation: badgeSlideUp 6s ease-in-out;
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
          background-color: rgb(209, 250, 229);
          color: rgb(5, 122, 85);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .badge-container {
          position: relative;
          display: inline-block;
          height: 2.4em;
          overflow: visible;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-animate-text {
          background: linear-gradient(90deg, #10b981, #14b8a6, #10b981);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        /* Unique Design System */
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 100%; }
        }
        .unique-heading {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.1;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .unique-subheading {
          font-size: clamp(1.25rem, 3vw, 1.875rem);
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 1.4;
        }
        .unique-card {
          border: 2px solid rgba(16, 185, 129, 0.2);
          border-radius: 1.5rem;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
          position: relative;
          overflow: hidden;
          background: white;
        }
        .unique-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
        }
        .unique-card:hover {
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.1);
          transform: translateY(-4px);
        }
        .unique-button {
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          text-transform: uppercase;
          font-size: 0.875rem;
        }
        .unique-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          transition: left 0.3s ease;
        }
        .unique-button:hover::before {
          left: 100%;
        }
        .accent-line {
          position: relative;
          display: inline-block;
        }
        .accent-line::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          height: 4px;
          width: 100%;
          background: linear-gradient(90deg, #10b981, #14b8a6);
          border-radius: 2px;
          animation: expandWidth 0.8s ease-out forwards;
        }
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent);
          margin: 4rem 0;
        }
        @keyframes pulse-color {
          0%, 100% { color: #1f2937; }
          50% { color: #10b981; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .bestseller-heading {
          display: inline-block;
          background: linear-gradient(135deg, #ea580c 0%, #d97706 50%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: bounce-subtle 2s ease-in-out infinite;
          font-size: clamp(2.5rem, 8vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.1;
          position: relative;
        }
        .bestseller-heading::after {
          content: '⭐';
          position: absolute;
          right: -2rem;
          top: 0;
          font-size: 0.6em;
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <Navbar showNavLinks={true} sticky={false} showCategories={true} />

      {/* Hero Section */}
      <section className="bg-white py-6 lg:py-8 flex items-center relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="w-full">
              <div className="badge-container mb-6 animate-fade-in-up">
                <div key={`current-${badgeIndex}`} className="badge-current">
                  {badgeItems[badgeIndex]}
                </div>
                <div key={`next-${(badgeIndex + 1) % badgeItems.length}`} className="badge-next">
                  {badgeItems[(badgeIndex + 1) % badgeItems.length]}
                </div>
              </div>

              <h1 className="unique-heading text-slate-900 mb-6 animate-fade-in-up animation-delay-100">
                From <span className="accent-line text-emerald-700">Pollution</span> to <span className="gradient-animate-text">Solution</span>
              </h1>
              <p className="unique-subheading text-slate-700 mb-8 max-w-xl animate-fade-in-up animation-delay-200">
                Transforming plastic waste into valuable, sustainable products while creating positive change for communities and our environment.
              </p>

              {/* Mobile Carousel - Above Buttons */}
              <div className="lg:hidden mb-8 relative flex flex-col items-center w-screen animate-fade-in-up animation-delay-300 -mx-6">
                <div className="relative w-full">
                  <div className="h-[50vh] flex flex-col items-center justify-center overflow-hidden relative">
                    {carouselItems[carouselIndex].image && (
                      <img
                        src={carouselItems[carouselIndex].image}
                        alt={carouselItems[carouselIndex].title}
                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    )}

                    {/* Carousel Controls - Inside Overlay */}
                    <div className="absolute inset-0 flex items-center justify-between px-6 z-20">
                      <button
                        onClick={() => setCarouselIndex((carouselIndex - 1 + carouselItems.length) % carouselItems.length)}
                        className="w-14 h-14 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-110 font-bold text-3xl shadow-lg hover:shadow-xl backdrop-blur-sm">
                        ‹
                      </button>
                      <button
                        onClick={() => setCarouselIndex((carouselIndex + 1) % carouselItems.length)}
                        className="w-14 h-14 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-110 font-bold text-3xl shadow-lg hover:shadow-xl backdrop-blur-sm">
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up animation-delay-300">
                <Link href="/services" className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 text-center text-base shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-105">
                  Work With Us
                  <span className="block text-xs font-semibold text-emerald-50 mt-0.5">Custom quoting for large businesses</span>
                </Link>
                <a href="/shop" className="group relative border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold px-6 py-3 rounded-lg transition-all duration-300 text-center text-base">
                  Shop Now
                  <span className="block text-xs font-semibold text-emerald-700 mt-0.5">Ready-to-buy products</span>
                </a>
              </div>
            </div>

            {/* Desktop - Hero Image/Carousel */}
            <div className="hidden lg:flex relative flex-col items-center w-full animate-fade-in-up animation-delay-300">
              <div className="relative w-full">
                <div className="rounded-2xl h-[75vh] flex flex-col items-center justify-center overflow-hidden relative shadow-2xl">
                  {carouselItems[carouselIndex].image && (
                    <img
                      src={carouselItems[carouselIndex].image}
                      alt={carouselItems[carouselIndex].title}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  )}

                  {/* Carousel Controls - Inside Overlay */}
                  <div className="absolute inset-0 flex items-center justify-between px-6 z-20">
                    <button
                      onClick={() => setCarouselIndex((carouselIndex - 1 + carouselItems.length) % carouselItems.length)}
                      className="w-14 h-14 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-110 font-bold text-3xl shadow-lg hover:shadow-xl backdrop-blur-sm">
                      ‹
                    </button>
                    <button
                      onClick={() => setCarouselIndex((carouselIndex + 1) % carouselItems.length)}
                      className="w-14 h-14 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center transition-all duration-300 hover:scale-110 font-bold text-3xl shadow-lg hover:shadow-xl backdrop-blur-sm">
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8 relative z-10">
          <div className="mb-16 animate-fade-in-up px-6 md:px-0">
            <h2 className="bestseller-heading mb-4">Best sellers</h2>
          </div>

          <div className="relative">
            {/* Product Grid */}
            {productsLoading ? (
              <div className="px-3 lg:px-0">
                <ProductGridSkeleton columns={4} />
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-3 lg:px-0">
                {products.length > 0 ? (
              products.map((product, i) => {
                const dummyImages = [
                  'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=500&h=500&fit=crop',
                  'https://images.pexels.com/photos/5830900/pexels-photo-5830900.jpeg?w=500&h=500&fit=crop',
                  'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=500&h=500&fit=crop',
                  'https://images.pexels.com/photos/6474056/pexels-photo-6474056.jpeg?w=500&h=500&fit=crop',
                ];
                return (
                  <Link key={product.id} href={`/shop/${product.id}`} className="no-underline hover:no-underline">
                    <div className="w-full">
                      <div className={`cursor-pointer h-full bg-white flex flex-col rounded-xl transition-all duration-300 overflow-hidden group border border-slate-200 hover:border-emerald-400`}>
                        <div className="relative h-[28rem] lg:h-72 overflow-hidden bg-slate-200">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                console.warn(`Image failed to load for product ${product.id}:`, product.image);
                                (e.target as HTMLImageElement).src = dummyImages[i % dummyImages.length];
                              }}
                            />
                          ) : (
                            <img
                              src={dummyImages[i % dummyImages.length]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                        </div>
                        <div className="flex flex-col flex-grow p-4 lg:p-6">
                          <h3 className="text-xl lg:text-xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition">{product.name}</h3>
                          <p className="text-base lg:text-sm text-slate-600 line-clamp-2 flex-grow mb-4">{product.description || 'Premium recycled plastic product'}</p>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-4xl lg:text-2xl font-black text-slate-900">D {parseFloat(product.price).toLocaleString('en-GM')}</span>
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 lg:px-4 py-2 rounded-lg transition text-xs lg:text-sm">
                              QUICK VIEW
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
                ) : (
                  <div className="text-center py-12 w-full">
                    <p className="text-slate-600">Loading products...</p>
                  </div>
                )}
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Impact Section - Bento Grid */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden" style={{
        backgroundImage: 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="mb-16 animate-fade-in-up">
            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              📊 OUR IMPACT
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">Measurable Change<br />Across Communities</h2>
            <p className="text-xl text-slate-600 max-w-2xl">Real results from sustainable practices and community-driven initiatives</p>
          </div>

          {/* Pill-shaped Grid - GetLab Inspired */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((item, i) => (
              <Link key={i} href="/impact" className={`group cursor-pointer animate-fade-in-up animation-delay-${i * 100}`}>
                <div className="unique-card relative rounded-2xl overflow-hidden flex flex-col h-full">
                  {/* Icon Badge - Pill Style */}
                  <div className="px-6 pt-6 pb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-black flex items-center justify-center text-2xl">
                      {i + 1}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col flex-grow px-6 pb-6">
                    <h3 className="font-black text-slate-900 text-2xl leading-tight mb-3 group-hover:text-emerald-600 transition">{item.metric}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed flex-grow mb-4">{item.description}</p>

                    {/* Minimal CTA */}
                    <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <span>Learn more</span>
                      <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Bento Grid */}
      <section id="services" className="py-16 lg:py-24 bg-white relative overflow-hidden" style={{
        backgroundImage: 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="mb-16 animate-fade-in-up">
            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              🔧 SERVICES
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">Complete Solutions<br />For Plastic Management</h2>
            <p className="text-xl text-slate-600 max-w-2xl">From collection to recycling to education - we handle it all</p>
          </div>

          {/* Pill-shaped Grid - GetLab Inspired */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const IconComponent = service.icon;
              return (
                <Link key={i} href="/services-detail" className={`group cursor-pointer animate-fade-in-up animation-delay-${i * 100}`}>
                  <div className="unique-card relative rounded-2xl overflow-hidden flex flex-col h-full">
                    {/* Icon Badge - Pill Style */}
                    <div className="px-6 pt-6 pb-3">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${service.color} text-white font-black flex items-center justify-center text-3xl`}>
                        <IconComponent size={32} />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-grow px-6 pb-6">
                      <h3 className="font-black text-slate-900 text-2xl leading-tight mb-3 group-hover:text-emerald-600 transition">{service.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed flex-grow mb-4">{service.description}</p>

                      {/* Minimal CTA */}
                      <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <span>Explore</span>
                        <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-emerald-50 relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              🤝 TRUSTED PARTNERS
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight">Trusted By Leading Brands</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Join hundreds of companies making a difference with sustainable plastic solutions</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {[
              'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=150&h=80&fit=crop',
              'https://images.pexels.com/photos/5830900/pexels-photo-5830900.jpeg?w=150&h=80&fit=crop',
              'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=150&h=80&fit=crop',
              'https://images.pexels.com/photos/6474056/pexels-photo-6474056.jpeg?w=150&h=80&fit=crop',
              'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=150&h=80&fit=crop',
            ].map((logo, i) => (
              <div key={i} className="flex items-center justify-center h-24 w-40 group hover:scale-110 transition-transform duration-300">
                <img src={logo} alt={`Partner ${i + 1}`} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-600 font-semibold text-lg mb-6">Join Our Growing Community</p>
            <Link href="/contact" className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/30">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">SHOP</h5>
              <ul className="text-sm space-y-3 text-white">
                <li><Link href="#" className="text-white hover:text-emerald-400 transition font-semibold">All Products</Link></li>
                <li><Link href="#" className="text-white hover:text-emerald-400 transition font-semibold">Custom Orders</Link></li>
                <li><Link href="#" className="text-white hover:text-emerald-400 transition font-semibold">Collections</Link></li>
                <li><Link href="#" className="text-white hover:text-emerald-400 transition font-semibold">Bulk Discounts</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">SERVICES</h5>
              <ul className="text-sm space-y-3 text-white">
                <li><Link href="#services" className="text-white hover:text-emerald-400 transition font-semibold">Recycling Programs</Link></li>
                <li><Link href="#services" className="text-white hover:text-emerald-400 transition font-semibold">Workshops</Link></li>
                <li><Link href="#services" className="text-white hover:text-emerald-400 transition font-semibold">Consulting</Link></li>
                <li><Link href="#services" className="text-white hover:text-emerald-400 transition font-semibold">Custom Solutions</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">COMPANY</h5>
              <ul className="text-sm space-y-3 text-white">
                <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">About Us</a></li>
                <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">Blog & News</a></li>
                <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">Impact Report</a></li>
                <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">CONNECT</h5>
              <ul className="text-sm space-y-3 text-white">
                <li><Link href="/contact" className="text-white hover:text-emerald-400 transition font-semibold">Contact Us</Link></li>
                <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">Privacy Policy</a></li>
                <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">Terms of Service</a></li>
                <li><a href="#" className="text-white hover:text-emerald-400 transition font-semibold">Sustainability</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-white text-sm mb-4 font-semibold">&copy; 2026 Plastic Precious. All rights reserved.</p>
            <p className="text-white text-xs">Made with 🌱 for a better planet • Building sustainable solutions together</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
