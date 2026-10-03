'use client';

import { ProductImpact, LifetimeImpact, plasticTypeLabel, toNumber, formatKg, formatAmount } from '@/lib/impact';

interface ProductImpactPanelProps {
  impact: ProductImpact;
  lifetime?: LifetimeImpact | null;
  quantity: number;
}

// Compact line shown next to the price
export function ProductImpactHighlight({ impact, quantity }: { impact: ProductImpact; quantity: number }) {
  const plastic = toNumber(impact.plastic_recycled_kg) * quantity;
  const co2 = toNumber(impact.co2_saved_kg) * quantity;
  if (!plastic && !co2) return null;

  return (
    <div className="flex items-start gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
      <span className="text-base leading-none">♻️</span>
      <p className="m-0 text-emerald-900">
        {quantity > 1 ? `These ${quantity} items` : 'This item'}
        {plastic > 0 && <> diverts <strong>{formatKg(plastic)}</strong> of plastic</>}
        {plastic > 0 && co2 > 0 && ' and'}
        {co2 > 0 && <> saves <strong>{formatKg(co2)} CO₂</strong></>}.
      </p>
    </div>
  );
}

export default function ProductImpactPanel({ impact, lifetime, quantity }: ProductImpactPanelProps) {
  const plastic = toNumber(impact.plastic_recycled_kg);
  const co2 = toNumber(impact.co2_saved_kg);
  const water = toNumber(impact.water_saved_liters);
  const bottles = impact.bottles_equivalent ?? 0;

  const stats = [
    plastic > 0 && { icon: '♻️', value: formatKg(plastic), label: 'Recycled plastic', sub: 'kept out of landfills and oceans' },
    bottles > 0 && { icon: '🍶', value: formatAmount(bottles, 0), label: 'Plastic bottles', sub: 'equivalent per unit' },
    co2 > 0 && { icon: '🌍', value: formatKg(co2), label: 'CO₂ avoided', sub: 'vs. a virgin-plastic product' },
    water > 0 && { icon: '💧', value: `${formatAmount(water)} L`, label: 'Water saved', sub: 'in production' },
  ].filter(Boolean) as { icon: string; value: string; label: string; sub: string }[];

  if (stats.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-emerald-900 to-teal-800 text-white border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <h3 className="text-sm font-black text-emerald-300 uppercase tracking-wide mb-2">Environmental Impact</h3>
          <h2 className="text-3xl lg:text-4xl font-black mb-3">The difference one purchase makes</h2>
          <p className="m-0 text-emerald-100">
            Every unit is made from recycled plastic
            {impact.plastic_type ? <> (<strong>{plasticTypeLabel(impact.plastic_type)}</strong>)</> : null}
            {impact.plastic_source ? <>, collected from <strong>{impact.plastic_source}</strong></> : null}.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15">
              <div className="text-2xl mb-3">{stat.icon}</div>
              <p className="m-0 text-xl sm:text-2xl lg:text-3xl font-black text-white whitespace-nowrap">{stat.value}</p>
              <p className="m-0 mt-1 text-sm font-semibold text-white">{stat.label}</p>
              <p className="m-0 mt-0.5 text-xs text-emerald-200">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          {quantity > 1 && (plastic > 0 || co2 > 0) && (
            <div className="bg-emerald-950/40 rounded-2xl p-5 border border-white/10">
              <p className="m-0 mb-2 text-xs font-bold text-emerald-300 uppercase tracking-wide">Your selection ({quantity} units)</p>
              <p className="m-0 text-lg font-semibold text-white">
                {plastic > 0 && <>{formatKg(plastic * quantity)} of plastic recycled</>}
                {plastic > 0 && co2 > 0 && ' · '}
                {co2 > 0 && <>{formatKg(co2 * quantity)} CO₂ avoided</>}
              </p>
            </div>
          )}
          {lifetime && lifetime.units_sold > 0 && (
            <div className="bg-emerald-950/40 rounded-2xl p-5 border border-white/10">
              <p className="m-0 mb-2 text-xs font-bold text-emerald-300 uppercase tracking-wide">Community impact so far</p>
              <p className="m-0 text-lg font-semibold text-white">
                {formatAmount(lifetime.units_sold, 0)} sold · {formatKg(lifetime.plastic_kg)} of plastic recycled
                {lifetime.co2_saved_kg > 0 && <> · {formatKg(lifetime.co2_saved_kg)} CO₂ avoided</>}
              </p>
            </div>
          )}
        </div>

        {impact.impact_story && (
          <blockquote className="mt-6 border-l-4 border-emerald-400 pl-4 text-emerald-50 italic max-w-3xl whitespace-pre-line">
            {impact.impact_story}
          </blockquote>
        )}
      </div>
    </section>
  );
}
