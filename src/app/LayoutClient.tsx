'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import VRPageLoadAnimation from '@/components/VRPageLoadAnimation';
import '@/lib/axios-config';

// sessionStorage key marking that the intro already played in this visit
export const INTRO_SEEN_KEY = 'pp_intro_seen';
const INTRO_DURATION_MS = 5600;

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Decided once, on the first page of the visit: later navigations back to the
  // homepage keep this layout mounted, so the intro never replays.
  const [playIntro, setPlayIntro] = useState(pathname === '/');

  // Read once: Strict Mode re-runs effects and would otherwise see its own write
  const seenBefore = useRef<boolean | null>(null);

  useEffect(() => {
    if (!playIntro) return;
    if (seenBefore.current === null) {
      seenBefore.current = false;
      try {
        seenBefore.current = sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
        sessionStorage.setItem(INTRO_SEEN_KEY, '1');
      } catch { /* storage blocked: just play it this once */ }
    }
    if (seenBefore.current) {
      setPlayIntro(false);
      return;
    }
    const timer = setTimeout(() => setPlayIntro(false), INTRO_DURATION_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          animation: ${playIntro ? 'bodyOverflowHide 5.6s ease-in-out forwards' : 'none'};
          overflow: ${playIntro ? 'hidden' : 'auto'};
          background: transparent;
        }
        /* Set before hydration by the script in the root layout on repeat loads */
        html.intro-seen body {
          animation: none;
          overflow: auto;
        }
        html.intro-seen .vr-animation-container {
          display: none;
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
      {playIntro && (
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
