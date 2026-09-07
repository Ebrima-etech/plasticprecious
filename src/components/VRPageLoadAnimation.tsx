'use client';

import { useState, useEffect } from 'react';

export default function VRPageLoadAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Generate particles only on client to avoid hydration mismatch
    const generatedParticles = Array.from({ length: 25 }).map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
    }));
    setParticles(generatedParticles);

    // Animation stages
    const stage1Timer = setTimeout(() => setStage(1), 500);
    const stage2Timer = setTimeout(() => setStage(2), 2000);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5500);

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes vrBgGradientShift {
          0% { background: linear-gradient(-45deg, #059669 0%, #10b981 25%, #14b8a6 50%, #0d9488 75%, #059669 100%); }
          25% { background: linear-gradient(45deg, #059669 0%, #10b981 25%, #14b8a6 50%, #0d9488 75%, #059669 100%); }
          50% { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 25%, #10b981 50%, #059669 75%, #0d9488 100%); }
          75% { background: linear-gradient(225deg, #14b8a6 0%, #0d9488 25%, #059669 50%, #10b981 75%, #14b8a6 100%); }
          100% { background: linear-gradient(-45deg, #059669 0%, #10b981 25%, #14b8a6 50%, #0d9488 75%, #059669 100%); }
        }

        @keyframes vrFlash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes vrExplosion {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        @keyframes vrTrashSpinOut {
          0% {
            opacity: 1;
            transform: scale(1) rotateX(0) rotateY(0) rotateZ(0);
            filter: brightness(1);
          }
          35% {
            opacity: 1;
            transform: scale(1.3) rotateX(180) rotateY(180) rotateZ(90);
            filter: brightness(1.2);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8) rotateX(360) rotateY(270) rotateZ(180);
            filter: brightness(0.5);
          }
          100% {
            opacity: 0;
            transform: scale(0.3) rotateX(720) rotateY(540) rotateZ(360);
            filter: brightness(0);
          }
        }

        @keyframes vrTreasureEmerge {
          0% {
            opacity: 0;
            transform: scale(0) rotateX(-180) rotateY(0) rotateZ(-180);
            filter: brightness(0);
          }
          45% {
            opacity: 0;
            transform: scale(0) rotateX(-180) rotateY(0) rotateZ(-180);
            filter: brightness(0);
          }
          60% {
            opacity: 1;
            transform: scale(1.5) rotateX(0) rotateY(360) rotateZ(180);
            filter: brightness(1.5);
          }
          80% {
            opacity: 1;
            transform: scale(1.1) rotateX(10) rotateY(20) rotateZ(5);
            filter: brightness(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateX(0) rotateY(0) rotateZ(0);
            filter: brightness(1);
          }
        }

        @keyframes vrShockwave {
          0% {
            transform: scale(0);
            opacity: 1;
            border-width: 3px;
          }
          100% {
            transform: scale(3);
            opacity: 0;
            border-width: 0px;
          }
        }

        @keyframes vrParticleExplode {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }

        @keyframes vrTextWaveIn {
          0% {
            opacity: 0;
            transform: skewX(-10deg) translateY(30px) scale(0.9);
            text-shadow: none;
          }
          50% {
            opacity: 0;
          }
          75% {
            opacity: 1;
            transform: skewX(2deg) translateY(0) scale(1.05);
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(16, 185, 129, 0.3);
          }
          100% {
            opacity: 1;
            transform: skewX(0deg) translateY(0) scale(1);
            text-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), 0 0 50px rgba(16, 185, 129, 0.6);
          }
        }

        @keyframes vrSubtitleFadeIn {
          0%, 60% {
            opacity: 0;
            transform: translateY(20px);
          }
          80% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes vrGlowIntense {
          0%, 100% {
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.6), 0 0 80px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 0 100px rgba(16, 185, 129, 1), 0 0 200px rgba(16, 185, 129, 0.6), inset 0 0 80px rgba(16, 185, 129, 0.3);
          }
        }

        @keyframes vrOrbitRing {
          0% { transform: rotateZ(0) scale(1); }
          100% { transform: rotateZ(360deg) scale(1); }
        }

        @keyframes vrFadeOutScreen {
          0% {
            opacity: 1;
            pointer-events: auto;
            visibility: visible;
          }
          95% {
            opacity: 0;
            pointer-events: none;
            visibility: visible;
          }
          100% {
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
            display: none;
          }
        }

        .vr-loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: linear-gradient(-45deg, #059669 0%, #10b981 25%, #14b8a6 50%, #0d9488 75%, #059669 100%);
          background-size: 400% 400%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          animation: vrBgGradientShift 5.5s ease-in-out, vrFadeOutScreen 5.5s ease-in-out forwards;
          perspective: 2000px;
          overflow: hidden;
          visibility: visible;
          opacity: 1;
        }

        .vr-loader-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
          pointer-events: none;
        }

        .vr-loader-container::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
          animation: vrExplosion 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.5s forwards;
          pointer-events: none;
        }

        .vr-center-orb {
          position: relative;
          width: 320px;
          height: 320px;
          margin-bottom: 100px;
          perspective: 1500px;
          z-index: 10;
        }

        @media (max-width: 768px) {
          .vr-center-orb {
            width: 200px;
            height: 200px;
            margin-bottom: 50px;
          }
        }

        .vr-shockwave {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border: 3px solid rgba(16, 185, 129, 0.8);
          border-radius: 50%;
          animation: vrShockwave 1.5s ease-out 1.8s forwards;
        }

        .vr-orbit-ring {
          position: absolute;
          inset: -60px;
          border: 2px solid rgba(16, 185, 129, 0.4);
          border-radius: 50%;
          animation: vrOrbitRing 15s linear infinite;
        }

        .vr-orbit-ring:nth-child(2) {
          inset: -100px;
          border-width: 1.5px;
          border-color: rgba(20, 184, 166, 0.25);
          animation-duration: 20s;
          animation-direction: reverse;
        }

        .vr-icon-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          font-size: 150px;
        }

        .vr-icon-wrapper::before {
          content: '';
          position: absolute;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: vrGlowIntense 2.5s ease-in-out 1.2s infinite;
          z-index: -1;
        }

        .vr-trash {
          animation: vrTrashSpinOut 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          will-change: transform;
          filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.4));
        }

        .vr-treasure-1 {
          animation: vrTreasureEmerge 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          font-size: 110px;
          position: absolute;
          top: 10px;
          right: 30px;
          filter: drop-shadow(0 0 20px rgba(255, 255, 100, 0.8)) drop-shadow(0 0 40px rgba(16, 185, 129, 0.6));
        }

        @media (max-width: 768px) {
          .vr-treasure-1 {
            font-size: 60px;
            top: 5px;
            right: 15px;
            filter: drop-shadow(0 0 10px rgba(255, 255, 100, 0.6)) drop-shadow(0 0 20px rgba(16, 185, 129, 0.4));
          }
        }

        .vr-treasure-2 {
          animation: vrTreasureEmerge 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
          font-size: 120px;
          position: absolute;
          bottom: 0px;
          left: 15px;
          filter: drop-shadow(0 0 25px rgba(100, 200, 255, 0.8)) drop-shadow(0 0 50px rgba(16, 185, 129, 0.6));
        }

        @media (max-width: 768px) {
          .vr-treasure-2 {
            font-size: 65px;
            bottom: 0px;
            left: 8px;
            filter: drop-shadow(0 0 12px rgba(100, 200, 255, 0.6)) drop-shadow(0 0 25px rgba(16, 185, 129, 0.4));
          }
        }

        .vr-text-container {
          position: relative;
          z-index: 11;
          text-align: center;
          max-width: 90%;
        }

        .vr-title {
          font-size: 80px;
          font-weight: 900;
          color: #ffffff;
          margin: 0;
          letter-spacing: 8px;
          text-transform: uppercase;
          line-height: 1;
          animation: vrTextWaveIn 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s both;
        }

        @media (max-width: 768px) {
          .vr-title {
            font-size: 42px;
            letter-spacing: 4px;
          }
        }

        .vr-subtitle {
          font-size: 22px;
          color: rgba(255, 255, 255, 0.95);
          margin-top: 30px;
          letter-spacing: 4px;
          font-weight: 600;
          text-transform: uppercase;
          animation: vrSubtitleFadeIn 2.5s ease-out 1.8s both;
          text-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
        }

        @media (max-width: 768px) {
          .vr-subtitle {
            font-size: 12px;
            margin-top: 15px;
            letter-spacing: 2px;
          }
        }

        .vr-particle {
          position: absolute;
          pointer-events: none;
        }

        .vr-particle-item {
          width: 8px;
          height: 8px;
          background: radial-gradient(circle at 35% 35%, rgba(255, 255, 150, 0.95), rgba(16, 185, 129, 0.7));
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.9), 0 0 24px rgba(255, 255, 100, 0.5);
        }

        .vr-particle.active {
          animation: vrParticleExplode 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2s forwards;
        }

        @keyframes vrFloatIn {
          0% {
            opacity: 0;
            transform: translate(0, 50px) scale(0);
          }
          30% {
            opacity: 0;
          }
          50% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 1;
            transform: translate(0, -20px) scale(1);
          }
        }

        @keyframes vrFloat {
          0%, 100% { transform: translateY(0px) rotateZ(0deg); }
          25% { transform: translateY(-15px) rotateZ(5deg); }
          50% { transform: translateY(-30px) rotateZ(-5deg); }
          75% { transform: translateY(-15px) rotateZ(5deg); }
        }

        @keyframes vrRotateFloat {
          0% { transform: rotateZ(0deg) translateX(0); }
          100% { transform: rotateZ(360deg) translateX(10px); }
        }

        .vr-element {
          position: absolute;
          font-size: 48px;
          opacity: 0;
          animation: vrFloatIn 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, vrFloat 3s ease-in-out 3.5s infinite;
          filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.3));
        }

        @media (max-width: 768px) {
          .vr-element {
            font-size: 28px;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
          }
        }

        .vr-element-recycle { animation: vrFloatIn 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards, vrFloat 3s ease-in-out 3.5s infinite; }
        .vr-element-leaf { animation: vrFloatIn 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards, vrRotateFloat 4s linear 3.5s infinite; }
        .vr-element-water { animation: vrFloatIn 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s forwards, vrFloat 3.5s ease-in-out 3.5s infinite; }
        .vr-element-earth { animation: vrFloatIn 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s forwards, vrFloat 3s ease-in-out 3.5s infinite; }
        .vr-element-energy { animation: vrFloatIn 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.1s forwards, vrRotateFloat 3.5s linear 3.5s infinite; }
      `}</style>

      <div className="vr-loader-container">
        <div className="vr-center-orb">
          <div className="vr-orbit-ring"></div>
          <div className="vr-orbit-ring"></div>
          <div className="vr-shockwave"></div>
          <div className="vr-icon-wrapper">
            <div className="vr-trash">🗑️</div>
            <div className="vr-treasure-1">✨</div>
            <div className="vr-treasure-2">💎</div>
          </div>
        </div>

        <div className="vr-text-container">
          <h1 className="vr-title">TRASH TO TREASURE</h1>
          <p className="vr-subtitle">Transforming Plastic Waste Into Sustainability</p>
        </div>

        {/* Recycling and Sustainable Elements */}
        <div className="vr-element vr-element-recycle" style={{ top: '15%', left: '10%' }}>♻️</div>
        <div className="vr-element vr-element-leaf" style={{ top: '20%', right: '15%' }}>🌱</div>
        <div className="vr-element vr-element-water" style={{ bottom: '25%', left: '12%' }}>💧</div>
        <div className="vr-element vr-element-earth" style={{ bottom: '20%', right: '10%' }}>🌍</div>
        <div className="vr-element vr-element-energy" style={{ top: '35%', left: '8%' }}>⚡</div>
        <div className="vr-element vr-element-recycle" style={{ top: '30%', right: '20%' }}>♻️</div>
        <div className="vr-element vr-element-leaf" style={{ bottom: '35%', left: '20%' }}>🌿</div>
        <div className="vr-element vr-element-water" style={{ top: '25%', right: '8%' }}>💧</div>

        {/* Enhanced particle explosion effect */}
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`vr-particle ${stage >= 2 ? 'active' : ''}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              '--tx': `${(Math.random() - 0.5) * 400}px`,
              '--ty': `${(Math.random() - 0.5) * 400}px`,
            } as React.CSSProperties & { '--tx': string; '--ty': string }}
          >
            <div className="vr-particle-item"></div>
          </div>
        ))}
      </div>
    </>
  );
}
