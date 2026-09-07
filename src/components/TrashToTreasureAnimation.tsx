'use client';

export default function TrashToTreasureAnimation() {
  return (
    <>
      <style>{`
        .trash-treasure-container {
          perspective: 1000px;
          width: 140px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .animation-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .trash-item {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          transform-style: preserve-3d;
          animation: trashRotate 4s ease-in-out infinite;
        }

        .trash-item:nth-child(1) {
          animation-delay: 0s;
        }

        .trash-item:nth-child(2) {
          animation-delay: 2s;
        }

        .treasure-item {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          transform-style: preserve-3d;
          animation: treasureRotate 4s ease-in-out infinite;
        }

        .treasure-item:nth-child(3) {
          animation-delay: 1s;
        }

        .treasure-item:nth-child(4) {
          animation-delay: 3s;
        }

        @keyframes trashRotate {
          0% {
            opacity: 1;
            transform: rotateY(0deg) rotateX(0deg) scale(1);
          }
          45% {
            opacity: 1;
            transform: rotateY(90deg) rotateX(20deg) scale(0.8);
          }
          50% {
            opacity: 0;
            transform: rotateY(180deg) rotateX(40deg) scale(0.5);
          }
          100% {
            opacity: 0;
            transform: rotateY(180deg) rotateX(40deg) scale(0.5);
          }
        }

        @keyframes treasureRotate {
          0% {
            opacity: 0;
            transform: rotateY(180deg) rotateX(-40deg) scale(0.5);
          }
          50% {
            opacity: 0;
            transform: rotateY(180deg) rotateX(-40deg) scale(0.5);
          }
          55% {
            opacity: 1;
            transform: rotateY(90deg) rotateX(-20deg) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: rotateY(0deg) rotateX(0deg) scale(1);
          }
        }

        .label-text {
          position: absolute;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          color: rgb(107, 114, 128);
          animation: labelFade 4s ease-in-out infinite;
        }

        @keyframes labelFade {
          0%, 48% {
            opacity: 1;
            content: 'TRASH';
          }
          50%, 100% {
            opacity: 1;
            content: 'TREASURE';
          }
        }

        .glow {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
          animation: pulseGlow 4s ease-in-out infinite;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        @keyframes pulseGlow {
          0%, 48% {
            background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
            transform: translate(-50%, -50%) scale(0.8);
          }
          50%, 100% {
            background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>

      <div className="trash-treasure-container">
        <div className="glow"></div>
        <div className="label-text">TRASH → TREASURE</div>
        <div className="animation-wrapper">
          {/* Trash items */}
          <div className="trash-item">🗑️</div>
          <div className="trash-item">♻️</div>

          {/* Treasure items */}
          <div className="treasure-item">✨</div>
          <div className="treasure-item">💎</div>
        </div>
      </div>
    </>
  );
}
