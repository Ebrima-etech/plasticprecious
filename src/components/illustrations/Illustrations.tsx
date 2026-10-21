// Flat, hand-drawn style illustrations for the Impact and Services cards.
// Every scene uses a 240x160 canvas and sits on a pastel panel (see IllustrationCard).

import type { ReactNode } from 'react';

const SKIN = ['#8d5a3b', '#6b4329', '#a16b47'];
const HAIR = '#1c1612';
const INK = '#0f172a';

interface PersonProps {
  x: number;
  y: number; // feet
  skin?: string;
  shirt: string;
  pants?: string;
  wrap?: string; // head wrap colour instead of hair
  scale?: number;
  children?: ReactNode; // arms or held items, drawn in the person's local frame
}

// A standing person whose feet are at (x, y); local frame has feet at (0, 0)
function Person({ x, y, skin = SKIN[0], shirt, pants = '#334155', wrap, scale = 1, children }: PersonProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-8} y={-28} width={7} height={27} rx={3} fill={pants} />
      <rect x={1} y={-28} width={7} height={27} rx={3} fill={pants} />
      <ellipse cx={-5} cy={-1} rx={6} ry={2.5} fill={INK} />
      <ellipse cx={5} cy={-1} rx={6} ry={2.5} fill={INK} />
      <rect x={-12} y={-56} width={24} height={32} rx={9} fill={shirt} />
      <rect x={-3} y={-62} width={6} height={7} fill={skin} />
      <circle cx={0} cy={-68} r={9.5} fill={skin} />
      {wrap ? (
        <path d="M-11 -70 Q-10 -84 0 -84 Q11 -84 11 -70 Q4 -74 -11 -70 Z" fill={wrap} />
      ) : (
        <path d="M-9.5 -69 Q-10 -79 0 -79 Q10 -79 9.5 -69 Q6 -74 0 -74 Q-6 -74 -9.5 -69 Z" fill={HAIR} />
      )}
      {children}
    </g>
  );
}

// An arm from the shoulder to a hand point, in the person's local frame
function Arm({ to, from = [-9, -50], color, skin = SKIN[0] }: { to: [number, number]; from?: [number, number]; color: string; skin?: string }) {
  return (
    <g>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={color} strokeWidth={6.5} strokeLinecap="round" />
      <circle cx={to[0]} cy={to[1]} r={3.6} fill={skin} />
    </g>
  );
}

// Three chasing arrows
function RecycleMark({ cx, cy, r, color, width = 4 }: { cx: number; cy: number; r: number; color: string; width?: number }) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (deg: number, radius = r) => [cx + radius * Math.cos(rad(deg)), cy + radius * Math.sin(rad(deg))];
  return (
    <g>
      {[0, 120, 240].map(base => {
        const a0 = base - 80;
        const a1 = base + 15;
        const [x0, y0] = pt(a0);
        const [x1, y1] = pt(a1);
        const tip = pt(a1 + 22);
        const outer = pt(a1, r + width * 1.4);
        const inner = pt(a1, r - width * 1.4);
        return (
          <g key={base}>
            <path d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
            <path d={`M${outer[0]} ${outer[1]} L${tip[0]} ${tip[1]} L${inner[0]} ${inner[1]} Z`} fill={color} />
          </g>
        );
      })}
    </g>
  );
}

function Bottle({ x, y, rotate = 0, color = '#7dd3fc' }: { x: number; y: number; rotate?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <rect x={-5} y={-8} width={10} height={18} rx={4} fill={color} opacity={0.9} />
      <rect x={-2.5} y={-13} width={5} height={6} rx={1.5} fill={color} />
      <rect x={-3} y={-15} width={6} height={3} rx={1} fill="#2563eb" />
      <rect x={-5} y={-1} width={10} height={4} fill="#ffffff" opacity={0.6} />
    </g>
  );
}

function Ground({ color = 'rgba(15,23,42,0.07)' }: { color?: string }) {
  return <ellipse cx={120} cy={142} rx={104} ry={9} fill={color} />;
}

function Svg({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 240 160" role="img" aria-label={label} className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <title>{label}</title>
      {children}
    </svg>
  );
}

/* ---------------- Services ---------------- */

export function CollectionIllustration() {
  return (
    <Svg label="A volunteer collecting plastic bottles into a recycling bin">
      <Ground />
      {/* Bin */}
      <path d="M150 78 L196 78 L190 138 L156 138 Z" fill="#2563eb" />
      <rect x={146} y={70} width={54} height={10} rx={4} fill="#1d4ed8" />
      <rect x={166} y={64} width={14} height={7} rx={3} fill="#1d4ed8" />
      <RecycleMark cx={173} cy={106} r={11} color="#ffffff" width={3} />
      {/* Bottles on the ground */}
      <Bottle x={34} y={132} rotate={-70} />
      <Bottle x={58} y={134} rotate={80} color="#a7f3d0" />
      <Bottle x={126} y={133} rotate={-100} color="#fde68a" />
      {/* Bottle about to drop in */}
      <Bottle x={170} y={50} rotate={20} color="#a7f3d0" />
      {/* Person with a sack */}
      <Person x={100} y={138} shirt="#10b981" pants="#1e3a8a">
        <path d="M-40 -34 Q-44 -6 -30 -2 L-16 -2 Q-4 -6 -10 -34 Z" fill="#e7d3b0" />
        <path d="M-40 -34 Q-25 -40 -10 -34" fill="none" stroke="#b08d5b" strokeWidth={2.5} />
        <Bottle x={-30} y={-38} rotate={-15} />
        <Bottle x={-20} y={-40} rotate={12} color="#fde68a" />
        <Arm from={[-9, -50]} to={[-24, -36]} color="#10b981" />
        <Arm from={[9, -50]} to={[34, -70]} color="#10b981" />
      </Person>
    </Svg>
  );
}

export function RecyclingIllustration() {
  return (
    <Svg label="Plastic bottles going into a shredder and coming out as coloured flakes">
      <Ground />
      {/* Bottles dropping in */}
      <Bottle x={108} y={18} rotate={-20} />
      <Bottle x={128} y={24} rotate={25} color="#fde68a" />
      {/* Machine */}
      <path d="M92 38 L148 38 L138 60 L102 60 Z" fill="#64748b" />
      <rect x={84} y={60} width={72} height={70} rx={8} fill="#334155" />
      <rect x={84} y={128} width={72} height={8} rx={3} fill="#1e293b" />
      <circle cx={120} cy={92} r={16} fill="#10b981" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={117} y={72} width={6} height={8} rx={1.5} fill="#10b981" transform={`rotate(${i * 45} 120 92)`} />
      ))}
      <circle cx={120} cy={92} r={6} fill="#334155" />
      <circle cx={96} cy={118} r={3} fill="#f59e0b" />
      <circle cx={106} cy={118} r={3} fill="#ef4444" />
      {/* Chute and flakes */}
      <path d="M156 100 L182 112 L182 118 L156 110 Z" fill="#475569" />
      <rect x={176} y={126} width={44} height={12} rx={4} fill="#cbd5e1" />
      {[[184, 120, '#10b981'], [194, 116, '#3b82f6'], [204, 121, '#f59e0b'], [190, 126, '#ef4444'], [208, 128, '#8b5cf6'], [199, 124, '#10b981'], [186, 106, '#f59e0b'], [192, 98, '#3b82f6']].map(([x, y, c], i) => (
        <rect key={i} x={x as number} y={y as number} width={5} height={5} rx={1} fill={c as string} transform={`rotate(${i * 25} ${x} ${y})`} />
      ))}
      {/* Operator */}
      <Person x={48} y={138} shirt="#f59e0b" pants="#334155" skin={SKIN[1]}>
        <Arm from={[9, -50]} to={[44, -20]} color="#f59e0b" skin={SKIN[1]} />
        <Arm from={[-9, -50]} to={[-16, -28]} color="#f59e0b" skin={SKIN[1]} />
      </Person>
    </Svg>
  );
}

export function WorkshopIllustration() {
  return (
    <Svg label="A trainer teaching a recycling workshop to learners">
      {/* Board */}
      <line x1={44} y1={96} x2={36} y2={130} stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" />
      <line x1={118} y1={96} x2={126} y2={130} stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" />
      <rect x={28} y={22} width={106} height={76} rx={6} fill="#ffffff" stroke="#cbd5e1" strokeWidth={2} />
      <RecycleMark cx={58} cy={58} r={16} color="#10b981" width={4} />
      <rect x={84} y={42} width={38} height={5} rx={2.5} fill="#cbd5e1" />
      <rect x={84} y={54} width={30} height={5} rx={2.5} fill="#cbd5e1" />
      <rect x={84} y={66} width={34} height={5} rx={2.5} fill="#fcd34d" />
      <rect x={84} y={78} width={24} height={5} rx={2.5} fill="#cbd5e1" />
      {/* Trainer */}
      <Person x={166} y={134} shirt="#8b5cf6" pants="#3f3f46" wrap="#f59e0b" skin={SKIN[2]}>
        <Arm from={[-9, -50]} to={[-30, -70]} color="#8b5cf6" skin={SKIN[2]} />
        <Arm from={[9, -50]} to={[14, -28]} color="#8b5cf6" skin={SKIN[2]} />
      </Person>
      {/* Learners, seen from behind */}
      {[[54, '#0ea5e9', SKIN[1]], [96, '#ef4444', SKIN[0]], [212, '#10b981', SKIN[2]]].map(([x, c, s], i) => (
        <g key={i}>
          <path d={`M${(x as number) - 17} 160 Q${(x as number) - 17} 136 ${x} 136 Q${(x as number) + 17} 136 ${(x as number) + 17} 160 Z`} fill={c as string} />
          <circle cx={x as number} cy={128} r={9} fill={s as string} />
          <path d={`M${(x as number) - 9} 127 Q${(x as number) - 9} 118 ${x} 118 Q${(x as number) + 9} 118 ${(x as number) + 9} 127 Z`} fill={HAIR} />
        </g>
      ))}
    </Svg>
  );
}

export function ConsultancyIllustration() {
  return (
    <Svg label="Two people planning a waste management strategy at a table">
      {/* Idea */}
      <g transform="translate(120 26)">
        <circle cx={0} cy={0} r={13} fill="#fcd34d" />
        <rect x={-6} y={11} width={12} height={8} rx={2} fill="#94a3b8" />
        {[0, 45, 135, 180, 225, 315].map(a => (
          <line key={a} x1={0} y1={-19} x2={0} y2={-25} stroke="#f59e0b" strokeWidth={3} strokeLinecap="round" transform={`rotate(${a})`} />
        ))}
      </g>
      {/* People behind the table */}
      <Person x={70} y={128} shirt="#0ea5e9" skin={SKIN[1]}>
        <Arm from={[9, -50]} to={[30, -42]} color="#0ea5e9" skin={SKIN[1]} />
      </Person>
      <Person x={176} y={128} shirt="#10b981" wrap="#ef4444" skin={SKIN[2]}>
        <Arm from={[-9, -50]} to={[-30, -44]} color="#10b981" skin={SKIN[2]} />
      </Person>
      {/* Desk */}
      <ellipse cx={120} cy={146} rx={96} ry={6} fill="rgba(15,23,42,0.07)" />
      <rect x={34} y={104} width={172} height={9} rx={3} fill="#a16207" />
      <rect x={42} y={112} width={156} height={32} rx={3} fill="#ca8a04" />
      <rect x={52} y={120} width={136} height={3} rx={1.5} fill="#a16207" opacity={0.5} />
      {/* Laptop with chart */}
      <rect x={96} y={62} width={50} height={36} rx={4} fill="#1e293b" />
      <rect x={100} y={66} width={42} height={28} rx={2} fill="#f8fafc" />
      <rect x={106} y={82} width={6} height={9} fill="#10b981" />
      <rect x={116} y={76} width={6} height={15} fill="#10b981" />
      <rect x={126} y={70} width={6} height={21} fill="#10b981" />
      <path d="M90 98 L152 98 L156 104 L86 104 Z" fill="#475569" />
      {/* Clipboard */}
      <rect x={146} y={88} width={16} height={15} rx={2} fill="#fde68a" transform="rotate(-8 154 95)" />
      <path d="M149 93 l2 2 l4 -5 M149 99 l2 2 l4 -5" stroke="#15803d" strokeWidth={1.6} fill="none" strokeLinecap="round" transform="rotate(-8 154 95)" />
    </Svg>
  );
}

export function ServiceFallbackIllustration() {
  return (
    <Svg label="Recycling">
      <Ground />
      <circle cx={120} cy={78} r={46} fill="#ffffff" />
      <RecycleMark cx={120} cy={78} r={28} color="#10b981" width={7} />
      <Bottle x={56} y={124} rotate={-20} />
      <Bottle x={184} y={124} rotate={18} color="#fde68a" />
    </Svg>
  );
}

/* ---------------- Impact ---------------- */

export function EnvironmentIllustration() {
  return (
    <Svg label="A healthy planet with a sprouting plant and clean ocean">
      <circle cx={204} cy={30} r={14} fill="#fcd34d" />
      <circle cx={120} cy={86} r={50} fill="#38bdf8" />
      <path d="M86 62 Q98 50 112 58 Q120 70 106 78 Q94 82 88 74 Z" fill="#22c55e" />
      <path d="M128 92 Q146 84 158 96 Q156 116 138 120 Q124 112 128 92 Z" fill="#22c55e" />
      <path d="M92 104 Q100 100 106 108 Q102 116 94 114 Z" fill="#22c55e" />
      {/* Sprout */}
      <path d="M120 36 L120 18" stroke="#15803d" strokeWidth={3} strokeLinecap="round" />
      <path d="M120 24 Q106 12 98 20 Q108 30 120 24 Z" fill="#22c55e" />
      <path d="M120 20 Q134 6 144 14 Q134 26 120 20 Z" fill="#4ade80" />
      {/* Orbit of recycling arrows */}
      <path d="M52 112 Q30 86 58 60" fill="none" stroke="#10b981" strokeWidth={4} strokeLinecap="round" strokeDasharray="2 8" />
      <path d="M188 60 Q210 86 182 112" fill="none" stroke="#10b981" strokeWidth={4} strokeLinecap="round" strokeDasharray="2 8" />
      <path d="M54 54 L66 58 L58 66 Z" fill="#10b981" />
      <path d="M186 118 L174 114 L182 106 Z" fill="#10b981" />
      {/* Fish */}
      <g transform="translate(140 72)">
        <ellipse cx={0} cy={0} rx={7} ry={4} fill="#fb923c" />
        <path d="M6 0 L12 -4 L12 4 Z" fill="#fb923c" />
      </g>
      <Bottle x={32} y={140} rotate={-60} color="#cbd5e1" />
      <line x1={22} y1={128} x2={44} y2={152} stroke="#ef4444" strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}

export function EconomicIllustration() {
  return (
    <Svg label="An artisan showing a chair made from recycled plastic, with income growing">
      <Ground />
      {/* Recycled chair */}
      <g transform="translate(104 78)">
        <rect x={0} y={0} width={10} height={60} rx={3} fill="#0ea5e9" />
        <rect x={0} y={30} width={44} height={10} rx={3} fill="#10b981" />
        <rect x={36} y={40} width={8} height={20} rx={3} fill="#0ea5e9" />
        <rect x={6} y={4} width={4} height={4} fill="#fde68a" />
        <rect x={20} y={33} width={4} height={4} fill="#fde68a" />
        <rect x={30} y={34} width={3} height={3} fill="#ef4444" />
        <rect x={3} y={18} width={3} height={3} fill="#ef4444" />
      </g>
      {/* Artisan */}
      <Person x={74} y={138} shirt="#f97316" pants="#1e293b" skin={SKIN[1]}>
        <Arm from={[9, -50]} to={[30, -42]} color="#f97316" skin={SKIN[1]} />
        <Arm from={[-9, -50]} to={[-18, -30]} color="#f97316" skin={SKIN[1]} />
      </Person>
      {/* Coins and growth */}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <ellipse cx={192} cy={134 - i * 7} rx={16} ry={5} fill="#d97706" />
          <ellipse cx={192} cy={132 - i * 7} rx={16} ry={5} fill="#fbbf24" />
        </g>
      ))}
      <text x={186} y={113} fontSize={9} fontWeight={800} fill="#92400e">D</text>
      <path d="M160 80 L178 62 L190 70 L214 44" fill="none" stroke="#10b981" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M204 42 L216 42 L216 54 Z" fill="#10b981" />
    </Svg>
  );
}

export function EducationIllustration() {
  return (
    <Svg label="Two children reading a book about recycling">
      <Ground />
      {/* Speech bubble with a leaf */}
      <path d="M150 18 h52 a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-30 l-10 10 v-10 h-12 a8 8 0 0 1 -8 -8 v-22 a8 8 0 0 1 8 -8 Z" fill="#ffffff" />
      <path d="M166 46 Q164 28 190 26 Q190 48 166 46 Z" fill="#22c55e" />
      <path d="M168 44 L184 30" stroke="#15803d" strokeWidth={1.5} />
      {/* Children */}
      <Person x={88} y={138} shirt="#8b5cf6" pants="#1e3a8a" skin={SKIN[0]} scale={0.82}>
        <Arm from={[9, -50]} to={[26, -40]} color="#8b5cf6" />
      </Person>
      <Person x={152} y={138} shirt="#ef4444" pants="#334155" skin={SKIN[2]} wrap="#fcd34d" scale={0.82}>
        <Arm from={[-9, -50]} to={[-26, -40]} color="#ef4444" skin={SKIN[2]} />
      </Person>
      {/* Open book */}
      <path d="M120 112 Q104 104 92 108 L92 82 Q106 78 120 86 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth={1.5} />
      <path d="M120 112 Q136 104 148 108 L148 82 Q134 78 120 86 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth={1.5} />
      <RecycleMark cx={106} cy={95} r={6} color="#10b981" width={2} />
      <rect x={126} y={90} width={16} height={2.5} rx={1} fill="#cbd5e1" />
      <rect x={126} y={96} width={12} height={2.5} rx={1} fill="#cbd5e1" />
      <rect x={126} y={102} width={14} height={2.5} rx={1} fill="#cbd5e1" />
      {/* Stars */}
      <path d="M48 40 l3 7 l7 1 l-5 5 l1 7 l-6 -3 l-6 3 l1 -7 l-5 -5 l7 -1 Z" fill="#fbbf24" />
      <circle cx={70} cy={24} r={3} fill="#fbbf24" />
    </Svg>
  );
}

export function HealthIllustration() {
  return (
    <Svg label="A family breathing clean air in a healthier community">
      <Ground />
      {/* Heart with leaf */}
      <path d="M164 52 C164 36 186 32 190 48 C194 32 216 36 216 52 C216 70 190 84 190 84 C190 84 164 70 164 52 Z" fill="#f43f5e" />
      <path d="M180 62 Q180 46 200 44 Q200 64 180 62 Z" fill="#ffffff" />
      {/* Clean air swirls */}
      <path d="M24 40 q14 -10 28 0 t28 0" fill="none" stroke="#7dd3fc" strokeWidth={3} strokeLinecap="round" />
      <path d="M40 58 q12 -8 24 0 t24 0" fill="none" stroke="#bae6fd" strokeWidth={3} strokeLinecap="round" />
      {/* Tree */}
      <rect x={196} y={104} width={7} height={34} rx={2} fill="#92400e" />
      <circle cx={200} cy={100} r={16} fill="#22c55e" />
      {/* Family */}
      <Person x={80} y={138} shirt="#0ea5e9" pants="#1e293b" skin={SKIN[1]}>
        <Arm from={[9, -50]} to={[24, -34]} color="#0ea5e9" skin={SKIN[1]} />
      </Person>
      <Person x={150} y={138} shirt="#f43f5e" pants="#334155" wrap="#8b5cf6" skin={SKIN[2]}>
        <Arm from={[-9, -50]} to={[-24, -34]} color="#f43f5e" skin={SKIN[2]} />
      </Person>
      <Person x={115} y={138} shirt="#fbbf24" pants="#1e3a8a" skin={SKIN[0]} scale={0.62} />
    </Svg>
  );
}

/* ---------------- Card shell ---------------- */

export const ILLUSTRATION_TONES = {
  emerald: { panel: 'bg-emerald-50', pill: 'bg-emerald-600' },
  sky: { panel: 'bg-sky-50', pill: 'bg-sky-600' },
  amber: { panel: 'bg-amber-50', pill: 'bg-amber-500' },
  violet: { panel: 'bg-violet-50', pill: 'bg-violet-600' },
  rose: { panel: 'bg-rose-50', pill: 'bg-rose-500' },
  teal: { panel: 'bg-teal-50', pill: 'bg-teal-600' },
} as const;

export type IllustrationTone = keyof typeof ILLUSTRATION_TONES;

// Picks the service illustration from its name (services are managed in the admin)
export function serviceIllustration(name: string): { Illustration: () => ReactNode; tone: IllustrationTone; audience: string } {
  const n = name.toLowerCase();
  if (n.includes('collect')) return { Illustration: CollectionIllustration, tone: 'sky', audience: 'For communities' };
  if (n.includes('recycl')) return { Illustration: RecyclingIllustration, tone: 'emerald', audience: 'For everyone' };
  if (n.includes('workshop') || n.includes('train') || n.includes('educat')) return { Illustration: WorkshopIllustration, tone: 'amber', audience: 'For schools & groups' };
  if (n.includes('consult') || n.includes('advis')) return { Illustration: ConsultancyIllustration, tone: 'violet', audience: 'For organisations' };
  return { Illustration: ServiceFallbackIllustration, tone: 'teal', audience: 'Service' };
}
