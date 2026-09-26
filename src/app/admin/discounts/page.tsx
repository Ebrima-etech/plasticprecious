'use client';

import { useState } from 'react';

export default function DiscountsPage() {
  const [discounts] = useState([]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Discounts</h1>
          <p className="text-slate-600 mt-2">Create and manage product and category discounts</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition">
          + New Discount
        </button>
      </div>

      {/* Discount Types */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-2">Percentage Discounts</h3>
          <p className="text-slate-600 text-sm mb-4">Apply % off to products or categories</p>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition">
            Create
          </button>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-2">Fixed Amount Discounts</h3>
          <p className="text-slate-600 text-sm mb-4">Apply fixed amount (D) off to products</p>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition">
            Create
          </button>
        </div>
      </div>

      {/* Discounts List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {discounts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 font-medium">No discounts created yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first discount to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Value</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Add discount rows here when data is available */}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
