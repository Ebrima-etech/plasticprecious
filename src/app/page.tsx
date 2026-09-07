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
  const [productCarouselIndex, setProductCarouselIndex] = useState(0);
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
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 0 0;
        }
      `}</style>
      <Navbar showNavLinks={true} sticky={false} showCategories={true} />

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center py-3 px-6">
        <p className="text-sm lg:text-base font-bold">🌍 SUSTAINABILITY SALE: Get 20% off eco-friendly collections this week</p>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-12 lg:py-16 flex items-center relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="w-full">
              <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-fade-in-up">
                🌱 RECYCLED & SUSTAINABLE
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 leading-tight animate-fade-in-up animation-delay-100 tracking-tight">
                Transform <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Plastic Waste</span> Into Premium Products
              </h1>
              <p className="text-xl text-slate-700 mb-8 max-w-xl animate-fade-in-up animation-delay-200 leading-relaxed font-semibold">
                Eco-friendly products designed to match your brand, your business, and your budget without compromise.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up animation-delay-300">
                <Link href="/services" className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 text-center text-lg shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-105">
                  Work With Us
                  <span className="block text-sm font-semibold text-emerald-50 mt-1">Custom quoting for large businesses</span>
                </Link>
                <a href="/shop" className="group relative border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-4 rounded-lg transition-all duration-300 text-center text-lg">
                  Shop Now
                  <span className="block text-sm font-semibold text-emerald-700 mt-1">Ready-to-buy products</span>
                </a>
              </div>
            </div>

            {/* Right - Hero Image/Carousel */}
            <div className="hidden lg:flex relative flex-col items-center w-full animate-fade-in-up animation-delay-300">
              <div className="relative w-full">
                <div className="rounded-2xl h-[60vh] flex flex-col items-center justify-center overflow-hidden relative shadow-2xl">
                  {carouselItems[carouselIndex].image && (
                    <img
                      src={carouselItems[carouselIndex].image}
                      alt={carouselItems[carouselIndex].title}
                      className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>

                {/* Carousel Controls */}
                <div className="flex gap-3 mt-6 justify-center">
                  <button
                    onClick={() => setCarouselIndex((carouselIndex - 1 + carouselItems.length) % carouselItems.length)}
                    className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 font-bold text-lg shadow-lg">
                    ‹
                  </button>
                  <button
                    onClick={() => setCarouselIndex((carouselIndex + 1) % carouselItems.length)}
                    className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 font-bold text-lg shadow-lg">
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="mb-16 animate-fade-in-up">
            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
              🏆 BESTSELLERS
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">All Your Eco Needs,<br />In One Place</h2>
            <p className="text-xl text-slate-600 max-w-2xl">Premium recycled plastic products handpicked for quality and sustainability</p>
          </div>

          <div className="relative">
            {/* Product Carousel */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-6 pb-4" style={{ width: 'fit-content', minWidth: '100%' }}>
                {products.length > 0 ? (
              products.map((product, i) => {
                const dummyImages = [
                  'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?w=500&h=500&fit=crop',
                  'https://images.pexels.com/photos/5830900/pexels-photo-5830900.jpeg?w=500&h=500&fit=crop',
                  'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?w=500&h=500&fit=crop',
                  'https://images.pexels.com/photos/6474056/pexels-photo-6474056.jpeg?w=500&h=500&fit=crop',
                ];
                return (
                  <Link key={product.id} href={`/shop/${product.id}`}>
                    <div className="min-w-full md:min-w-1/2 lg:min-w-1/3">
                      <div className={`cursor-pointer h-full bg-white flex flex-col rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-slate-200 hover:border-emerald-400`}>
                        <div className="relative h-72 overflow-hidden bg-slate-200">
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
                          <div className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-black">NEW</div>
                        </div>
                        <div className="flex flex-col flex-grow p-6">
                          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Recycled Plastic</div>
                          <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition">{product.name}</h3>
                          <p className="text-sm text-slate-600 line-clamp-2 flex-grow mb-4">{product.description || 'Premium recycled plastic product'}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-slate-900">${product.price}</span>
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition text-sm">
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
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section - Bento Grid */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden grid-pattern">
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
                <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-emerald-400 flex flex-col h-full hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-colors">
                  {/* Icon Badge - Pill Style */}
                  <div className="px-6 pt-6 pb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-black shadow-lg flex items-center justify-center text-2xl">
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
      <section id="services" className="py-16 lg:py-24 bg-slate-50 relative overflow-hidden grid-pattern">
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
                  <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-emerald-400 flex flex-col h-full hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-colors">
                    {/* Icon Badge - Pill Style */}
                    <div className="px-6 pt-6 pb-3">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${service.color} text-white font-black shadow-lg flex items-center justify-center text-3xl`}>
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
                <img src={logo} alt={`Partner ${i + 1}`} className="max-w-full max-h-full object-contain group-hover:grayscale-0 grayscale opacity-60 group-hover:opacity-100 transition-all duration-300" />
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

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="mb-6 inline-block">
            <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold">
              💌 NEWSLETTER
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">How About 10% Off?</h2>
          <p className="text-emerald-50 text-xl mb-8 max-w-lg mx-auto leading-relaxed">
            Sign up for exclusive offers on our eco-friendly products and be the first to know about new collections.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white rounded-lg transition"
              required
            />
            <Button
              type="submit"
              isLoading={subscribed}
              className="px-8 bg-white hover:bg-slate-100 text-emerald-600 font-black rounded-lg transition whitespace-nowrap shadow-lg hover:shadow-xl"
            >
              {subscribed ? '✓ Done!' : 'GET OFFER'}
            </Button>
          </form>

          <p className="text-emerald-100 text-sm">We respect your privacy. Unsubscribe anytime.</p>

          {/* Social Proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-white text-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <span className="font-semibold">Join 5,000+ subscribers</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <span className="font-semibold">Weekly eco tips & offers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">SHOP</h5>
              <ul className="text-sm space-y-3 text-slate-400">
                <li><Link href="#" className="hover:text-emerald-400 transition font-semibold">All Products</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition font-semibold">Custom Orders</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition font-semibold">Collections</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition font-semibold">Bulk Discounts</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">SERVICES</h5>
              <ul className="text-sm space-y-3 text-slate-400">
                <li><Link href="#services" className="hover:text-emerald-400 transition font-semibold">Recycling Programs</Link></li>
                <li><Link href="#services" className="hover:text-emerald-400 transition font-semibold">Workshops</Link></li>
                <li><Link href="#services" className="hover:text-emerald-400 transition font-semibold">Consulting</Link></li>
                <li><Link href="#services" className="hover:text-emerald-400 transition font-semibold">Custom Solutions</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">COMPANY</h5>
              <ul className="text-sm space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition font-semibold">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition font-semibold">Blog & News</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition font-semibold">Impact Report</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition font-semibold">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-white mb-6 text-sm uppercase tracking-widest">CONNECT</h5>
              <ul className="text-sm space-y-3 text-slate-400">
                <li><Link href="/contact" className="hover:text-emerald-400 transition font-semibold">Contact Us</Link></li>
                <li><a href="#" className="hover:text-emerald-400 transition font-semibold">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition font-semibold">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition font-semibold">Sustainability</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400 text-sm mb-4 font-semibold">&copy; 2026 Plastic Precious. All rights reserved.</p>
            <p className="text-slate-500 text-xs">Made with 🌱 for a better planet • Building sustainable solutions together</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
