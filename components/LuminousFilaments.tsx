"use client";

import React, { useEffect, useRef } from 'react';

// Glowing fibers fanning out from a bright source at the top of the screen.
// Drawn on a canvas behind the page, test version behind ?bg=filaments.
interface LuminousFilamentsProps {
  sourceColor?: string; // Left side and the glow at the source
  endColor?: string; // Right side
  fibers?: number;
  lineWidth?: number;
  spread?: number; // How wide the fan gets at the bottom, 1 = most of the screen
  flare?: number; // Higher = stays narrow longer, then splays out
  neck?: number; // Width at the source, share of the screen width
  length?: number; // How far down the fibers reach, 1 = full height
  originX?: number;
  originY?: number;
  opacity?: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.replace('#', ''), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

const mix = (a: [number, number, number], b: [number, number, number], t: number) =>
  a.map((channel, i) => Math.round(channel + (b[i] - channel) * t)) as [number, number, number];

export function LuminousFilaments({
  sourceColor = '#7B4DFF',
  endColor = '#FF7AD9',
  fibers = 72,
  lineWidth = 1.5,
  spread = 1,
  flare = 1.3,
  neck = 0.035,
  length = 1.5,
  originX = 0.5,
  originY = 0,
  opacity = 0.7,
}: LuminousFilamentsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const source = hexToRgb(sourceColor);
    const end = hexToRgb(endColor);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Each fiber keeps its own position, brightness and shimmer speed
    const strands = Array.from({ length: fibers }, (_, i) => {
      const s = fibers === 1 ? 0 : (i / (fibers - 1)) * 2 - 1; // -1 left … 1 right
      return {
        s,
        jitter: (Math.random() - 0.5) * 0.08,
        brightness: 0.45 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        color: mix(source, end, (s + 1) / 2),
      };
    });

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const x0 = originX * width;
      const y0 = originY * height;
      const reach = length * height;
      const neckWidth = neck * width;
      const fanWidth = spread * width * 0.6;

      for (const strand of strands) {
        const shimmer = reducedMotion ? 1 : 0.75 + 0.25 * Math.sin(t * strand.speed + strand.phase);
        const sway = reducedMotion ? 0 : Math.sin(t * 0.25 + strand.phase) * 0.012;
        const endOffset = (strand.s + strand.jitter + sway) * fanWidth;
        const startX = x0 + strand.s * neckWidth * 0.5;

        // Curve that leaves the source almost straight down, then splays out
        ctx.beginPath();
        const steps = 28;
        for (let k = 0; k <= steps; k++) {
          const p = k / steps;
          const x = startX + endOffset * Math.pow(p, flare * 1.4);
          const y = y0 + reach * p;
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const [r, g, b] = strand.color;
        const alpha = strand.brightness * shimmer;

        // Soft wide glow, then the bright thin fiber on top
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.09 * alpha})`;
        ctx.lineWidth = lineWidth * 5;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.85 * alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      // Bright source at the top
      const glow = ctx.createRadialGradient(x0, y0, 0, x0, y0, width * 0.18);
      glow.addColorStop(0, `rgba(${source.join(', ')}, 0.45)`);
      glow.addColorStop(1, `rgba(${source.join(', ')}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    };

    resize();
    window.addEventListener('resize', resize);

    // ~30 fps is plenty for a slow shimmer and easy on laptops
    let frame = 0;
    let last = 0;
    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (time - last < 33) return;
      last = time;
      draw(time);
    };
    if (reducedMotion) draw(0);
    else frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [sourceColor, endColor, fibers, lineWidth, spread, flare, neck, length, originX, originY]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ opacity }}
    />
  );
}
