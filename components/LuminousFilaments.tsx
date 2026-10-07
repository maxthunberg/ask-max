"use client";

import React, { RefObject, useEffect, useRef } from 'react';

// Glowing cables running from Max's head in the hero photo up out of the
// screen, as if he's plugged into the digital Max. Rendered in a WebGL shader
// so every pixel computes its own light: soft glow, depth blur and pulses
// travelling up the cables. The pointer lights them up and a click sends a
// surge through them. Settings follow the "Luminous Filaments" customizer
// (Aurora preset), colours are the site's.
const SETTINGS = {
  fibers: 72,
  lineWidth: 1.5,
  sheath: 0.7, // Soft glow around each fiber
  defocus: 0.8, // How blurry the fibers far back get
  depth: 0.6, // How much the fibers vary in depth
  length: 1.2, // How far up they reach, 1 = from the head to the top of the screen
  spread: 1, // Width of the fan
  neck: 70, // Width where they leave the head, in pixels
  flare: 1.3, // Higher = stays narrow longer, then splays out
  twist: 0.35,
  sway: 1,
  breathe: 0.5,
  flowSpeed: 0.3,
  pulses: 1.3, // Pulses per fiber
  pulseRate: 0.4,
  stagger: 0.4,
  colorFlow: 0.08,
  reach: 0.85, // Where the fibers fade out, share of their length
  glow: 0.5,
  intensity: 1,
  speed: 1,
  pulseStrength: 1,
  hoverBoost: 1,
  hoverPulses: true,
  clickSurge: true,
  interactive: true,
};

// Share of the screen width the fan covers at spread 1, on each side
const FAN_WIDTH = 0.28;
const HOVER_RADIUS = 160;

// Site colours: dark purple at the head (pressed button), lighter purples
// further up (primary, link, hover)
const SOURCE_COLOR = '#4D24B8';
// Information travelling along the cables
const SIGNAL_COLOR = '#E6DCFF';
const END_COLORS = ['#7339FF', '#9D7AFF', '#5E2DD9'];

const glslColor = (hex: string) => {
  const value = parseInt(hex.replace('#', ''), 16);
  return `vec3(${(((value >> 16) & 255) / 255).toFixed(3)}, ${(((value >> 8) & 255) / 255).toFixed(3)}, ${((value & 255) / 255).toFixed(3)})`;
};
const glslFloat = (n: number) => (Number.isInteger(n) ? `${n}.0` : `${n}`);

const VERTEX_SHADER = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

const S = SETTINGS;
const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uResolution; // Drawing buffer size in pixels
uniform float uScale; // Buffer pixels per CSS pixel
uniform float uTime;
uniform vec2 uPointer; // CSS pixels, y down
uniform float uHover; // 0..1, eased in JS
uniform float uSurge; // 0..1, click surge
uniform vec2 uOrigin; // The head, CSS pixels, y down
uniform float uVisible; // Fades the cables in and out

#define FIBERS ${S.fibers}
const float LINE_WIDTH = ${glslFloat(S.lineWidth)};
const float SHEATH = ${glslFloat(S.sheath)};
const float DEFOCUS = ${glslFloat(S.defocus)};
const float DEPTH = ${glslFloat(S.depth)};
const float LENGTH = ${glslFloat(S.length)};
const float FAN = ${glslFloat(S.spread * FAN_WIDTH)};
const float NECK = ${glslFloat(S.neck)};
const float FLARE = ${glslFloat(S.flare * 1.4)};
const float TWIST = ${glslFloat(S.twist)};
const float SWAY = ${glslFloat(S.sway)};
const float BREATHE = ${glslFloat(S.breathe)};
const float FLOW_SPEED = ${glslFloat(S.flowSpeed)};
const float FIRE_CHANCE = ${glslFloat(Math.min(0.9, S.pulses * 0.42))}; // How often a signal slot fires
const float BURST_CHANCE = 0.3; // How often a group of cables fires together
const float PULSE_RATE = ${glslFloat(S.pulseRate)};
const float STAGGER = ${glslFloat(S.stagger)};
const float COLOR_FLOW = ${glslFloat(S.colorFlow)};
const float REACH = ${glslFloat(S.reach)};
const float GLOW = ${glslFloat(S.glow)};
const float INTENSITY = ${glslFloat(S.intensity)};
const float PULSE_STRENGTH = ${glslFloat(S.pulseStrength)};
const float HOVER_BOOST = ${glslFloat(S.hoverBoost)};
const float HOVER_PULSES = ${S.hoverPulses ? '1.0' : '0.0'};
const float HOVER_RADIUS = ${glslFloat(HOVER_RADIUS)};

const vec3 SOURCE = ${glslColor(SOURCE_COLOR)};
const vec3 END_0 = ${glslColor(END_COLORS[0])};
const vec3 END_1 = ${glslColor(END_COLORS[1])};
const vec3 END_2 = ${glslColor(END_COLORS[2])};
const vec3 SIGNAL = ${glslColor(SIGNAL_COLOR)};

float hash(float n) { return fract(sin(n * 127.1 + 311.7) * 43758.5453); }

// Bright signal head with a soft tail behind it
float pulseShape(float p, float head, float tail) {
  float behind = head - p;
  return behind >= 0.0 ? exp(-behind / tail) : exp(behind / 0.004);
}

// One signal slot on a cable, like a neuron firing: every cycle it decides
// again whether to fire, how fast it travels, how long and bright it is
float signal(float seed, float p, float t) {
  float period = mix(4.0, 9.0, hash(seed)) / (PULSE_RATE * 2.5);
  float local = t + hash(seed + 1.0) * period;
  float cycle = floor(local / period);
  float since = (local - cycle * period); // Seconds since this cycle began
  float cs = seed + cycle * 13.37;
  if (hash(cs) > FIRE_CHANCE) return 0.0; // Quiet this time
  float travel = mix(1.6, 4.2, hash(cs + 2.0)); // Seconds to run the cable
  float u = since / travel;
  if (u > 1.3) return 0.0;
  float head = pow(u, 0.8) * REACH; // Picks up speed as it leaves the head
  float tail = mix(0.02, 0.09, hash(cs + 3.0));
  return pulseShape(p, head, tail) * mix(0.5, 1.4, hash(cs + 4.0));
}

// Now and then a group of neighbouring cables fires in a quick cascade
float burst(float fi, float p, float t) {
  float group = floor(fi / 8.0);
  float slotLength = 7.0 / (PULSE_RATE * 2.5);
  float local = t + hash(group * 3.7) * slotLength;
  float slot = floor(local / slotLength);
  if (hash(group * 5.3 + slot * 1.7) > BURST_CHANCE) return 0.0;
  float since = local - slot * slotLength - mod(fi, 8.0) * 0.1 * (0.5 + STAGGER);
  if (since < 0.0) return 0.0;
  float u = since / 2.1;
  if (u > 1.3) return 0.0;
  return pulseShape(p, pow(u, 0.8) * REACH, 0.05) * 1.2;
}

void main() {
  // Work in CSS pixels with y pointing down, like the page
  vec2 px = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) / uScale;
  vec2 size = uResolution / uScale;

  // The cables leave the head and go up, p = 0 at the head, 1 at the far end
  float x0 = uOrigin.x;
  float reachPx = max(LENGTH * uOrigin.y, 1.0);
  float p = clamp((uOrigin.y - px.y) / reachPx, 0.0, 1.0);
  float breathe = 1.0 + 0.05 * BREATHE * sin(uTime * 0.5);
  float fan = FAN * size.x * breathe;
  float neckW = NECK;
  float curve = pow(p, FLARE);
  float curveSlope = FLARE * pow(max(p, 0.0001), FLARE - 1.0) / reachPx;

  // Soft glow around the head where the cables plug in
  vec3 color = SOURCE * (0.08 * GLOW * 2.0 + uSurge * 0.15) * exp(-length(px - uOrigin) / 90.0);

  // Pixels below the head or well outside the fan only get the head glow
  float bound = fan * 1.15 * curve + neckW + 60.0;
  if (px.y < uOrigin.y + 20.0 && abs(px.x - x0) < bound) {
    float flow = sin(uTime * FLOW_SPEED) * COLOR_FLOW;
    float toPurple = smoothstep(0.0, 0.3 + flow, p);
    float fade = 1.0 - smoothstep(REACH * 0.8, REACH, p);
    // All cables overlap at the head, so they start dim and brighten as they spread
    float nearHead = 0.15 + 0.85 * smoothstep(0.0, 0.35, p);
    float hover = uHover * exp(-dot(px - uPointer, px - uPointer) / (HOVER_RADIUS * HOVER_RADIUS)) * HOVER_BOOST;

    vec3 fibers = vec3(0.0);
    for (int i = 0; i < FIBERS; i++) {
      float fi = float(i);
      float s = fi / float(FIBERS - 1) * 2.0 - 1.0; // -1 left … 1 right
      float jitter = (hash(fi) - 0.5) * 0.08;
      float depth = hash(fi + 11.0) * DEPTH;
      float brightness = 0.55 + hash(fi + 23.0) * 0.45;
      float phase = hash(fi + 37.0) * 6.2831;
      float speed = 0.3 + hash(fi + 51.0) * 0.7;
      float pick = hash(fi + 67.0);

      float sway = sin(uTime * 0.25 + phase) * 0.012 * SWAY;
      float endOffset = (s + jitter + sway) * fan;
      float twist = TWIST * 18.0 * p * sin(p * 6.2831 + phase + uTime * 0.2);
      float fx = x0 + s * neckW * 0.5 + endOffset * curve + twist;

      // Distance to the fiber, corrected for how steep it is here
      float slope = endOffset * curveSlope;
      float d = abs(px.x - fx) / sqrt(1.0 + slope * slope);

      // Fibers further back are wider, softer and dimmer
      float focus = 1.0 - depth * DEFOCUS;
      float w = LINE_WIDTH * 0.5 * (1.0 + depth * DEFOCUS * 2.5);
      float core = exp(-(d * d) / (2.0 * w * w));
      float sheath = exp(-d / (w * (3.0 + SHEATH * 6.0))) * 0.18 * SHEATH * GLOW * 2.0;

      float shimmer = 0.8 + 0.2 * sin(uTime * speed + phase);
      float alpha = brightness * shimmer * (0.45 + 0.55 * focus) + hover * 0.4 + uSurge * 0.3;

      // Signals travelling up the cable, each cable firing on its own,
      // plus the odd cascade across neighbours. Brighter on hover
      float pulses = signal(fi * 7.13, p, uTime) + signal(fi * 7.13 + 31.7, p, uTime) + burst(fi, p, uTime);
      pulses *= PULSE_STRENGTH * focus * (1.0 + hover * HOVER_PULSES * 1.5 + uSurge);

      vec3 end = pick < 0.34 ? END_0 : (pick < 0.67 ? END_1 : END_2);
      vec3 fiberColor = mix(SOURCE, end, toPurple);
      // Signals are a lighter lavender with their own halo, the cable itself
      // stays calmer so they stand out
      vec3 signalColor = mix(fiberColor, SIGNAL, 0.6);
      fibers += fiberColor * (core * 0.6 * alpha + sheath * alpha)
        + signalColor * pulses * (core * 1.1 + sheath * 2.5);
    }
    color += fibers * fade * nearHead * INTENSITY;
  }

  // Premultiplied, so the light adds on top of the page background
  color = min(color * uVisible, vec3(1.0));
  gl_FragColor = vec4(color, max(color.r, max(color.g, color.b)));
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('LuminousFilaments shader error:', gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

interface LuminousFilamentsProps {
  // The hero photo. The cables start at headX/headY within it, and are
  // hidden whenever the photo isn't on screen (mobile, chat mode)
  anchorRef: RefObject<HTMLElement | null>;
  headX?: number; // Share of the photo's width
  headY?: number; // Share of the photo's height
  opacity?: number;
}

export function LuminousFilaments({ anchorRef, headX = 0.52, headY = 0.17, opacity = 0.8 }: LuminousFilamentsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!canvas || !gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    // One triangle that covers the whole screen
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      scale: gl.getUniformLocation(program, 'uScale'),
      time: gl.getUniformLocation(program, 'uTime'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
      hover: gl.getUniformLocation(program, 'uHover'),
      surge: gl.getUniformLocation(program, 'uSurge'),
      origin: gl.getUniformLocation(program, 'uOrigin'),
      visible: gl.getUniformLocation(program, 'uVisible'),
    };
    let visible = 0;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Resolution drops automatically if the GPU can't keep up
    let quality = Math.min(window.devicePixelRatio || 1, 1.5);
    let scale = quality;
    const resize = () => {
      scale = quality;
      canvas.width = Math.round(window.innerWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const pointer = { x: -9999, y: -9999, active: false };
    let hover = 0;
    let surge = 0;
    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const handlePointerLeave = () => { pointer.active = false; };
    const handleClick = () => { surge = 1; };
    if (S.interactive && !reducedMotion) {
      window.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerleave', handlePointerLeave);
      window.addEventListener('blur', handlePointerLeave);
      if (S.clickSurge) window.addEventListener('pointerdown', handleClick);
    }

    let lastTime = 0;
    let slowFrames = 0;
    const render = (time: number) => {
      const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;

      // Eased by frame time, so it feels the same at 60 and 120 Hz
      hover += ((pointer.active ? 1 : 0) - hover) * (1 - Math.pow(0.92, dt * 60));
      surge *= Math.pow(0.94, dt * 60);

      // Follow the photo, it animates in and moves with the layout
      const anchor = anchorRef.current;
      const rect = anchor && anchor.offsetParent ? anchor.getBoundingClientRect() : null;
      const onScreen = !!rect && rect.width > 0 && rect.bottom > 0;
      visible += ((onScreen ? 1 : 0) - visible) * (1 - Math.pow(0.9, dt * 60));
      if (rect && onScreen) {
        gl.uniform2f(uniforms.origin, rect.left + rect.width * headX, rect.top + rect.height * headY);
      }

      // Sustained slow frames: draw fewer pixels
      slowFrames = dt > 0.024 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      if (slowFrames > 30 && quality > 0.5) {
        quality = Math.max(0.5, quality - 0.25);
        slowFrames = 0;
        resize();
      }

      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.scale, scale);
      gl.uniform1f(uniforms.time, (time / 1000) * S.speed);
      gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
      gl.uniform1f(uniforms.hover, hover);
      gl.uniform1f(uniforms.surge, surge);
      gl.uniform1f(uniforms.visible, visible);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let frame = 0;
    const loop = (time: number) => {
      render(time);
      frame = requestAnimationFrame(loop);
    };
    if (reducedMotion) render(8000);
    else frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      window.removeEventListener('pointerdown', handleClick);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, [anchorRef, headX, headY]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ opacity }}
    />
  );
}
