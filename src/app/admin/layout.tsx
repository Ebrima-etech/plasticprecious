'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import { HiOutlineSquares2X2, HiOutlineShoppingBag, HiOutlineTag, HiOutlineShoppingCart, HiOutlineCurrencyDollar, HiOutlineTicket, HiOutlineUsers, HiOutlineBell, HiOutlineArrowTrendingUp, HiOutlineCalendar, HiOutlineDocumentText, HiOutlineGift, HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineChevronDown, HiOutlineArrowRightOnRectangle, HiOutlineHome, HiOutlineBars3 } from 'react-icons/hi2';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState('/admin/dashboard');
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    catalog: true,
    orders: true,
    cms: true,
    impact: true,
    staff: true,
    users: true
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setIsAuthed(true);
    setLoading(false);
    setActiveRoute(window.location.pathname);
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
          className={`flex items-center gap-3 px-3.5 py-2 rounded-md transition-all text-sm font-medium ${
            isActive
              ? 'bg-emerald-50 text-emerald-700 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Icon className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{label}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --primary: 16 185 129;
          --primary-rgb: 16, 185, 129;
        }
      `}</style>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200/80 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} z-40`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200/60 flex items-center justify-between">
          {sidebarOpen && (
            <Link href="/admin" className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <HiOutlineSquares2X2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900">Admin</span>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
            </Link>
          )}
          {!sidebarOpen && (
            <Link href="/admin" className="flex items-center justify-center w-full">
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <HiOutlineSquares2X2 className="w-5 h-5" />
              </div>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition ml-2 flex-shrink-0"
          >
            <HiOutlineBars3 className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {/* Dashboard Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, dashboard: !expandedSections.dashboard })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Dashboard</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.dashboard ? '' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.dashboard && sidebarOpen) && (
              <div className="space-y-1 mt-1">
                <NavLink href="/admin/dashboard" icon={HiOutlineSquares2X2} label="Overview" />
              </div>
            )}
          </div>

          {/* Catalog Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, catalog: !expandedSections.catalog })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Catalog</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.catalog ? '' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.catalog && sidebarOpen) && (
              <div className="space-y-1 mt-1">
                <NavLink href="/admin/products" icon={HiOutlineShoppingBag} label="Products" />
                <NavLink href="/admin/categories" icon={HiOutlineTag} label="Categories" />
              </div>
            )}
          </div>

          {/* Orders & Revenue Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, orders: !expandedSections.orders })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Orders & Revenue</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.orders ? '' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.orders && sidebarOpen) && (
              <div className="space-y-1 mt-1">
                <NavLink href="/admin/orders" icon={HiOutlineShoppingCart} label="Orders" />
                <NavLink href="/admin/settings" icon={HiOutlineCurrencyDollar} label="Revenue" />
                <NavLink href="/admin/settings" icon={HiOutlineTicket} label="Vouchers" />
                <NavLink href="/admin/settings" icon={HiOutlineTag} label="Discounts" />
              </div>
            )}
          </div>

          {/* CMS & Content Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, cms: !expandedSections.cms })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">CMS & Content</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.cms ? '' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.cms && sidebarOpen) && (
              <div className="space-y-1 mt-1">
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Impact & Community</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.impact ? '' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.impact && sidebarOpen) && (
              <div className="space-y-1 mt-1">
                <NavLink href="/admin/impact" icon={HiOutlineArrowTrendingUp} label="Impact Metrics" />
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Staff Management</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.staff ? '' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.staff && sidebarOpen) && (
              <div className="space-y-1 mt-1">
                <NavLink href="/admin/staff/departments" icon={HiOutlineBriefcase} label="Departments" />
                <NavLink href="/admin/staff/members" icon={HiOutlineUserGroup} label="Staff Members" />
              </div>
            )}
          </div>

          {/* Users & Sellers Section */}
          <div>
            <button
              onClick={() => setExpandedSections({ ...expandedSections, users: !expandedSections.users })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              {sidebarOpen && <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Users & Sellers</p>}
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.users ? '' : '-rotate-90'}`} />}
            </button>
            {(expandedSections.users && sidebarOpen) && (
              <div className="space-y-1 mt-1">
                <NavLink href="/admin/users" icon={HiOutlineUsers} label="Customers" />
              </div>
            )}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-3 border-t border-slate-200/60">
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} px-3 py-2.5 rounded-lg hover:bg-slate-100 transition group`}
            >
              <div className={`flex items-center gap-3 ${sidebarOpen ? 'flex-1 min-w-0' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  A
                </div>
                {sidebarOpen && (
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium text-slate-900">Admin</p>
                    <p className="text-xs text-slate-500 truncate">admin@store.com</p>
                  </div>
                )}
              </div>
              {sidebarOpen && <HiOutlineChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition ${profileOpen ? 'rotate-180' : ''}`} />}
            </button>

            {profileOpen && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200/80 rounded-lg shadow-lg z-50">
                <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition">
                  <HiOutlineHome className="w-4 h-4" />
                  <span>Back to Store</span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    router.push('/auth/login');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
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
        <div className="bg-white border-b border-slate-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-slate-600">Admin Panel</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition group relative">
                <HiOutlineBell className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
