import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BADGE_ICONS, LEVEL_ICONS, formatAmount, formatKg, formatSince } from '@/lib/impact';
import { getSharedImpact } from './data';
import ShareThisPage from './ShareThisPage';

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const impact = await getSharedImpact(token);
  if (!impact) {
    return { title: 'Impact card not found | Precious Plastic Gambia' };
  }
  const title = `${impact.display_name} kept ${formatKg(impact.totals.plastic_kg)} of plastic out of the environment`;
  const description = `That's about ${formatAmount(impact.totals.bottles_equivalent, 0)} plastic bottles, recycled into products by Precious Plastic Gambia. Start your own impact.`;
  return {
    title: `${title} | Precious Plastic Gambia`,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function SharedImpactPage({ params }: Props) {
  const { token } = await params;
  const impact = await getSharedImpact(token);
  if (!impact) notFound();

  const { totals, level, rank, community } = impact;
  const earned = impact.badges.filter(b => b.earned);
  const message = `${impact.display_name} kept ${formatKg(totals.plastic_kg)} of plastic out of the environment with Precious Plastic Gambia ♻️ You can too:`;

  const stats = [
    { icon: '🍶', value: formatAmount(totals.bottles_equivalent, 0), label: 'plastic bottles' },
    { icon: '🌍', value: formatKg(totals.co2_saved_kg), label: 'CO₂ avoided' },
    { icon: '🌳', value: formatAmount(totals.trees_equivalent), label: 'trees for a year' },
    { icon: '🛍️', value: formatAmount(totals.products_bought, 0), label: 'recycled products' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-16 lg:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-bold">
            {LEVEL_ICONS[level.key]} {level.name}
          </span>
          <p className="m-0 mt-8 text-xl text-emerald-100">
            <strong className="text-white">{impact.display_name}</strong> has kept
          </p>
          <p className="m-0 text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight my-2 text-white whitespace-nowrap">{formatKg(totals.plastic_kg)}</p>
          <p className="m-0 text-xl text-emerald-100">
            of plastic out of the environment{impact.since ? <> since {formatSince(impact.since)}</> : null}
          </p>

          {rank && rank.supporters > 1 && (
            <p className="m-0 mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/20 border border-amber-300/30 text-amber-100 font-semibold">
              🏅 Top {rank.top_percent}% of {formatAmount(rank.supporters, 0)} supporters
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 text-left">
            {stats.map(stat => (
              <div key={stat.label} className="rounded-2xl bg-white/10 border border-white/15 px-4 py-4">
                <p className="m-0 text-2xl">{stat.icon}</p>
                <p className="m-0 mt-1 text-2xl font-black text-white whitespace-nowrap">{stat.value}</p>
                <p className="m-0 text-xs text-emerald-100">{stat.label}</p>
              </div>
            ))}
          </div>

          {earned.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {earned.map(badge => (
                <span key={badge.key} title={badge.description} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-emerald-900 text-sm font-bold">
                  {BADGE_ICONS[badge.key] || '🏅'} {badge.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <ShareThisPage message={message} imagePath={`/impact/share/${encodeURIComponent(token)}/opengraph-image`} />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Start your own impact</h2>
          <p className="text-lg text-slate-600 mb-8">
            Every product in our shop is made from plastic collected in The Gambia. Join {formatAmount(community.supporters, 0)} supporters
            who have already helped divert {formatKg(community.plastic_diverted_kg)} of plastic.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">
              Shop recycled products
            </Link>
            <Link href="/impact" className="px-8 py-4 rounded-xl border-2 border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-50 transition">
              See our community impact
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
