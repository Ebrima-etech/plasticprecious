'use client';

import { HiOutlineEllipsisVertical } from 'react-icons/hi2';

interface DragHandleProps {
  isDragging?: boolean;
}

export function DragHandle({ isDragging = false }: DragHandleProps) {
  return (
    <div className={`flex items-center justify-center w-6 text-slate-400 cursor-grab active:cursor-grabbing transition ${
      isDragging ? 'text-slate-600' : ''
    }`}>
      <HiOutlineEllipsisVertical className="w-5 h-5" />
    </div>
  );
}
