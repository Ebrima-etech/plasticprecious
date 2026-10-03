'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken, isAuthenticated } from '@/lib/auth';
import { CustomerImpact, ImpactSummary, LEVEL_ICONS, formatAmount, formatKg } from '@/lib/impact';

type CustomerStats = NonNullable<ImpactSummary['customers']>;

export default function CustomerCommunityImpact({ customers }: { customers: CustomerStats }) {
  const [mine, setMine] = useState<CustomerImpact | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) return;
    setLoggedIn(true);
    // Plain instance so a rejected token never redirects visitors away from this public page
    axios.create()
      .get(`${API_BASE_URL}/impact/me/`, { headers: { Authorization: `Bearer ${getAccessToken()}` } })
      .then(res => setMine(res.data))
      .catch(() => setMine(null));
  }, []);

  const maxLevel = Math.max(1, ...customers.levels.map(l => l.count));
  const stats = [
    { icon: '🤝', value: formatAmount(customers.supporters, 0), label: 'customers making a difference' },
    { icon: '♻️', value: formatKg(customers.plastic_kg), label: 'plastic saved through purchases' },
    { icon: '🍶', value: formatAmount(customers.bottles_equivalent, 0), label: 'plastic bottles equivalent' },
    { icon: '📈', value: formatKg(customers.average_plastic_kg), label: 'saved by the average customer' },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-900 to-teal-800 text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="m-0 text-sm font-black text-emerald-300 uppercase tracking-widest mb-3">Our Customers</p>
          <h2 className="text-4xl font-black mb-4 text-white">Every purchase adds up</h2>
          <p className="m-0 text-emerald-100 text-lg">
            Each recycled product our customers buy keeps plastic out of Gambian beaches and streets. Here is what they have achieved together.
          </p>
        </div>

        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="rounded-2xl bg-white/10 border border-white/15 p-4 sm:p-6">
              <p className="m-0 text-3xl">{stat.icon}</p>
              <p className="m-0 mt-3 text-2xl sm:text-3xl font-black text-white whitespace-nowrap">{stat.value}</p>
              <p className="m-0 mt-1 text-sm text-emerald-100">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
          {/* Level distribution */}
          <div className="lg:col-span-3 rounded-3xl bg-white/10 border border-white/15 p-5 sm:p-8">
            <h3 className="text-xl font-black text-white mb-1">Impact levels</h3>
            <p className="m-0 text-sm text-emerald-100 mb-6">Customers level up as the plastic they save grows.</p>
            <div className="space-y-4">
              {customers.levels.map(level => (
                <div key={level.key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-white">
                      {LEVEL_ICONS[level.key]} {level.name}
                      <span className="text-emerald-200 font-normal"> · from {formatKg(level.min_kg)}</span>
                    </span>
                    <span className="text-emerald-100 tabular-nums">{formatAmount(level.count, 0)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-amber-300"
                      style={{ width: `${(level.count / maxLevel) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {customers.top_supporter_plastic_kg > 0 && (
              <p className="m-0 mt-6 text-sm text-amber-100">
                🏆 Our top supporter has saved {formatKg(customers.top_supporter_plastic_kg)} of plastic. Can you beat that?
              </p>
            )}
          </div>

          {/* Personal snapshot / call to action */}
          <div className="lg:col-span-2 rounded-3xl bg-white text-slate-900 p-5 sm:p-8 flex flex-col">
            {mine && mine.has_impact ? (
              <>
                <p className="m-0 text-xs font-black text-emerald-700 uppercase tracking-widest mb-3">Your impact</p>
                <p className="m-0 text-5xl font-black text-slate-900 whitespace-nowrap">{formatKg(mine.totals.plastic_kg)}</p>
                <p className="m-0 mt-1 text-slate-600">of plastic kept out of the environment</p>
                <p className="m-0 mt-4 inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-800">
                  {LEVEL_ICONS[mine.level.key]} {mine.level.name}
                </p>
                {mine.rank && mine.rank.supporters > 1 && (
                  <p className="m-0 mt-3 text-sm text-slate-600">🏅 Top {mine.rank.top_percent}% of supporters</p>
                )}
                <Link href="/account" className="mt-auto pt-6 text-center">
                  <span className="block px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">
                    See and share my impact
                  </span>
                </Link>
              </>
            ) : (
              <>
                <p className="m-0 text-xs font-black text-emerald-700 uppercase tracking-widest mb-3">Join them</p>
                <h3 className="text-2xl font-black text-slate-900 mb-3">Track your own impact</h3>
                <p className="m-0 text-slate-600">
                  {loggedIn
                    ? 'Your first recycled purchase starts your impact record. Earn badges, level up and share your progress with friends.'
                    : 'Create an account and every recycled product you buy is added to your personal impact record, with badges, levels and a card to share.'}
                </p>
                <div className="mt-auto pt-6 space-y-2">
                  <Link href="/shop" className="block text-center px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">
                    Shop recycled products
                  </Link>
                  {!loggedIn && (
                    <Link href="/auth/register" className="block text-center px-5 py-3 rounded-xl border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-50 transition">
                      Create an account
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
