import { ImageResponse } from 'next/og';
import { LEVEL_ICONS, formatAmount, formatKg } from '@/lib/impact';
import { getSharedImpact } from './data';

export const alt = 'My plastic impact with Precious Plastic Gambia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const impact = await getSharedImpact(token);

  const background = 'linear-gradient(135deg, #047857 0%, #065f46 55%, #134e4a 100%)';

  if (!impact) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background, color: 'white', fontSize: 64, fontWeight: 800 }}>
          ♻️ Precious Plastic Gambia
        </div>
      ),
      size
    );
  }

  const { totals, level } = impact;
  const chips = [
    `🍶 ${formatAmount(totals.bottles_equivalent, 0)} bottles`,
    `🌍 ${formatKg(totals.co2_saved_kg)} CO₂ avoided`,
    `🛍️ ${formatAmount(totals.products_bought, 0)} recycled products`,
  ];

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background, color: 'white', padding: '64px 72px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -160, right: -120, width: 520, height: 520, borderRadius: 9999, background: 'rgba(52, 211, 153, 0.18)', display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 700, color: '#a7f3d0', letterSpacing: 2 }}>
            ♻️ PRECIOUS PLASTIC GAMBIA
          </div>

          <div style={{ display: 'flex', fontSize: 40, marginTop: 48, color: '#d1fae5' }}>
            {impact.display_name} has kept
          </div>
          <div style={{ display: 'flex', fontSize: 150, fontWeight: 900, lineHeight: 1, marginTop: 8 }}>
            {formatKg(totals.plastic_kg)}
          </div>
          <div style={{ display: 'flex', fontSize: 40, color: '#d1fae5', marginTop: 12 }}>
            of plastic out of the environment
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginTop: 'auto' }}>
            {chips.map(chip => (
              <div key={chip} style={{ display: 'flex', alignItems: 'center', flexShrink: 0, whiteSpace: 'nowrap', padding: '12px 22px', borderRadius: 18, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', fontSize: 26 }}>
                {chip}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 320 }}>
          <div style={{ display: 'flex', fontSize: 150 }}>{LEVEL_ICONS[level.key] || '🌱'}</div>
          <div style={{ display: 'flex', marginTop: 12, padding: '10px 24px', borderRadius: 9999, background: '#fbbf24', color: '#422006', fontSize: 30, fontWeight: 800, whiteSpace: 'nowrap' }}>
            {level.name}
          </div>
        </div>
      </div>
    ),
    size
  );
}
