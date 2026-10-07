"use client";

import React from 'react';

// Glowing eyes on the hero photo, in the same purples as the background
// cables, so Max looks plugged in. Sits on top of the photo; positions are
// shares of the photo's size (526 × 701).
const EYES = [
  { x: 243 / 526, y: 144 / 701, delay: '0s' },
  { x: 301 / 526, y: 141 / 701, delay: '0.35s' },
];

export function EyeGlow() {
  return (
    <div aria-hidden="true" className="eye-glow pointer-events-none absolute inset-0">
      <style>{`
        .eye-glow .eye {
          position: absolute;
          width: 0;
          height: 0;
        }
        /* Purple iris, keeps the eye's own detail */
        .eye-glow .iris {
          position: absolute;
          left: -6px;
          top: -6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(circle, #9D7AFF 0%, #7339FF 60%, rgba(115, 57, 255, 0) 100%);
          mix-blend-mode: color;
          opacity: 0.9;
        }
        /* Soft glow that breathes */
        .eye-glow .glow {
          position: absolute;
          left: -16px;
          top: -16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(157, 122, 255, 0.85) 0%, rgba(115, 57, 255, 0.45) 22%, rgba(77, 36, 184, 0) 70%);
          mix-blend-mode: screen;
          animation: eye-breathe 3.2s ease-in-out infinite;
        }
        /* Small sparkle that flickers now and then */
        .eye-glow .sparkle {
          position: absolute;
          left: 0px;
          top: -2px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #E6DCFF;
          box-shadow: 0 0 4px 1px rgba(157, 122, 255, 0.9);
          mix-blend-mode: screen;
          animation: eye-sparkle 4.7s ease-in-out infinite;
        }
        @keyframes eye-breathe {
          0%, 100% { opacity: 0.55; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes eye-sparkle {
          0%, 30%, 38%, 62%, 66%, 100% { opacity: 0.25; transform: scale(0.8); }
          34% { opacity: 1; transform: scale(1.4); }
          64% { opacity: 0.85; transform: scale(1.2); }
        }
        @media (prefers-reduced-motion: reduce) {
          .eye-glow .glow, .eye-glow .sparkle { animation: none; }
        }
      `}</style>
      {EYES.map((eye) => (
        <span key={eye.x} className="eye" style={{ left: `${eye.x * 100}%`, top: `${eye.y * 100}%` }}>
          <span className="iris" />
          <span className="glow" style={{ animationDelay: eye.delay }} />
          <span className="sparkle" style={{ animationDelay: eye.delay }} />
        </span>
      ))}
    </div>
  );
}
