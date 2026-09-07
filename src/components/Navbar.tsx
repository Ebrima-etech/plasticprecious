'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiSearch, FiUser, FiChevronDown, FiTruck, FiCheck, FiHeart, FiHeadphones, FiPhone, FiMail, FiMenu, FiX } from 'react-icons/fi';
import { GiRecycle } from 'react-icons/gi';

interface NavbarProps {
  showNavLinks?: boolean;
  sticky?: boolean;
  showCategories?: boolean;
}

export default function Navbar({ showNavLinks = false, sticky = true, showCategories = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rotatingIndex, setRotatingIndex] = useState(0);

  const rotatingItems = [
    { label: 'ECO-FRIENDLY', value: 'Premium Products' },
    { label: 'SUSTAINABLE', value: 'Quality Assured' },
    { label: 'INNOVATIVE', value: 'Always Improving' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % rotatingItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [rotatingItems.length]);

  return (
    <>
      <style>{`
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(20px); }
          5% { opacity: 1; transform: translateY(0); }
          95% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .rotating-text {
          animation: slideUpFade 4s ease-in-out;
          display: inline-block;
        }
      `}</style>
      {/* Top Promo Bar - Desktop Only */}
      <div className="hidden md:block sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 text-xs text-slate-100 overflow-x-auto">
            <div className="flex items-center gap-8 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <GiRecycle className="text-emerald-400 text-lg" />
                <div className="rotating-text">
                  <div className="text-slate-400 text-xs font-semibold">{rotatingItems[rotatingIndex].label}</div>
                  <div className="font-black text-white">{rotatingItems[rotatingIndex].value}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiTruck className="text-emerald-400 text-lg" />
                <div>
                  <div className="text-slate-400 text-xs font-semibold">FAST</div>
                  <div className="font-black text-white">Delivery Available</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCheck className="text-emerald-400 text-lg" />
                <div>
                  <div className="text-slate-400 text-xs font-semibold">100% CERTIFIED</div>
                  <div className="font-black text-white">Sustainable</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiHeart className="text-emerald-400 text-lg" />
                <div>
                  <div className="text-slate-400 text-xs font-semibold">SUPPORTING</div>
                  <div className="font-black text-white">Communities</div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-slate-400 text-xs font-semibold">OUR MISSION</div>
                <div className="font-black text-emerald-400 text-sm">Trash to Treasure</div>
              </div>
            </div>
            <div className="flex items-center gap-6 ml-auto">
              <a href="tel:+220872518185" className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition text-xs font-bold">
                <FiPhone size={16} />
                +220 872518185
              </a>
              <a href="mailto:info@preciousplasticgambia.com" className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition text-xs font-bold">
                <FiMail size={16} />
                info@preciousplasticgambia.com
              </a>
              <button className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition text-xs font-bold">
                <FiHeadphones size={16} />
                Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${sticky ? 'sticky' : ''} top-0 z-40 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg`} style={{ borderBottom: isScrolled ? 'none' : 'none' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Toggle - On the Left */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white hover:text-slate-200 transition p-1 mr-3 hover:scale-110"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="text-xl md:text-2xl font-black text-white hover:text-slate-100 transition flex-1 md:flex-none">
              PreciousPlastic
            </Link>

            {/* Search Bar - Hidden on Mobile */}
            <div className="hidden lg:flex flex-1 max-w-sm items-center bg-white border-0 px-4 rounded-lg mx-6 shadow-md" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
              <FiSearch size={18} className="text-emerald-600" />
              <input
                type="text"
                placeholder="Search for products"
                className="bg-transparent text-slate-900 text-sm placeholder-slate-400 ml-3 w-full focus:outline-none font-medium"
              />
            </div>

            {/* Nav Links - Hidden on Mobile */}
            {showNavLinks && (
              <div className="hidden lg:flex items-center gap-8">
                <Link href="/" className="text-white hover:text-slate-200 transition text-sm font-bold uppercase tracking-wide">
                  Mission
                </Link>
                <Link href="/services" className="text-white hover:text-slate-200 transition text-sm font-bold uppercase tracking-wide">
                  Services
                </Link>
                <Link href="#" className="text-white hover:text-slate-200 transition text-sm font-bold uppercase tracking-wide">
                  Sale
                </Link>
                <Link href="/blog" className="text-white hover:text-slate-200 transition text-sm font-bold uppercase tracking-wide">
                  Blog
                </Link>
                <Link href="/about" className="text-white hover:text-slate-200 transition text-sm font-bold uppercase tracking-wide">
                  About Us
                </Link>
                <Link href="#" className="text-white hover:text-slate-200 transition text-sm font-bold uppercase tracking-wide">
                  Impact
                </Link>
              </div>
            )}

            {/* Right Navigation & Actions */}
            <div className="flex items-center gap-2 md:gap-5 ml-auto">
              {/* Language Selector - Visible on all screens */}
              <button className="flex items-center gap-1 text-white hover:text-slate-200 transition text-xs md:text-sm font-bold hover:scale-110">
                Eng
                <FiChevronDown size={16} />
              </button>

              {/* Account - Show on all screens now */}
              <Link href="/auth/login">
                <div className="flex items-center gap-1 md:gap-2 text-white hover:text-slate-200 transition cursor-pointer hover:scale-110">
                  <FiUser size={20} />
                  <span className="text-xs font-bold hidden md:inline">My Account</span>
                </div>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <div className="flex items-center gap-1 md:gap-2 text-white hover:text-slate-200 transition cursor-pointer relative hover:scale-110">
                  <FiShoppingCart size={20} />
                  <span className="text-xs font-bold hidden md:inline">Cart</span>
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-black shadow-lg">0</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && showNavLinks && (
            <div className="lg:hidden pb-4 bg-emerald-600 border-t border-emerald-700">
              <Link href="/" className="block text-white hover:text-emerald-100 transition text-sm font-medium py-2">
                Mission
              </Link>
              <Link href="/services" className="block text-white hover:text-emerald-100 transition text-sm font-medium py-2">
                Services
              </Link>
              <Link href="#" className="block text-white hover:text-emerald-100 transition text-sm font-medium py-2">
                Sale
              </Link>
              <Link href="/blog" className="block text-white hover:text-emerald-100 transition text-sm font-medium py-2">
                Blog
              </Link>
              <Link href="/about" className="block text-white hover:text-emerald-100 transition text-sm font-medium py-2">
                About Us
              </Link>
              <Link href="#" className="block text-white hover:text-emerald-100 transition text-sm font-medium py-2">
                Impact
              </Link>
              <Link href="/auth/login" className="block text-white hover:text-emerald-100 transition text-sm font-medium py-2">
                My Account
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Search Bar - Replaces Categories Row */}
      <div className="lg:hidden bg-emerald-600 py-2 px-6">
        <div className="flex items-center bg-white border-0 px-4 rounded-full" style={{ paddingTop: '0.375rem', paddingBottom: '0.375rem' }}>
          <FiSearch size={16} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Search products"
            className="bg-transparent text-teal-900 text-sm placeholder-gray-500 placeholder-opacity-50 ml-3 w-full focus:outline-none"
          />
        </div>
      </div>
    </>
  );
}
