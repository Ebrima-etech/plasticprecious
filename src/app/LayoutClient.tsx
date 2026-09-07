'use client';

import VRPageLoadAnimation from '@/components/VRPageLoadAnimation';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        body {
          overflow: hidden;
        }
        @keyframes contentFadeIn {
          0% {
            opacity: 0;
            visibility: hidden;
          }
          100% {
            opacity: 1;
            visibility: visible;
          }
        }
        .layout-client-content {
          animation: contentFadeIn 0.3s ease-in-out 5.5s forwards;
          opacity: 0;
          visibility: hidden;
        }
      `}</style>
      <VRPageLoadAnimation />
      <div className="layout-client-content">
        {children}
      </div>
    </>
  );
}
