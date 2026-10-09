'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiSearch, FiX } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';

interface Suggestion {
  id: number;
  name: string;
  price: string;
  image?: string | null;
  category_name?: string;
}

// Public product search: a plain instance so a stale login never redirects visitors
const publicApi = axios.create();

interface SearchBoxProps {
  variant: 'desktop' | 'mobile';
}

export default function SearchBox({ variant }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Live suggestions after a short pause in typing
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await publicApi.get(`${API_BASE_URL}/products/`, { params: { search: term, page_size: 6 } });
        setSuggestions((res.data.results || res.data).slice(0, 6));
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close the dropdown when clicking elsewhere
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    router.push(`/shop?search=${encodeURIComponent(term)}`);
  };

  const pick = () => {
    setOpen(false);
    setQuery('');
  };

  const isDesktop = variant === 'desktop';
  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={wrapperRef} className={`relative ${isDesktop ? 'flex-1 max-w-sm mx-6' : 'w-full'}`}>
      <form
        role="search"
        onSubmit={submit}
        className={`flex items-center bg-white border-0 px-4 ${isDesktop ? 'rounded-lg shadow-md py-2' : 'rounded-full py-1.5'}`}
      >
        <button type="submit" aria-label="Search" className="text-emerald-600 flex-shrink-0">
          <FiSearch size={isDesktop ? 18 : 16} />
        </button>
        <input
          type="search"
          enterKeyHint="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
          placeholder="Search products..."
          aria-label="Search products"
          autoComplete="off"
          className={`animated-placeholder bg-transparent text-teal-900 placeholder-gray-500 placeholder-opacity-50 ml-3 w-full focus:outline-none [&::-webkit-search-cancel-button]:hidden ${isDesktop ? 'text-sm' : 'text-sm'}`}
        />
        {query && (
          <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); setSuggestions([]); }} className="text-slate-400 hover:text-slate-600">
            <FiX size={16} />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 z-[60] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          {loading && suggestions.length === 0 ? (
            <p className="m-0 px-4 py-3 text-sm text-slate-500">Searching…</p>
          ) : suggestions.length === 0 ? (
            <p className="m-0 px-4 py-3 text-sm text-slate-500">No products match “{query.trim()}”.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {suggestions.map(product => (
                <li key={product.id}>
                  <Link href={`/shop/${product.id}`} onClick={pick} className="flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                      {product.category_name && <p className="m-0 text-xs text-slate-500 truncate">{product.category_name}</p>}
                    </div>
                    <span className="text-sm font-bold text-emerald-700 flex-shrink-0">
                      D {parseFloat(product.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => submit()}
            className="w-full px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-slate-50 hover:bg-emerald-50 border-t border-slate-100 text-left"
          >
            See all results for “{query.trim()}” →
          </button>
        </div>
      )}
    </div>
  );
}
