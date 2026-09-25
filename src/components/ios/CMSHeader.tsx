'use client';

import { HiOutlinePlus, HiOutlineMagnifyingGlass } from 'react-icons/hi2';

interface CMSHeaderProps {
  title: string;
  itemCount: number;
  onAddClick: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    label: string;
    value: string;
    isActive: boolean;
    onClick: () => void;
  }[];
}

export function CMSHeader({
  title,
  itemCount,
  onAddClick,
  searchValue,
  onSearchChange,
  filters
}: CMSHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium shadow-sm transition-all"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Add
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 border-0 text-sm placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition"
          />
        </div>

        {/* Filter Segmented Control */}
        {filters && filters.length > 0 && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={filter.onClick}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter.isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
