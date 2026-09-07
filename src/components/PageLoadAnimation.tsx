'use client';

import { useState, useEffect } from 'react';

export default function PageLoadAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes trashToTreasureFade {
          0% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
          40% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
          50% {
            opacity: 0;
            transform: scale(0.5) rotateY(180deg);
          }
          60% {
            opacity: 1;
            transform: scale(1) rotateY(180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateY(180deg);
          }
        }

        @keyframes pageLoadBounceIn {
          0% {
            transform: scale(0) translateY(30px);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) translateY(0);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeOutOverlay {
          0% {
            opacity: 1;
            pointer-events: auto;
          }
          80% {
            opacity: 1;
            pointer-events: auto;
          }
          100% {
            opacity: 0;
            pointer-events: none;
          }
        }

        @keyframes textFadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          30% {
            opacity: 0;
            transform: translateY(10px);
          }
          60% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-load-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, #059669 0%, #10b981 50%, #14b8a6 100%);
          display: flex;
          flex-direction: column;
          items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeOutOverlay 3.5s ease-in-out forwards;
        }

        .trash-treasure-wrapper {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
          animation: pageLoadBounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          margin-bottom: 40px;
        }

        .trash-icon {
          position: absolute;
          font-size: 80px;
          animation: trashToTreasureFade 3s ease-in-out forwards;
        }

        .treasure-icon {
          position: absolute;
          font-size: 80px;
          animation: trashToTreasureFade 3s ease-in-out forwards;
          animation-delay: 0s;
        }

        .treasure-icon:nth-child(2) {
          font-size: 60px;
          opacity: 0;
          animation: trashToTreasureFade 3s ease-in-out forwards;
        }

        .load-text {
          font-size: 28px;
          font-weight: 900;
          color: white;
          text-align: center;
          animation: textFadeIn 3s ease-in-out forwards;
          letter-spacing: 2px;
        }

        .load-subtext {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          margin-top: 12px;
          animation: textFadeIn 3s ease-in-out forwards;
          animation-delay: 0.2s;
          font-weight: 500;
          letter-spacing: 1px;
        }

        .glow-effect {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
          animation: pulse 2s ease-in-out infinite;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.3;
          }
        }
      `}</style>

      <div className="page-load-overlay">
        <div className="trash-treasure-wrapper">
          <div className="glow-effect"></div>
          <div className="trash-icon">🗑️</div>
          <div className="treasure-icon">✨</div>
          <div className="treasure-icon">💎</div>
        </div>
        <div className="load-text">TRASH TO TREASURE</div>
        <div className="load-subtext">Transforming Plastic Waste Into Sustainability</div>
      </div>
    </>
  );
}
