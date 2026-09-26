'use client';

import { useState } from 'react';
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';

export default function VouchersPage() {
  const [vouchers] = useState([]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vouchers</h1>
          <p className="text-slate-600 mt-2">Create and manage discount vouchers and promotional codes</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">
          + New Voucher
        </button>
      </div>

      {/* Vouchers List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {vouchers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 font-medium">No vouchers created yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first voucher to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Discount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Uses</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Add voucher rows here when data is available */}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
