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
        body {
          animation: bodyOverflowHide 5.6s ease-in-out forwards;
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
        @keyframes animationFadeOut {
          0% {
            opacity: 1;
            visibility: visible;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }
        .layout-client-content {
          animation: contentFadeIn 0.4s ease-in-out 5.2s forwards;
          opacity: 0;
          visibility: hidden;
        }
        .vr-animation-container {
          animation: animationFadeOut 0.4s ease-in-out 5.2s forwards;
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
