// "Ways to volunteer" cards on Get Involved (managed in Admin > Insights > Volunteering)
import { FiBarChart2, FiBook, FiDroplet, FiGift, FiGlobe, FiHeart, FiTool, FiUsers } from 'react-icons/fi';

export interface VolunteerOpportunity {
  id?: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  is_active: boolean;
}

export const VOLUNTEER_ICONS: Record<string, { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  droplet: { label: 'Water / beach', Icon: FiDroplet },
  tool: { label: 'Tools / workshop', Icon: FiTool },
  book: { label: 'Education', Icon: FiBook },
  chart: { label: 'Fundraising / growth', Icon: FiBarChart2 },
  users: { label: 'Community', Icon: FiUsers },
  heart: { label: 'Care', Icon: FiHeart },
  gift: { label: 'Donations', Icon: FiGift },
  globe: { label: 'Environment', Icon: FiGlobe },
};

export const VOLUNTEER_COLORS: Record<string, { label: string; gradient: string }> = {
  blue: { label: 'Blue', gradient: 'from-blue-500 to-cyan-600' },
  emerald: { label: 'Green', gradient: 'from-emerald-500 to-teal-600' },
  purple: { label: 'Purple', gradient: 'from-purple-500 to-pink-600' },
  orange: { label: 'Orange', gradient: 'from-orange-500 to-amber-600' },
  rose: { label: 'Rose', gradient: 'from-rose-500 to-red-600' },
  teal: { label: 'Teal', gradient: 'from-teal-500 to-emerald-700' },
};

// Shown until the admin list loads (same as the original hardcoded cards)
export const DEFAULT_VOLUNTEER_OPPORTUNITIES: VolunteerOpportunity[] = [
  { title: 'Beach Cleanups', description: 'Join coastal collection drives', icon: 'droplet', color: 'blue', order: 0, is_active: true },
  { title: 'Workshops', description: 'Learn our recycling process', icon: 'tool', color: 'emerald', order: 1, is_active: true },
  { title: 'Education', description: 'Teach circular economy', icon: 'book', color: 'purple', order: 2, is_active: true },
  { title: 'Fundraising', description: 'Support our initiatives', icon: 'chart', color: 'orange', order: 3, is_active: true },
];
