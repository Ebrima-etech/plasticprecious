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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Promo Bar - Desktop Only */}
      <div className="hidden md:block sticky top-0 z-50" style={{ backgroundColor: '#002b2f' }}>
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
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-300 text-xs">Our Mission</div>
                <div className="font-semibold text-white text-xs">Trash to Treasure</div>
              </div>
            </div>
            <div className="flex items-center gap-6 ml-auto">
              <a href="tel:+220872518185" className="flex items-center gap-1 text-white hover:text-gray-200 transition text-xs font-medium">
                <FiPhone size={16} />
                +220 872518185
              </a>
              <a href="mailto:info@preciousplasticgambia.com" className="flex items-center gap-1 text-white hover:text-gray-200 transition text-xs font-medium">
                <FiMail size={16} />
                info@preciousplasticgambia.com
              </a>
              <button className="flex items-center gap-1 text-white hover:text-gray-200 transition text-xs font-medium">
                <FiHeadphones size={16} />
                Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${sticky ? 'sticky' : ''} top-0 z-40 bg-emerald-600`} style={{ borderBottom: isScrolled ? 'none' : 'none' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Mobile Menu Toggle - On the Left */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white hover:text-emerald-300 transition p-1 mr-3"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="text-lg md:text-xl font-bold text-white hover:text-emerald-100 transition flex-1 md:flex-none">
              PreciousPlastic
            </Link>

            {/* Search Bar - Hidden on Mobile */}
            <div className="hidden lg:flex flex-1 max-w-xs items-center bg-white border-0 px-4 rounded-full mx-4" style={{ paddingTop: '0.375rem', paddingBottom: '0.375rem' }}>
              <FiSearch size={16} className="text-emerald-600" />
              <input
                type="text"
                placeholder="Search for products"
                className="bg-transparent text-teal-900 text-sm placeholder-gray-500 placeholder-opacity-50 ml-3 w-full focus:outline-none"
              />
            </div>

            {/* Nav Links - Hidden on Mobile */}
            {showNavLinks && (
              <div className="hidden lg:flex items-center gap-6">
                <Link href="/" className="text-white hover:text-emerald-300 transition text-sm font-medium">
                  Mission
                </Link>
                <Link href="/services" className="text-white hover:text-emerald-300 transition text-sm font-medium">
                  Services
                </Link>
                <Link href="#" className="text-white hover:text-emerald-300 transition text-sm font-medium">
                  Sale
                </Link>
                <Link href="/blog" className="text-white hover:text-emerald-300 transition text-sm font-medium">
                  Blog
                </Link>
                <Link href="/about" className="text-white hover:text-emerald-300 transition text-sm font-medium">
                  About Us
                </Link>
                <Link href="#" className="text-white hover:text-emerald-300 transition text-sm font-medium">
                  Impact
                </Link>
              </div>
            )}

            {/* Right Navigation & Actions */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              {/* Language Selector - Visible on all screens */}
              <button className="flex items-center gap-1 text-white hover:text-emerald-300 transition text-xs md:text-sm font-medium">
                Eng
                <FiChevronDown size={16} />
              </button>

              {/* Account - Show on all screens now */}
              <Link href="/auth/login">
                <div className="flex items-center gap-1 md:gap-2 text-white hover:text-emerald-300 transition cursor-pointer">
                  <FiUser size={20} />
                  <span className="text-xs font-medium hidden md:inline">My Account</span>
                </div>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <div className="flex items-center gap-1 md:gap-2 text-white hover:text-emerald-300 transition cursor-pointer relative">
                  <FiShoppingCart size={20} />
                  <span className="text-xs font-medium hidden md:inline">Cart</span>
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span>
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
