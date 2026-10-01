import { useId } from 'react';

// Material 3–style indeterminate spinner: the arc "breathes" (grows/shrinks)
// while the whole ring rotates with ease-in-out instead of a linear spin.
// The glow is a radial gradient (no blur filter) that fades out fully inside
// the padded box, so a parent with overflow hidden can never clip a hard edge.
export function ThinkingSpinner({ size = 28 }: { size?: number }) {
  const gradientId = `thinking-gradient-${useId().replace(/:/g, '')}`;
  const glowPad = Math.round(size * 0.45);

  return (
    <div
      className="thinking-spinner relative flex items-center justify-center"
      style={{ width: size + glowPad * 2, height: size + glowPad * 2, margin: -glowPad }}
      role="status"
      aria-label="Thinking"
    >
      <style>{`
        .thinking-spinner .ts-glow {
          animation: ts-breathe 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        .thinking-spinner .ts-ring {
          animation: ts-rotate 1.6s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
          transform-origin: center;
        }
        .thinking-spinner .ts-arc {
          stroke-dasharray: 1 150;
          stroke-dashoffset: 0;
          animation: ts-dash 1.6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        @keyframes ts-rotate {
          to { transform: rotate(360deg); }
        }
        @keyframes ts-dash {
          0%   { stroke-dasharray: 1 150;  stroke-dashoffset: 0; }
          50%  { stroke-dasharray: 80 150; stroke-dashoffset: -25; }
          100% { stroke-dasharray: 80 150; stroke-dashoffset: -112; }
        }
        @keyframes ts-breathe {
          0%, 100% { opacity: 0.55; transform: scale(0.8); }
          50%      { opacity: 1;    transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .thinking-spinner .ts-ring { animation-duration: 4s; }
          .thinking-spinner .ts-arc  { animation: none; stroke-dasharray: 60 150; }
          .thinking-spinner .ts-glow { animation: none; }
        }
      `}</style>

      {/* Soft glow behind the ring */}
      <div
        className="ts-glow absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(115,57,255,0.55) 0%, rgba(115,57,255,0.3) 40%, rgba(255,210,127,0.18) 65%, rgba(255,210,127,0) 100%)',
        }}
        aria-hidden="true"
      />

      <svg className="ts-ring relative" viewBox="0 0 50 50" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD27F" />
            <stop offset="45%" stopColor="#E4BE3A" />
            <stop offset="100%" stopColor="#7339ff" />
          </linearGradient>
        </defs>
        {/* Faint track */}
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="4" />
        <circle
          className="ts-arc"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
