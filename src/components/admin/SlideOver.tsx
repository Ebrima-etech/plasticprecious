'use client';

import { useEffect } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function SlideOver({ isOpen, onClose, title, description, children, footer }: SlideOverProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl rounded-l-2xl animate-in slide-in-from-right-full duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200/80">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 -m-2 text-slate-400 hover:text-slate-600 transition"
          >
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-slate-200/80 bg-slate-50 p-6 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
