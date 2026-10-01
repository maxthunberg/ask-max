import { useId } from 'react';

// Material 3–style indeterminate spinner: the arc "breathes" (grows/shrinks)
// while the whole ring rotates with ease-in-out instead of a linear spin.
// Yellow matches the beta tag in the navbar.
export function ThinkingSpinner({ size = 28 }: { size?: number }) {
  const gradientId = `thinking-gradient-${useId().replace(/:/g, '')}`;

  return (
    <div
      className="thinking-spinner relative"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Thinking"
    >
      <style>{`
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
        @media (prefers-reduced-motion: reduce) {
          .thinking-spinner .ts-ring { animation-duration: 4s; }
          .thinking-spinner .ts-arc  { animation: none; stroke-dasharray: 60 150; }
        }
      `}</style>

      <svg className="ts-ring" viewBox="0 0 50 50" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ebd421" />
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
