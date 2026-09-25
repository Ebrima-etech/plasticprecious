'use client';

interface ListCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  isDragging?: boolean;
}

export function ListCard({ children, onClick, isDragging = false }: ListCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      {children}
    </div>
  );
}
