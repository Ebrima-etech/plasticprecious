'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiSearch, FiUser, FiChevronDown, FiTruck, FiCheck, FiHeart, FiHeadphones, FiPhone, FiMail } from 'react-icons/fi';
import { GiRecycle } from 'react-icons/gi';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Promo Bar */}
      <div className="hidden lg:block bg-emerald-600">
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
      <nav className="sticky top-0 z-40 bg-emerald-900 h-12" style={{ borderBottom: isScrolled ? '0.75px solid rgba(255, 255, 255, 0.12)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 h-12">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-white hover:text-emerald-100 transition">
              PLASTICPRECIOUS
            </Link>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xs items-center bg-white border-0 px-4 rounded-full" style={{ paddingTop: '0.375rem', paddingBottom: '0.375rem' }}>
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

            {/* Nav Links */}
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

            {/* Right Navigation & Actions */}
            <div className="flex items-center gap-4 ml-auto pl-8" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Link href="/auth/login">
                <div className="flex items-center gap-2 text-white hover:text-emerald-300 transition cursor-pointer">
                  <FiUser size={20} />
                  <span className="text-xs font-medium">My Account</span>
                </div>
              </Link>
              <Link href="/cart">
                <div className="flex items-center gap-2 text-white hover:text-emerald-300 transition cursor-pointer relative">
                  <FiShoppingCart size={20} />
                  <span className="text-xs font-medium">Cart</span>
                  <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Categories Row */}
      <div className="bg-emerald-900 flex items-center gap-8 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex items-center gap-8">
          <a href="/shop" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-600 transition text-sm whitespace-nowrap">
            Collections
          </a>
          <a href="/shop" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-600 transition text-sm whitespace-nowrap">
            Custom Products
          </a>
          <a href="/shop" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-600 transition text-sm whitespace-nowrap">
            Eco Products
          </a>
          <a href="/shop" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-600 transition text-sm whitespace-nowrap">
            Recycled Plastic
          </a>
          <a href="/shop" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-600 transition text-sm whitespace-nowrap">
            Sustainable Living
          </a>
        </div>
      </div>
    </>
  );
}
