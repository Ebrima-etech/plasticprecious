'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiSearch, FiUser, FiChevronDown, FiTruck, FiCheck, FiHeart, FiHeadphones, FiPhone, FiMail, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { GiRecycle } from 'react-icons/gi';
import { getAccessToken, clearTokens } from '@/lib/auth';

interface NavbarProps {
  showNavLinks?: boolean;
  sticky?: boolean;
  showCategories?: boolean;
}

export default function Navbar({ showNavLinks = false, sticky = true, showCategories = false }: NavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const rotatingItems = [
    { label: 'ECO-FRIENDLY', value: 'Premium Products' },
    { label: 'SUSTAINABLE', value: 'Quality Assured' },
    { label: 'INNOVATIVE', value: 'Always Improving' },
  ];

  const prevIndex = (rotatingIndex - 1 + rotatingItems.length) % rotatingItems.length;
  const nextIndex = (rotatingIndex + 1) % rotatingItems.length;

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
    }, 6000);
    return () => clearInterval(interval);
  }, [rotatingItems.length]);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearTokens();
    setAccountDropdownOpen(false);
    router.push('/');
  };

  return (
    <>
      <style>{`
        @keyframes slideUpFadeIn {
          0% { opacity: 0; transform: translateY(30px); }
          5% { opacity: 1; transform: translateY(0); }
          95% { opacity: 1; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes disappear {
          0% { opacity: 1; }
          1% { opacity: 0; }
          100% { opacity: 0; }
        }
        .rotating-text-current {
          animation: disappear 6s ease-in-out;
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          width: max-content;
          line-height: 1.2;
        }
        .rotating-text-next {
          animation: slideUpFadeIn 6s ease-in-out;
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          width: max-content;
          line-height: 1.2;
        }
        .rotating-text-container {
          position: relative;
          display: inline-block;
          min-width: 140px;
          height: 2.4em;
          overflow: hidden;
        }
        @keyframes typing {
          0% { width: 0; }
          100% { width: 100%; }
        }
        @keyframes blink {
          0%, 49% { border-right-color: transparent; }
          50%, 100% { border-right-color: rgb(107, 114, 128); }
        }
        .animated-placeholder {
          position: relative;
        }
        .animated-placeholder::placeholder {
          color: rgb(148, 163, 184);
          animation: typing 2.5s steps(20, end) infinite;
        }
      `}</style>
      {/* Top Promo Bar - Desktop Only */}
      <div className="hidden md:block sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 text-xs text-slate-100 overflow-x-auto">
            <div className="flex items-center gap-8 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <GiRecycle className="text-emerald-400 text-lg" />
                <div className="rotating-text-container">
                  <div key={`current-${rotatingIndex}`} className="rotating-text-current">
                    <div className="text-slate-400 text-xs font-semibold">{rotatingItems[rotatingIndex].label}</div>
                    <div className="font-black text-white">{rotatingItems[rotatingIndex].value}</div>
                  </div>
                  <div key={`next-${nextIndex}`} className="rotating-text-next">
                    <div className="text-slate-400 text-xs font-semibold">{rotatingItems[nextIndex].label}</div>
                    <div className="font-black text-white">{rotatingItems[nextIndex].value}</div>
                  </div>
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
      <nav className={`${sticky ? 'sticky' : ''} top-0 z-40 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg relative`} style={{ borderBottom: isScrolled ? 'none' : 'none' }}>
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
                className="animated-placeholder bg-transparent text-slate-900 text-sm placeholder-slate-400 ml-3 w-full focus:outline-none font-medium"
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

              {/* Account Dropdown */}
              <div ref={accountDropdownRef} className="relative">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center gap-1 md:gap-2 text-white hover:text-slate-200 transition cursor-pointer hover:scale-110"
                >
                  <FiUser size={20} />
                  <span className="text-xs font-bold hidden md:inline">My Account</span>
                </button>

                {/* Dropdown Menu */}
                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                    {isLoggedIn ? (
                      <>
                        {/* Header with User Info */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4">
                          <p className="text-xs font-semibold text-emerald-100 mb-1">Welcome</p>
                          <p className="text-sm font-black">Account User</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/account"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition font-semibold text-sm"
                          >
                            <FiUser size={18} className="text-emerald-600" />
                            My Account
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition font-semibold text-sm"
                          >
                            <span className="text-lg">📦</span>
                            My Orders
                          </Link>
                          <Link
                            href="/cart"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition font-semibold text-sm"
                          >
                            <FiShoppingCart size={18} className="text-emerald-600" />
                            Shopping Cart
                          </Link>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100"></div>

                        {/* Logout */}
                        <div className="py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 transition font-semibold text-sm"
                          >
                            <FiLogOut size={18} />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link href="/auth/login" onClick={() => setAccountDropdownOpen(false)} className="block px-6 py-3 text-center text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-bold transition">
                        Sign In
                      </Link>
                    )}
                  </div>
                )}
              </div>

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
            <div className="lg:hidden absolute top-full left-0 right-0 bg-emerald-600 border-t border-emerald-700 z-50 px-6 py-4">
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
              {isLoggedIn ? (
                <>
                  <Link href="/account" className="block text-white hover:text-emerald-100 transition text-sm font-medium py-2 border-t border-emerald-500 pt-2 mt-2">
                    My Account
                  </Link>
                  <Link href="/orders" className="block text-white hover:text-emerald-100 transition text-sm font-medium py-2">
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-white hover:text-emerald-100 transition text-sm font-medium py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="block text-white hover:text-emerald-100 transition text-sm font-medium py-2 border-t border-emerald-500 pt-2 mt-2">
                  Sign In
                </Link>
              )}
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
            className="animated-placeholder bg-transparent text-teal-900 text-sm placeholder-gray-500 placeholder-opacity-50 ml-3 w-full focus:outline-none"
          />
        </div>
      </div>
    </>
  );
}
