'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/config/api';
import { HiOutlineSquares2X2, HiOutlineShoppingBag, HiOutlineTag, HiOutlineShoppingCart, HiOutlineCurrencyDollar, HiOutlineTicket, HiOutlineUsers, HiOutlineBell, HiOutlineArrowTrendingUp, HiOutlineCalendar, HiOutlineDocumentText, HiOutlineGift, HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineChevronDown, HiOutlineArrowRightOnRectangle, HiOutlineHome, HiOutlineBars3, HiOutlineCog } from 'react-icons/hi2';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState('/admin/dashboard');
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    dashboard: false,
    catalog: false,
    orders: false,
    cms: false,
    impact: false,
    staff: false,
    users: false
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Fetch user data to check if admin
        const response = await axios.get(`${API_BASE_URL}/auth/user/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = response.data;
        if (!user.is_staff && !user.is_superuser) {
          // Not an admin, redirect to home
          router.push('/');
          return;
        }

        setIsAuthed(true);
        setActiveRoute(window.location.pathname);
      } catch (error) {
        // Auth failed, redirect to login
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-slate-300 border-t-emerald-600"></div>
          <p className="mt-4 text-slate-600 font-medium text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = activeRoute === href;
    return (
      <Link href={href} onClick={() => setActiveRoute(href)}>
        <div
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-medium group ${
            isActive
              ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-2 border-emerald-600'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent group-hover:border-slate-300'
          }`}
        >
          <Icon className="w-4.5 h-4.5 flex-shrink-0" />
          {sidebarOpen && <span>{label}</span>}
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <style>{`
        :root {
          --primary: 16 185 129;
          --primary-rgb: 16, 185, 129;
        }

        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgb(209 213 219);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgb(156 163 175);
        }
      `}</style>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200/50 flex flex-col transition-all duration-300 overflow-hidden shadow-sm ${sidebarOpen ? 'w-64' : 'w-20'} z-40`}>
        {/* Sidebar Header */}
        <div className="px-4 py-5 border-b border-slate-200/50 flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/admin" className="flex items-center gap-3 flex-1 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition flex-shrink-0">
                <HiOutlineSquares2X2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900">Admin Suite</span>
              </div>
            </Link>
          )}
          {!sidebarOpen && (
            <Link href="/admin" className="flex items-center justify-center w-full group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition">
                <HiOutlineSquares2X2 className="w-5 h-5" />
              </div>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition ml-2 flex-shrink-0 text-slate-600 hover:text-slate-900"
          >
            <HiOutlineBars3 className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Dashboard Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, dashboard: !expandedSections.dashboard })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dashboard</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.dashboard ? 'rotate-0' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.dashboard && sidebarOpen) && (
              <div className="space-y-1.5 mt-2">
                <NavLink href="/admin/dashboard" icon={HiOutlineSquares2X2} label="Overview" />
              </div>
            )}
          </div>

          {/* Catalog Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, catalog: !expandedSections.catalog })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Products</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.catalog ? 'rotate-0' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.catalog && sidebarOpen) && (
              <div className="space-y-1.5 mt-2">
                <NavLink href="/admin/products" icon={HiOutlineShoppingBag} label="Products" />
                <NavLink href="/admin/categories" icon={HiOutlineTag} label="Categories" />
              </div>
            )}
          </div>

          {/* Orders & Revenue Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, orders: !expandedSections.orders })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commerce</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.orders ? 'rotate-0' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.orders && sidebarOpen) && (
              <div className="space-y-1.5 mt-2">
                <NavLink href="/admin/orders" icon={HiOutlineShoppingCart} label="Orders" />
                <NavLink href="/admin/revenue" icon={HiOutlineCurrencyDollar} label="Revenue" />
                <NavLink href="/admin/vouchers" icon={HiOutlineTicket} label="Vouchers" />
                <NavLink href="/admin/discounts" icon={HiOutlineTag} label="Discounts" />
              </div>
            )}
          </div>

          {/* CMS & Content Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, cms: !expandedSections.cms })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.cms ? 'rotate-0' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.cms && sidebarOpen) && (
              <div className="space-y-1.5 mt-2">
                <NavLink href="/admin/cms/hero-slides" icon={HiOutlineSquares2X2} label="Hero Slides" />
                <NavLink href="/admin/cms/services" icon={HiOutlineBriefcase} label="Services" />
                <NavLink href="/admin/cms/team-members" icon={HiOutlineUserGroup} label="Team Members" />
                <NavLink href="/admin/cms/partners" icon={HiOutlineTag} label="Partners" />
              </div>
            )}
          </div>

          {/* Impact & Community Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, impact: !expandedSections.impact })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Impact</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.impact ? 'rotate-0' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.impact && sidebarOpen) && (
              <div className="space-y-1.5 mt-2">
                <NavLink href="/admin/impact" icon={HiOutlineArrowTrendingUp} label="Metrics" />
                <NavLink href="/admin/impact/events" icon={HiOutlineCalendar} label="Events" />
                <NavLink href="/admin/impact/registrations" icon={HiOutlineUsers} label="Registrations" />
                <NavLink href="/admin/impact/rfq" icon={HiOutlineDocumentText} label="RFQs" />
                <NavLink href="/admin/impact/sponsorship" icon={HiOutlineGift} label="Sponsorships" />
              </div>
            )}
          </div>

          {/* Staff Management Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, staff: !expandedSections.staff })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organization</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.staff ? 'rotate-0' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.staff && sidebarOpen) && (
              <div className="space-y-1.5 mt-2">
                <NavLink href="/admin/staff/departments" icon={HiOutlineBriefcase} label="Departments" />
                <NavLink href="/admin/staff/members" icon={HiOutlineUserGroup} label="Staff Members" />
              </div>
            )}
          </div>

          {/* Users & Sellers Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, users: !expandedSections.users })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Community</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.users ? 'rotate-0' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.users && sidebarOpen) && (
              <div className="space-y-1.5 mt-2">
                <NavLink href="/admin/users" icon={HiOutlineUsers} label="Customers" />
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="mt-auto pt-4">
            <NavLink href="/admin/settings" icon={HiOutlineCog} label="Settings" />
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200/50 bg-gradient-to-b from-transparent to-slate-50/50">
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} px-3 py-3 rounded-lg hover:bg-white/60 hover:shadow-sm transition group`}
            >
              <div className={`flex items-center gap-3 ${sidebarOpen ? 'flex-1 min-w-0' : ''}`}>
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                  A
                </div>
                {sidebarOpen && (
                  <div className="text-left min-w-0">
                    <p className="text-sm font-semibold text-slate-900">Admin</p>
                    <p className="text-xs text-slate-500 truncate font-medium">admin@store.com</p>
                  </div>
                )}
              </div>
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition ${profileOpen ? 'rotate-180' : ''}`} />}
            </button>

            {profileOpen && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-3 bg-white border border-slate-200/50 rounded-xl shadow-lg z-50 overflow-hidden">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-emerald-50 border-b border-slate-100 transition font-medium">
                  <HiOutlineHome className="w-4 h-4" />
                  <span>Back to Store</span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    router.push('/auth/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                >
                  <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/30 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-slate-900">Dashboard</h2>
              <p className="text-xs text-slate-500 font-medium">Management Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition group relative text-slate-600 hover:text-slate-900">
                <HiOutlineBell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              </button>
              <div className="absolute -right-1 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-200/50 hidden group-hover:block z-50 p-4">
                <p className="text-xs text-slate-500 font-medium">No new notifications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
