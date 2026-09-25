'use client';

import { useState, useRef, useEffect } from 'react';
import { HiOutlineEllipsisVertical, HiOutlineEye, HiOutlinePencil, HiOutlineTrash, HiOutlineDocumentDuplicate } from 'react-icons/hi2';

interface CMSActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onPreview?: () => void;
}

export function CMSActionMenu({ onEdit, onDelete, onDuplicate, onPreview }: CMSActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
      >
        <HiOutlineEllipsisVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {onPreview && (
            <button
              onClick={() => {
                onPreview();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition"
            >
              <HiOutlineEye className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium">Preview</span>
            </button>
          )}
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition"
          >
            <HiOutlinePencil className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium">Edit</span>
          </button>
          {onDuplicate && (
            <button
              onClick={() => {
                onDuplicate();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition"
            >
              <HiOutlineDocumentDuplicate className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium">Duplicate</span>
            </button>
          )}
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 text-red-600 hover:bg-red-50 transition"
          >
            <HiOutlineTrash className="w-4 h-4" />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
