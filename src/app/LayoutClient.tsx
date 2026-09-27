'use client';

import { usePathname } from 'next/navigation';
import VRPageLoadAnimation from '@/components/VRPageLoadAnimation';
import '@/lib/axios-config';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <>
      <style>{`
        @keyframes bodyOverflowHide {
          0% {
            overflow: hidden;
          }
          99% {
            overflow: hidden;
          }
          100% {
            overflow: auto;
          }
        }
        html {
          background: transparent;
        }
        body {
          animation: ${isLandingPage ? 'bodyOverflowHide 5.6s ease-in-out forwards' : 'none'};
          overflow: ${isLandingPage ? 'hidden' : 'auto'};
          background: transparent;
        }
        @keyframes hideAnimation {
          0%, 99% {
            opacity: 1;
            visibility: visible;
          }
          100% {
            opacity: 1;
            visibility: hidden;
            pointer-events: none;
          }
        }
        .layout-client-content {
          opacity: 1;
          visibility: visible;
        }
        .vr-animation-container {
          animation: hideAnimation 0.1s ease-out 5.2s forwards;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 99999;
          display: ${isLandingPage ? 'block' : 'none'};
        }
      `}</style>
      {isLandingPage && (
        <div className="vr-animation-container">
          <VRPageLoadAnimation />
        </div>
      )}
      <div className="layout-client-content">
        {children}
      </div>
    </>
  );
}
