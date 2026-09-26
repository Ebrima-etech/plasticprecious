'use client';

import { useState } from 'react';

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Revenue</h1>
        <p className="text-slate-600 mt-2">Track and manage your sales revenue</p>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-3">
        {['week', 'month', 'quarter', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === range
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">D 0.00</p>
          <p className="text-green-600 text-sm mt-2">+0% from last period</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <p className="text-slate-600 text-sm font-medium">Total Orders</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
          <p className="text-green-600 text-sm mt-2">+0% from last period</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <p className="text-slate-600 text-sm font-medium">Avg Order Value</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">D 0.00</p>
          <p className="text-green-600 text-sm mt-2">+0% from last period</p>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue Trend</h2>
        <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
          <p className="text-slate-500">Chart coming soon</p>
        </div>
      </div>
    </div>
  );
}
