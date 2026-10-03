'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { ShimmerSkeleton } from '@/components/ShimmerSkeleton';
import ShareButtons from '@/components/impact/ShareButtons';
import {
  BADGE_ICONS, CustomerImpact, LEVEL_ICONS, formatAmount, formatKg, formatSince, shareMessage, shareUrlFor,
} from '@/lib/impact';

export default function MyImpact() {
  const [impact, setImpact] = useState<CustomerImpact | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
    axios
      .get(`${API_BASE_URL}/impact/me/`, { headers: { Authorization: `Bearer ${getAccessToken()}` } })
      .then(res => setImpact(res.data))
      .catch(err => {
        console.error('Failed to load your impact:', err);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ShimmerSkeleton className="w-full h-80 rounded-3xl mb-8" />;
  }
  if (!impact) {
    // Keep the section visible so customers know it exists, even if the data couldn't load
    return failed ? (
      <div className="mb-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="text-5xl">🌱</div>
        <div className="flex-1">
          <p className="m-0 text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">My Impact</p>
          <p className="m-0 text-slate-700">
            We couldn’t load your impact right now. Please refresh in a moment. Every recycled product you buy adds to it.
          </p>
        </div>
        <Link href="/shop" className="inline-flex justify-center px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">
          Shop recycled products
        </Link>
      </div>
    ) : null;
  }

  const { totals, level, next_level: nextLevel, rank, community } = impact;
  const shareUrl = impact.share_token && origin ? shareUrlFor(impact.share_token, origin) : '';
  const earnedBadges = impact.badges.filter(b => b.earned).length;

  if (!impact.has_impact) {
    return (
      <div className="mb-8 rounded-3xl overflow-hidden border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="text-6xl">🌱</div>
          <div className="flex-1">
            <p className="m-0 text-xs font-black text-emerald-700 uppercase tracking-widest mb-2">My Impact</p>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">Your impact story starts with one product</h2>
            <p className="m-0 text-slate-600">
              Every recycled product you buy keeps plastic out of our beaches and streets. Together our community has already
              diverted <strong className="text-slate-900">{formatKg(community.plastic_diverted_kg)}</strong> of plastic.
              {impact.pending && impact.pending.plastic_kg > 0 && (
                <> Your pending orders will add <strong className="text-emerald-700">{formatKg(impact.pending.plastic_kg)}</strong> once confirmed.</>
              )}
            </p>
          </div>
          <Link href="/shop" className="inline-flex justify-center px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">
            Shop recycled products
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: '🍶', value: formatAmount(totals.bottles_equivalent, 0), label: 'plastic bottles' },
    { icon: '🌍', value: formatKg(totals.co2_saved_kg), label: 'CO₂ avoided' },
    { icon: '🌳', value: formatAmount(totals.trees_equivalent), label: 'trees for a year' },
    { icon: '🛍️', value: formatAmount(totals.products_bought, 0), label: 'products bought' },
  ];

  return (
    <div className="mb-8 space-y-6">
      {/* Hero impact card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white shadow-xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative p-8 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="m-0 text-xs font-black text-emerald-200 uppercase tracking-widest">My Impact</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-bold">
              <span>{LEVEL_ICONS[level.key]}</span> {level.name}
            </span>
          </div>

          <p className="m-0 text-emerald-100 text-lg">You have kept</p>
          <p className="m-0 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight my-1 text-white whitespace-nowrap">{formatKg(totals.plastic_kg)}</p>
          <p className="m-0 text-emerald-100 text-lg">
            of plastic out of the environment{impact.since ? <> since {formatSince(impact.since)}</> : null}.
          </p>

          {rank && rank.supporters > 1 && (
            <p className="m-0 mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/20 border border-amber-300/30 text-amber-100 text-sm font-semibold">
              🏅 Top {rank.top_percent}% of {formatAmount(rank.supporters, 0)} Precious Plastic supporters
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {stats.map(stat => (
              <div key={stat.label} className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                <p className="m-0 text-xl">{stat.icon}</p>
                <p className="m-0 mt-1 text-2xl font-black text-white whitespace-nowrap">{stat.value}</p>
                <p className="m-0 text-xs text-emerald-100">{stat.label}</p>
              </div>
            ))}
          </div>

          {nextLevel && (
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-white">
                  {formatKg(nextLevel.remaining_kg)} to {LEVEL_ICONS[nextLevel.key]} {nextLevel.name}
                </span>
                <span className="text-emerald-200">{formatKg(nextLevel.min_kg)}</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-amber-300"
                  style={{ width: `${Math.min(100, Math.max(4, nextLevel.progress * 100))}%` }}
                />
              </div>
            </div>
          )}

          {impact.pending && impact.pending.plastic_kg > 0 && (
            <p className="m-0 mt-4 text-sm text-emerald-100">
              ⏳ {formatKg(impact.pending.plastic_kg)} more on the way once your pending orders are confirmed.
            </p>
          )}

          {shareUrl && (
            <div className="mt-8 pt-6 border-t border-white/15">
              <p className="m-0 font-bold text-white mb-1">Inspire others to join 🌍</p>
              <p className="m-0 text-sm text-emerald-100 mb-4">
                Share your impact card. It shows your first name and your numbers, nothing else.
              </p>
              <ShareButtons
                url={shareUrl}
                message={shareMessage(impact)}
                imageUrl={`/impact/share/${encodeURIComponent(impact.share_token!)}/opengraph-image`}
                tone="dark"
              />
              <Link href={shareUrl.replace(origin, '')} className="inline-block mt-3 text-sm text-emerald-200 underline hover:text-white">
                Preview my public impact card
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-baseline justify-between mb-6">
          <h3 className="text-xl font-black text-slate-900">Badges</h3>
          <span className="text-sm font-semibold text-slate-500">{earnedBadges} of {impact.badges.length} earned</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {impact.badges.map(badge => (
            <div
              key={badge.key}
              title={badge.description}
              className={`rounded-2xl p-4 text-center border transition ${
                badge.earned
                  ? 'bg-gradient-to-b from-amber-50 to-emerald-50 border-amber-200'
                  : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
              }`}
            >
              <div className="text-3xl mb-2">{BADGE_ICONS[badge.key] || '🏅'}</div>
              <p className="m-0 text-sm font-bold text-slate-900">{badge.name}</p>
              <p className="m-0 text-[11px] text-slate-500 mt-1 leading-snug">{badge.earned ? badge.description : `🔒 ${badge.description}`}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-product breakdown + community */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-xl font-black text-slate-900 mb-5">What made the difference</h3>
          <div className="divide-y divide-slate-100">
            {(impact.products || []).map(p => (
              <div key={p.product_id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <Link href={`/shop/${p.product_id}`} className="font-semibold text-slate-900 hover:text-emerald-700 truncate block">{p.name}</Link>
                  <p className="m-0 text-xs text-slate-500">{p.units} bought</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="m-0 font-bold text-emerald-700">{formatKg(p.plastic_kg)}</p>
                  {p.co2_saved_kg > 0 && <p className="m-0 text-xs text-slate-500">{formatKg(p.co2_saved_kg)} CO₂</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-8 bg-gradient-to-br from-amber-50 to-emerald-50 border border-emerald-200">
          <h3 className="text-xl font-black text-slate-900 mb-3">Together we’re stronger</h3>
          <p className="m-0 text-slate-700 text-sm leading-relaxed">
            You’re one of <strong>{formatAmount(community.supporters, 0)}</strong> supporters who have helped divert{' '}
            <strong>{formatKg(community.plastic_diverted_kg)}</strong> of plastic so far.
          </p>
          <Link href="/impact" className="inline-block mt-4 text-sm font-bold text-emerald-700 hover:text-emerald-800">
            See our community impact →
          </Link>
          <Link href="/shop" className="block mt-6 text-center px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">
            Grow my impact
          </Link>
        </div>
      </div>
    </div>
  );
}
