'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { AdminTableSkeleton } from '@/components/ShimmerSkeleton';
import { Pagination } from '@/components/admin/Pagination';
import { formatDate, formatCurrency, formatStatusBadge } from '@/lib/format-utils';
import { HiOutlineClock, HiOutlineArrowPath, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineShoppingCart } from 'react-icons/hi2';

interface Order {
  id: number;
  order_number: string;
  user_email: string;
  total_price: string;
  status: string;
  created_at: string;
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: HiOutlineClock },
  processing: { color: 'bg-blue-100 text-blue-800', icon: HiOutlineArrowPath },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: HiOutlineArrowPath },
  delivered: { color: 'bg-green-100 text-green-800', icon: HiOutlineCheckCircle },
  cancelled: { color: 'bg-green-100 text-green-800', icon: HiOutlineXCircle },
};

const ITEMS_PER_PAGE = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const token = getToken();
        let allOrders: Order[] = [];
        let nextUrl = `${API_BASE_URL}/orders/?limit=1000`;

        while (nextUrl) {
          const response = await axios.get(nextUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const pageOrders = response.data.results || [];
          if (Array.isArray(pageOrders)) {
            allOrders = [...allOrders, ...pageOrders];
          }

          nextUrl = response.data.next || null;
        }

        setOrders(allOrders);
        setCurrentPage(1);
      } catch (err: any) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginate filtered results
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when search/filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="w-32 h-8 bg-gray-200 rounded shimmer-loading mb-2"></div>
          <div className="w-60 h-4 bg-gray-200 rounded shimmer-loading"></div>
        </div>
        <AdminTableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <HiOutlineShoppingCart className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
            <p className="text-sm text-slate-600 mt-0.5">Manage and track customer orders</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search by order number or customer email..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
              statusFilter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => handleStatusChange('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
              statusFilter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            }`}
          >
            Pending ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => handleStatusChange('processing')}
            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
              statusFilter === 'processing'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Processing ({orders.filter(o => o.status === 'processing').length})
          </button>
          <button
            onClick={() => handleStatusChange('shipped')}
            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
              statusFilter === 'shipped'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            Shipped ({orders.filter(o => o.status === 'shipped').length})
          </button>
          <button
            onClick={() => handleStatusChange('delivered')}
            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
              statusFilter === 'delivered'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Delivered ({orders.filter(o => o.status === 'delivered').length})
          </button>
          <button
            onClick={() => handleStatusChange('cancelled')}
            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
              statusFilter === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            Cancelled ({orders.filter(o => o.status === 'cancelled').length})
          </button>
        </div>

        {/* Results Count */}
        <div className="text-sm text-slate-600">
          Found {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-600 font-medium">No orders yet</p>
          <p className="text-sm text-slate-500 mt-1">Orders from customers will appear here</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-600 font-medium">No orders found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-200/80 h-12">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedOrders.map((order) => {
                  const statusInfo = formatStatusBadge(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{order.order_number}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 truncate">{order.user_email}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 font-tabular-nums">
                        {formatCurrency(order.total_price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(order.created_at, 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.order_number}/edit`}>
                          <button className="px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition">
                            View →
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredOrders.length}
            />
          )}
        </div>
      )}
    </div>
  );
}
