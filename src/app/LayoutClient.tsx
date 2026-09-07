'use client';

import VRPageLoadAnimation from '@/components/VRPageLoadAnimation';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VRPageLoadAnimation />
      {children}
    </>
  );
}
