"use client";

import React from 'react';

// Metal jack sitting in Max's scalp where the cable leaves his head. Drawn on
// top of the hero photo; the cable itself is drawn behind the photo and
// starts at the top of this jack (HeadCable's headX/headY match JACK_TOP).
// Lit from the top right like the photo, in the photo's cool lavender greys.
// Positions are in the photo's own pixels (526 × 701).
const PHOTO = { width: 526, height: 701 };
const JACK_BASE = { x: 273, y: 53 }; // A few pixels into the scalp at the crown
const JACK_TILT = 12; // Degrees, leans the way the cable goes
const JACK_LENGTH = 27; // From the base to the hole the cable comes out of

// Where the cable leaves the jack, as shares of the photo, for HeadCable
const tilt = (JACK_TILT * Math.PI) / 180;
export const JACK_TOP = {
  x: (JACK_BASE.x + JACK_LENGTH * Math.sin(tilt)) / PHOTO.width,
  y: (JACK_BASE.y - JACK_LENGTH * Math.cos(tilt)) / PHOTO.height,
};

// Drawn at twice the size it's shown, for finer detail
const GROOVES = [24, 31, 38, 45];

export function HeadJack() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="30"
      viewBox="0 0 32 60"
      className="pointer-events-none absolute overflow-visible"
      style={{
        left: `${(JACK_BASE.x / PHOTO.width) * 100}%`,
        top: `${(JACK_BASE.y / PHOTO.height) * 100}%`,
        transform: `translate(-50%, -100%) rotate(${JACK_TILT}deg)`,
        transformOrigin: '50% 100%',
      }}
    >
      <defs>
        {/* Round metal lit from the right: dark left side, bright streak right of centre */}
        <linearGradient id="jack-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#24213a" />
          <stop offset="0.35" stopColor="#6e6886" />
          <stop offset="0.62" stopColor="#d9d5e8" />
          <stop offset="0.72" stopColor="#f7f6fc" />
          <stop offset="0.86" stopColor="#a9a3c0" />
          <stop offset="1" stopColor="#5b5574" />
        </linearGradient>
        <linearGradient id="jack-metal-dark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a1729" />
          <stop offset="0.6" stopColor="#8e88a8" />
          <stop offset="0.75" stopColor="#bdb7d2" />
          <stop offset="1" stopColor="#3a3550" />
        </linearGradient>
        {/* Flat tops catch the light from above, brightest towards the right */}
        <linearGradient id="jack-cap" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#8e88a8" />
          <stop offset="0.7" stopColor="#f2f0fa" />
          <stop offset="1" stopColor="#c9c4dc" />
        </linearGradient>
        <radialGradient id="jack-glow">
          <stop offset="0" stopColor="#9D7AFF" stopOpacity="0.85" />
          <stop offset="1" stopColor="#7339FF" stopOpacity="0" />
        </radialGradient>
        <filter id="jack-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Shadow on the scalp, falling down to the left away from the light */}
      <ellipse cx="11" cy="58" rx="17" ry="4" fill="#0b0618" opacity="0.5" filter="url(#jack-shadow-blur)" />
      {/* Tight contact shadow where it goes into the skin */}
      <ellipse cx="15" cy="57" rx="14" ry="2.2" fill="#0b0618" opacity="0.6" />

      {/* Flange sitting on the skin */}
      <rect x="3" y="50" width="26" height="6" fill="url(#jack-metal)" />
      <ellipse cx="16" cy="56" rx="13" ry="2.4" fill="url(#jack-metal)" />
      <ellipse cx="16" cy="50" rx="13" ry="2.6" fill="url(#jack-cap)" />

      {/* Body, its rounded bottom edge resting on the flange */}
      <rect x="5" y="16" width="22" height="34.5" fill="url(#jack-metal)" />
      <ellipse cx="16" cy="50.5" rx="11" ry="2.2" fill="url(#jack-metal)" />
      {/* Grooves curve around the cylinder: dark cut, lit edge below it */}
      {GROOVES.map((y) => (
        <g key={y}>
          <path d={`M5 ${y} Q16 ${y + 2.4} 27 ${y}`} fill="none" stroke="#1d1a2c" strokeWidth="1.1" opacity="0.7" />
          <path d={`M5 ${y + 1.3} Q16 ${y + 3.7} 27 ${y + 1.3}`} fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.35" />
        </g>
      ))}
      <ellipse cx="16" cy="16" rx="11" ry="2.4" fill="url(#jack-cap)" />

      {/* Collar the cable goes into */}
      <rect x="10" y="4" width="12" height="12.5" fill="url(#jack-metal-dark)" />
      <ellipse cx="16" cy="16.3" rx="6" ry="1.3" fill="#1d1a2c" opacity="0.6" />
      <ellipse cx="16" cy="4" rx="6" ry="1.6" fill="url(#jack-cap)" />
      {/* The hole, with the cable's light coming out of it */}
      <ellipse cx="16" cy="4" rx="3.2" ry="0.9" fill="#120a26" />
      <circle cx="16" cy="3" r="7" fill="url(#jack-glow)" />
    </svg>
  );
}
