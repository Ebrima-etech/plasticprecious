import { GiRecycle } from 'react-icons/gi';
import { BiRecycle } from 'react-icons/bi';
import { MdSchool } from 'react-icons/md';
import { FiBriefcase, FiTruck, FiTool, FiUsers } from 'react-icons/fi';

// Services store either a react-icons name (e.g. "BiRecycle") or an emoji typed in the admin
const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  GiRecycle,
  BiRecycle,
  MdSchool,
  FiBriefcase,
  FiTruck,
  FiTool,
  FiUsers,
};

const looksLikeEmoji = (value: string) => /[^\x00-\x7F]/.test(value);

export default function ServiceIcon({ icon, size = 32, className }: { icon?: string | null; size?: number; className?: string }) {
  const value = (icon || '').trim();
  if (value && looksLikeEmoji(value)) {
    return <span className={className} style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true">{value}</span>;
  }
  const Icon = ICONS[value] || GiRecycle;
  return <Icon size={size} className={className} />;
}
