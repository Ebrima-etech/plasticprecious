'use client';

import { useState } from 'react';
import SponsorshipModal from './SponsorshipModal';

interface SponsorButtonProps {
  children?: React.ReactNode;
  className?: string;
  initialCount?: number;
}

// Drop-in "Sponsor Now" button that opens the sponsorship form
export default function SponsorButton({ children = 'Sponsor Now', className, initialCount }: SponsorButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? 'px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition'}
      >
        {children}
      </button>
      <SponsorshipModal open={open} onClose={() => setOpen(false)} initialCount={initialCount} />
    </>
  );
}
