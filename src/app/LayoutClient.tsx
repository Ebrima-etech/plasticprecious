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
          animation: bodyOverflowHide 5.6s ease-in-out forwards;
          overflow: hidden;
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
        }
      `}</style>
      <div className="vr-animation-container">
        <VRPageLoadAnimation />
      </div>
      <div className="layout-client-content">
        {children}
      </div>
    </>
  );
}
