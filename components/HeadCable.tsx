"use client";

import React, { RefObject, useEffect, useRef } from 'react';

// One glowing cable from Max's head to the search field, as if he's plugged
// into the chat. It goes up out of the head and off screen with a slight wave,
// since no hanging cable is perfectly straight (1), comes back in at the top
// left, hangs over a hook and leaves through the left edge (2), then comes in
// from the left edge again and sags down into the search field (3).
// Signals travel the whole way like neurons firing, each with its own speed,
// length and brightness, now and then in a quick burst. A click sends a burst.
// Moving the pointer across the cable nudges it like a real string: it gets
// pushed the way the pointer moves, springs back and wobbles out.

interface HeadCableProps {
  headRef: RefObject<HTMLElement | null>; // The hero photo
  fieldRef: RefObject<HTMLElement | null>; // Holds the search field ([role="search"])
  // "all" = head, top left loop and field; "field" = only the part into the
  // search field (when the filaments above the head are shown instead);
  // "chat" = a short piece up from the bottom into the chat input
  route?: 'all' | 'field' | 'chat';
  headX?: number; // Where the cable leaves the head, share of the photo's size
  headY?: number;
  opacity?: number;
}

type Point = { x: number; y: number };

const CABLE_COLOR: [number, number, number] = [115, 57, 255]; // #7339FF
const CABLE_DARK: [number, number, number] = [77, 36, 184]; // #4D24B8
const SIGNAL_COLOR: [number, number, number] = [230, 220, 255]; // #E6DCFF
// Distance a signal "travels" while the cable is off screen between parts
const OFF_SCREEN_GAP = 160;
const SAMPLES = 96; // Points along a curve

// Cable physics: how far the pointer reaches, how hard it pushes, how the
// cable springs back (to rest and towards its neighbours) and settles
const POINTER_RADIUS = 40;
const POINTER_PUSH = 0.05; // Share of the pointer's speed passed on to the cable
const SPRING = 14;
const TENSION = 900;
const DAMPING = 8;
const MAX_OFFSET = 10;

// Metal jack at the search field: how much of it shows left of the field
const JACK_VISIBLE = 24;
const STEPS_PER_SPAN = 24; // Points between two control points of the loop

const rgba = ([r, g, b]: [number, number, number], a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;

// Smooth curve through all points (Catmull-Rom), sampled into a polyline
function throughPoints(points: Point[]): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const steps = STEPS_PER_SPAN;
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

// A cable hanging between two supports at the same height, sagging to dipY.
// Real cables hang as a catenary: steep near the supports, flat at the bottom.
function catenary(x1: number, x2: number, supportY: number, dipY: number): Point[] {
  const half = Math.abs(x2 - x1) / 2;
  const depth = Math.max(1, dipY - supportY);
  // Find the catenary parameter that gives this sag (bigger a = flatter)
  let lo = 1;
  let hi = 100000;
  for (let i = 0; i < 60; i++) {
    const a = (lo + hi) / 2;
    if (a * (Math.cosh(half / a) - 1) > depth) lo = a;
    else hi = a;
  }
  const a = (lo + hi) / 2;
  const mid = (x1 + x2) / 2;
  return Array.from({ length: SAMPLES + 1 }, (_, k) => {
    const x = x1 + ((x2 - x1) * k) / SAMPLES;
    return { x, y: dipY - a * (Math.cosh((x - mid) / a) - 1) };
  });
}

// Metal jack lying horizontally, its tip at x (under the field's edge).
// Same lavender metal, grooves and dark collar as HeadJack on the photo,
// lit from above so the top edge catches the light.
function drawJack(ctx: CanvasRenderingContext2D, x: number, y: number, glow: number) {
  const metal = (top: number, bottom: number, dark: boolean) => {
    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
    const stops: [number, string][] = dark
      ? [[0, '#bdb7d2'], [0.3, '#8e88a8'], [0.7, '#3a3550'], [1, '#1a1729']]
      : [[0, '#a9a3c0'], [0.22, '#f7f6fc'], [0.4, '#d9d5e8'], [0.72, '#6e6886'], [1, '#24213a']];
    stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
    return gradient;
  };
  // Light from the cable at the collar
  const halo = ctx.createRadialGradient(x - JACK_VISIBLE, y, 0, x - JACK_VISIBLE, y, 16);
  halo.addColorStop(0, rgba(CABLE_COLOR, 0.6 * glow));
  halo.addColorStop(1, rgba(CABLE_COLOR, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(x - JACK_VISIBLE - 16, y - 16, 32, 32);
  // Collar where the cable goes in
  ctx.fillStyle = metal(y - 3.5, y + 3.5, true);
  ctx.beginPath();
  ctx.roundRect(x - JACK_VISIBLE, y - 3.5, 8, 7, 1.5);
  ctx.fill();
  // Body with ridges
  ctx.fillStyle = metal(y - 5.5, y + 5.5, false);
  ctx.beginPath();
  ctx.roundRect(x - JACK_VISIBLE + 7, y - 5.5, JACK_VISIBLE - 5, 11, 2);
  ctx.fill();
  // Grooves: dark cut with a lit edge beside it
  for (const rx of [x - 13, x - 10, x - 7]) {
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = 'rgba(29, 26, 44, 0.7)';
    ctx.beginPath();
    ctx.moveTo(rx, y - 5.5);
    ctx.lineTo(rx, y + 5.5);
    ctx.stroke();
    ctx.lineWidth = 0.4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(rx + 0.8, y - 5.5);
    ctx.lineTo(rx + 0.8, y + 5.5);
    ctx.stroke();
  }
}

function cubic(p0: Point, c1: Point, c2: Point, p1: Point): Point[] {
  return Array.from({ length: SAMPLES + 1 }, (_, k) => {
    const t = k / SAMPLES;
    const u = 1 - t;
    return {
      x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
      y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
    };
  });
}

// Each part with the distance along the whole cable where it starts
type Part = { points: Point[]; distances: number[]; start: number; length: number };

// Point at a distance along a part, interpolated between samples
function pointAt(part: Part, d: number): Point {
  const { points, distances } = part;
  if (d <= 0) return points[0];
  if (d >= part.length) return points[points.length - 1];
  let lo = 0;
  let hi = distances.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (distances[mid] < d) lo = mid;
    else hi = mid;
  }
  const u = (d - distances[lo]) / (distances[hi] - distances[lo] || 1);
  return { x: points[lo].x + (points[hi].x - points[lo].x) * u, y: points[lo].y + (points[hi].y - points[lo].y) * u };
}

// Smooth line through points: quadratic curves via the midpoints
function traceSmooth(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  if (points.length < 3) {
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    return;
  }
  for (let i = 1; i < points.length - 1; i++) {
    ctx.quadraticCurveTo(points[i].x, points[i].y, (points[i].x + points[i + 1].x) / 2, (points[i].y + points[i + 1].y) / 2);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
}

function measure(points: Point[], start: number): Part {
  const distances = [0];
  for (let i = 1; i < points.length; i++) {
    distances.push(distances[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  return { points, distances, start, length: distances[distances.length - 1] };
}

export function HeadCable({ headRef, fieldRef, route = 'all', headX = 0.52, headY = 0.17, opacity = 0.9 }: HeadCableProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    resize();
    window.addEventListener('resize', resize);

    // Signals currently on the cable
    type Signal = { pos: number; speed: number; length: number; strength: number };
    let signals: Signal[] = [];
    let prefilled = false;
    let nextSpawn = 0.5;
    let pendingBurst = 0;
    let burstTimer = 0;
    const spawn = (pos = 0) => {
      signals.push({
        pos,
        speed: 140 + Math.random() * 160, // px per second
        length: 40 + Math.random() * 110,
        strength: 0.6 + Math.random() * 0.6,
      });
    };
    const handleClick = () => { pendingBurst += 4; };
    if (!reducedMotion) window.addEventListener('pointerdown', handleClick);

    // Pointer position and speed, the speed fades when it stops moving
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: 0, lastY: 0, lastT: 0 };
    const handlePointerMove = (event: PointerEvent) => {
      const now = performance.now();
      if (pointer.lastT) {
        const t = Math.max(0.008, (now - pointer.lastT) / 1000);
        pointer.vx = pointer.vx * 0.5 + ((event.clientX - pointer.lastX) / t) * 0.5;
        pointer.vy = pointer.vy * 0.5 + ((event.clientY - pointer.lastY) / t) * 0.5;
      }
      pointer.x = pointer.lastX = event.clientX;
      pointer.y = pointer.lastY = event.clientY;
      pointer.lastT = now;
    };
    if (!reducedMotion) window.addEventListener('pointermove', handlePointerMove);

    // Each part's points can be pushed out of place, they spring back
    type Wobble = { ox: Float32Array; oy: Float32Array; vx: Float32Array; vy: Float32Array };
    const wobbles: Wobble[] = [];
    const wobbleFor = (index: number, count: number) => {
      let w = wobbles[index];
      if (!w || w.ox.length !== count) {
        w = { ox: new Float32Array(count), oy: new Float32Array(count), vx: new Float32Array(count), vy: new Float32Array(count) };
        wobbles[index] = w;
      }
      return w;
    };
    const simulate = (points: Point[], w: Wobble, dt: number) => {
      const n = points.length;
      // Small fixed steps keep the spring stable
      const steps = Math.ceil(dt / 0.008);
      const h = dt / steps;
      for (let step = 0; step < steps; step++) {
        for (let i = 1; i < n - 1; i++) {
          const ax = -SPRING * w.ox[i] + TENSION * (w.ox[i - 1] + w.ox[i + 1] - 2 * w.ox[i]) / 100 - DAMPING * w.vx[i];
          const ay = -SPRING * w.oy[i] + TENSION * (w.oy[i - 1] + w.oy[i + 1] - 2 * w.oy[i]) / 100 - DAMPING * w.vy[i];
          w.vx[i] += ax * h;
          w.vy[i] += ay * h;
          // Near the pointer the cable is carried along with it, never faster
          // than the pointer itself, so a quick flick can't fling it away
          if (step === 0) {
            const dx = points[i].x + w.ox[i] - pointer.x;
            const dy = points[i].y + w.oy[i] - pointer.y;
            const falloff = Math.exp(-(dx * dx + dy * dy) / (POINTER_RADIUS * POINTER_RADIUS));
            if (falloff > 0.01) {
              w.vx[i] += (pointer.vx * POINTER_PUSH - w.vx[i]) * falloff * 0.5;
              w.vy[i] += (pointer.vy * POINTER_PUSH - w.vy[i]) * falloff * 0.5;
            }
          }
        }
        for (let i = 1; i < n - 1; i++) {
          w.ox[i] = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, w.ox[i] + w.vx[i] * h));
          w.oy[i] = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, w.oy[i] + w.vy[i] * h));
        }
      }
      return points.map((p, i) => ({ x: p.x + w.ox[i], y: p.y + w.oy[i] }));
    };

    let visible = 0;
    let lastTime = 0;
    let frame = 0;

    const draw = (time: number) => {
      const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      ctx.clearRect(0, 0, width, height);

      const photo = headRef.current;
      const field = fieldRef.current?.querySelector('[role="search"]') as HTMLElement | null;
      const photoRect = photo && photo.offsetParent ? photo.getBoundingClientRect() : null;
      const fieldRect = field && field.offsetParent ? field.getBoundingClientRect() : null;
      // The chat route only needs the field, the others need the photo too
      const onScreen = !!fieldRect && fieldRect.width > 0 && (route === 'chat' || (!!photoRect && photoRect.width > 0));
      visible += ((onScreen ? 1 : 0) - visible) * (1 - Math.pow(0.9, dt * 60));
      if (!fieldRect || !onScreen || visible < 0.01) return;

      // The visible parts, in screen pixels
      const head = photoRect
        ? { x: photoRect.left + photoRect.width * headX, y: photoRect.top + photoRect.height * headY }
        : { x: 0, y: 0 };
      const plug = { x: fieldRect.left + 2, y: fieldRect.top + fieldRect.height / 2 };
      // Up out of the head with a gentle bow to the right and a slow sway
      const sway = reducedMotion ? 0 : Math.sin(time / 2200) * 4;
      const part1 = Array.from({ length: SAMPLES + 1 }, (_, k) => {
        const t = k / SAMPLES;
        return {
          x: head.x + 22 * Math.sin(Math.PI * t) + 6 * Math.sin(2 * Math.PI * t + 0.5) - 6 * Math.sin(0.5) * (1 - t) + sway * t,
          y: head.y + (-30 - head.y) * t,
        };
      });
      // Part 2 hangs over an invisible hook above the screen: down in a sag
      // and back up, then down on the other side and out through the left
      // edge. Kept in the free space left of the page content, so it never
      // crosses the menu (the field's left edge lines up with the logo).
      const loop = Math.max(110, plug.x - 24);
      const hookY = -70;
      const part2 = catenary(loop * 1.0, loop * 0.46, hookY, height * 0.1).concat(
        catenary(loop * 0.46, -loop * 0.75, hookY, height * 0.17).slice(1),
      );
      // In from the left edge above the field, sagging down and levelling out
      // into the plug
      const part3 = cubic(
        { x: -30, y: plug.y - height * 0.22 },
        { x: plug.x * 0.3, y: plug.y - height * 0.2 },
        { x: plug.x * 0.55, y: plug.y + 4 },
        { x: plug.x - JACK_VISIBLE - 12, y: plug.y },
      ).concat([{ x: plug.x - JACK_VISIBLE, y: plug.y }]);

      // Chat mode: up from below the screen, curving into the input's left edge
      const chatPart = cubic(
        { x: plug.x - 95, y: height + 30 },
        { x: plug.x - 90, y: plug.y + 25 },
        { x: plug.x - 60, y: plug.y },
        { x: plug.x - JACK_VISIBLE - 12, y: plug.y },
      ).concat([{ x: plug.x - JACK_VISIBLE, y: plug.y }]);

      // The pointer's push fades out quickly once it stops
      pointer.vx *= Math.pow(0.85, dt * 60);
      pointer.vy *= Math.pow(0.85, dt * 60);

      const parts: Part[] = [];
      let distance = 0;
      const route3 = route === 'chat' ? [chatPart] : route === 'field' ? [part3] : [part1, part2, part3];
      for (const [index, base] of route3.entries()) {
        const points = reducedMotion ? base : simulate(base, wobbleFor(index, base.length), dt);
        const part = measure(points, distance);
        parts.push(part);
        distance += part.length + OFF_SCREEN_GAP;
      }
      const total = distance - OFF_SCREEN_GAP;

      ctx.globalAlpha = visible;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // The cable: soft glow, then the core. Dim where it leaves the head.
      const cableBreath = reducedMotion ? 1 : 0.75 + 0.25 * Math.sin(time / 1400);
      for (const [index, part] of parts.entries()) {
        const { points } = part;
        const trace = () => traceSmooth(ctx, points);
        const first = points[0];
        const last = points[points.length - 1];
        const gradient = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
        gradient.addColorStop(0, rgba(index === 0 ? CABLE_DARK : CABLE_COLOR, index === 0 ? 0.5 : 0.8));
        gradient.addColorStop(1, rgba(CABLE_COLOR, 0.9));
        trace();
        ctx.strokeStyle = rgba(CABLE_COLOR, 0.08 * cableBreath);
        ctx.lineWidth = 18;
        ctx.stroke();
        ctx.strokeStyle = rgba(CABLE_COLOR, 0.16 * cableBreath);
        ctx.lineWidth = 7;
        ctx.stroke();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      // Metal jack at the field, its tip tucked under the field's edge
      const breathe = reducedMotion ? 1 : 0.7 + 0.3 * Math.sin(time / 500);
      drawJack(ctx, plug.x, plug.y, breathe);

      if (!reducedMotion) {
        // On page load the whole cable already carries signals
        if (!prefilled) {
          prefilled = true;
          for (let pos = 80 + Math.random() * 120; pos < total; pos += 180 + Math.random() * 260) spawn(pos);
        }

        // New signals now and then, sometimes a quick burst of three
        nextSpawn -= dt;
        if (nextSpawn <= 0) {
          if (Math.random() < 0.2) pendingBurst += 3;
          else spawn();
          nextSpawn = 0.8 + Math.random() * 2.2;
        }
        burstTimer -= dt;
        if (pendingBurst > 0 && burstTimer <= 0) {
          spawn();
          pendingBurst--;
          burstTimer = 0.22;
        }

        // Move them along and draw each with a fading tail
        signals = signals.filter((signal) => signal.pos - signal.length < total);
        for (const signal of signals) {
          signal.pos += signal.speed * dt;
          for (const part of parts) {
            const tailAt = signal.pos - signal.length - part.start;
            const headAt = signal.pos - part.start;
            if (headAt < 0 || tailAt > part.length) continue;
            const from = Math.max(0, tailAt);
            const to = Math.min(part.length, headAt);
            if (to - from < 1) continue;

            // The visible stretch, sampled every few pixels for a smooth line
            const streak: Point[] = [];
            const count = Math.max(2, Math.ceil((to - from) / 4));
            for (let k = 0; k <= count; k++) streak.push(pointAt(part, from + ((to - from) * k) / count));

            // Fades from nothing at the tail to full at the head
            const tail = pointAt(part, tailAt);
            const head = pointAt(part, headAt);
            const fade = (alpha: number, color: [number, number, number]) => {
              const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
              gradient.addColorStop(0, rgba(color, 0));
              gradient.addColorStop(0.7, rgba(color, alpha * 0.5));
              gradient.addColorStop(1, rgba(color, alpha));
              return gradient;
            };
            traceSmooth(ctx, streak);
            ctx.strokeStyle = fade(0.4 * signal.strength, CABLE_COLOR);
            ctx.lineWidth = 12;
            ctx.stroke();
            ctx.strokeStyle = fade(Math.min(1, signal.strength), SIGNAL_COLOR);
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handleClick);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [headRef, fieldRef, route, headX, headY]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ opacity }}
    />
  );
}
