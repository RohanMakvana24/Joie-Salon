'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface LiquidInkPreloaderProps {
  onComplete: () => void;
}

interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  life: number;
  maxLife: number;
  kind: 'ink' | 'water' | 'mist';
}

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  duration: number;
  maxRadius: number;
  strength: number;
}

interface RibbonPoint {
  x: number;
  y: number;
  radius: number;
}

const TOTAL_DURATION = 4.25; // seconds before exit fade starts
const EXIT_FADE_MS = 620;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOutCubic = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const easeOutQuint = (t: number) => 1 - Math.pow(1 - clamp01(t), 5);
const easeOutBack = (t: number) => {
  const x = clamp01(t);
  const c1 = 1.45;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/**
 * Draws a tapered, glossy 3D liquid ribbon from a sequence of center points + radii.
 * Includes deep obsidian body, soft wet edge shading, and a crisp white specular highlight ridge.
 */
function drawGlossyFluidRibbon(
  ctx: CanvasRenderingContext2D,
  points: RibbonPoint[],
  alpha: number,
  mode: 'ink' | 'water' | 'smoke',
) {
  if (points.length < 3 || alpha <= 0.005) return;

  const leftSide: { x: number; y: number }[] = [];
  const rightSide: { x: number; y: number }[] = [];
  const specSide: { x: number; y: number }[] = [];

  for (let i = 0; i < points.length; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const r = points[i].radius;

    leftSide.push({ x: points[i].x + nx * r, y: points[i].y + ny * r });
    rightSide.push({ x: points[i].x - nx * r, y: points[i].y - ny * r });
    specSide.push({
      x: points[i].x + nx * r * 0.42,
      y: points[i].y + ny * r * 0.42 - r * 0.14,
    });
  }

  ctx.save();
  ctx.globalAlpha = clamp01(alpha);

  // Build organic closed liquid contour
  ctx.beginPath();
  ctx.moveTo(leftSide[0].x, leftSide[0].y);
  for (let i = 1; i < leftSide.length - 1; i++) {
    const mx = (leftSide[i].x + leftSide[i + 1].x) * 0.5;
    const my = (leftSide[i].y + leftSide[i + 1].y) * 0.5;
    ctx.quadraticCurveTo(leftSide[i].x, leftSide[i].y, mx, my);
  }
  const tip = points[points.length - 1];
  ctx.lineTo(tip.x, tip.y);

  for (let i = rightSide.length - 1; i > 0; i--) {
    const mx = (rightSide[i].x + rightSide[i - 1].x) * 0.5;
    const my = (rightSide[i].y + rightSide[i - 1].y) * 0.5;
    ctx.quadraticCurveTo(rightSide[i].x, rightSide[i].y, mx, my);
  }
  ctx.closePath();

  const start = points[0];
  const grad = ctx.createLinearGradient(start.x, start.y, tip.x, tip.y);
  if (mode === 'ink') {
    grad.addColorStop(0, '#07080A');
    grad.addColorStop(0.55, '#13161B');
    grad.addColorStop(0.88, '#1E232B');
    grad.addColorStop(1, '#090A0D');
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle dark rim occlusion
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (mode === 'smoke') {
    grad.addColorStop(0, 'rgba(18, 21, 27, 0.58)');
    grad.addColorStop(0.5, 'rgba(54, 60, 70, 0.28)');
    grad.addColorStop(1, 'rgba(110, 118, 130, 0.04)');
    ctx.fillStyle = grad;
    ctx.fill();
  } else {
    // Crystalline translucent water-glass ribbon
    grad.addColorStop(0, 'rgba(165, 175, 188, 0.42)');
    grad.addColorStop(0.45, 'rgba(218, 224, 232, 0.58)');
    grad.addColorStop(0.85, 'rgba(148, 158, 172, 0.36)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = 'rgba(92, 102, 118, 0.24)';
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }

  // Glossy liquid specular highlight curve along upper fluid ridge
  if (mode === 'ink' || mode === 'water') {
    ctx.beginPath();
    ctx.moveTo(specSide[1].x, specSide[1].y);
    for (let i = 2; i < specSide.length - 1; i++) {
      const mx = (specSide[i].x + specSide[i + 1].x) * 0.5;
      const my = (specSide[i].y + specSide[i + 1].y) * 0.5;
      ctx.quadraticCurveTo(specSide[i].x, specSide[i].y, mx, my);
    }
    ctx.strokeStyle =
      mode === 'ink' ? 'rgba(255, 255, 255, 0.48)' : 'rgba(255, 255, 255, 0.92)';
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.2, (tip.radius || 4) * (mode === 'water' ? 0.34 : 0.24));
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws a photorealistic embossed concentric water ripple on the white studio surface.
 */
function drawWaterRipple(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  alpha: number,
  aspectY = 0.88,
) {
  if (radius <= 2 || alpha <= 0.004) return;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, aspectY);

  // Outer soft shadow trough
  const ringThickness = Math.max(8, radius * 0.14);
  const grad = ctx.createRadialGradient(
    0,
    0,
    Math.max(1, radius - ringThickness),
    0,
    0,
    radius + ringThickness,
  );
  grad.addColorStop(0, 'rgba(170, 176, 186, 0)');
  grad.addColorStop(0.35, `rgba(175, 182, 192, ${(alpha * 0.34).toFixed(3)})`);
  grad.addColorStop(0.55, `rgba(255, 255, 255, ${(alpha * 0.82).toFixed(3)})`);
  grad.addColorStop(0.76, `rgba(186, 192, 202, ${(alpha * 0.22).toFixed(3)})`);
  grad.addColorStop(1, 'rgba(186, 192, 202, 0)');

  ctx.beginPath();
  ctx.arc(0, 0, radius + ringThickness, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Subtle specular crescent highlight on upper-left crest of ripple
  ctx.beginPath();
  ctx.arc(0, 0, radius, Math.PI * 1.05, Math.PI * 1.88);
  ctx.strokeStyle = `rgba(255, 255, 255, ${(alpha * 0.65).toFixed(3)})`;
  ctx.lineWidth = Math.max(1.2, ringThickness * 0.12);
  ctx.stroke();

  // Subtle underside shadow arc on lower-right crest of ripple
  ctx.beginPath();
  ctx.arc(0, 0, radius, Math.PI * 0.08, Math.PI * 0.86);
  ctx.strokeStyle = `rgba(148, 156, 168, ${(alpha * 0.28).toFixed(3)})`;
  ctx.lineWidth = Math.max(1.2, ringThickness * 0.12);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws an organic translucent smoky silk veil swirling around the Joie emblem.
 */
function drawSmokySwirlVeil(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  rotation: number,
  alpha: number,
  seedOffset: number,
) {
  if (alpha <= 0.005 || radius <= 2) return;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.globalAlpha = clamp01(alpha);

  const steps = 42;
  const outerPts: { x: number; y: number }[] = [];
  const innerPts: { x: number; y: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const angle = u * Math.PI * 1.68 + seedOffset;
    const wave = Math.sin(u * Math.PI * 3 + seedOffset * 2) * radius * 0.16;
    const taper = Math.sin(u * Math.PI);
    const rCenter = radius * (0.72 + 0.36 * u) + wave;
    const thickness = radius * 0.24 * taper;

    outerPts.push({
      x: Math.cos(angle) * (rCenter + thickness),
      y: Math.sin(angle) * (rCenter + thickness) * 0.94,
    });
    innerPts.push({
      x: Math.cos(angle) * Math.max(2, rCenter - thickness * 0.72),
      y: Math.sin(angle) * Math.max(2, rCenter - thickness * 0.72) * 0.94,
    });
  }

  ctx.beginPath();
  ctx.moveTo(outerPts[0].x, outerPts[0].y);
  for (let i = 1; i < outerPts.length; i++) {
    ctx.lineTo(outerPts[i].x, outerPts[i].y);
  }
  for (let i = innerPts.length - 1; i >= 0; i--) {
    ctx.lineTo(innerPts[i].x, innerPts[i].y);
  }
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, 0, radius * 0.25, 0, 0, radius * 1.45);
  grad.addColorStop(0, 'rgba(18, 22, 28, 0.56)');
  grad.addColorStop(0.55, 'rgba(72, 78, 88, 0.24)');
  grad.addColorStop(1, 'rgba(140, 148, 160, 0.02)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Crisp smoky silk filament edge
  ctx.beginPath();
  ctx.moveTo(outerPts[0].x, outerPts[0].y);
  for (let i = 1; i < outerPts.length; i++) {
    ctx.lineTo(outerPts[i].x, outerPts[i].y);
  }
  ctx.strokeStyle = 'rgba(28, 32, 38, 0.32)';
  ctx.lineWidth = 1.1;
  ctx.stroke();

  ctx.restore();
}

export function LiquidInkPreloader({ onComplete }: LiquidInkPreloaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const completedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);
  const [exiting, setExiting] = useState(false);

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setExiting(true);
    exitTimerRef.current = window.setTimeout(() => {
      onComplete();
    }, EXIT_FADE_MS);
  }, [onComplete]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  // Lock page scroll while preloader is covering the viewport
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      finishIntro();
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Offscreen buffer for alpha-masked metallic sheen sweep on the official Joie Salon logo
    const logoBuffer = document.createElement('canvas');
    const logoCtx = logoBuffer.getContext('2d');

    // Load official transparent RGBA Joie Salon logo (1895 x 333; emblem occupies x: 0..336)
    const logoImg = new Image();
    logoImg.decoding = 'async';
    let logoReady = false;
    logoImg.onload = () => {
      logoReady = true;
    };
    logoImg.src = '/assets/brand/joie-salon-logo.png';
    if (logoImg.complete && logoImg.naturalWidth > 0) {
      logoReady = true;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Ambient micro-droplets & studio sparkles
    const droplets: Droplet[] = [];
    const ripples: Ripple[] = [];
    let splashSpawned = false;
    let streakSplashSpawned = false;
    let waterBurstSpawned = false;

    const ambientMotes = Array.from({ length: 18 }, (_, i) => ({
      x: ((i * 61.8 + 13) % 100) / 100,
      y: ((i * 38.2 + 19) % 100) / 100,
      size: 1.2 + (i % 4) * 0.7,
      phase: i * 1.13,
      speed: 0.4 + (i % 5) * 0.14,
    }));

    const spawnSwirlDroplets = (cx: number, cy: number, radius: number) => {
      for (let i = 0; i < 34; i++) {
        const angle = (i / 34) * Math.PI * 2 + (Math.sin(i * 12.9898) * 0.25);
        const speed = (1.1 + ((i * 7) % 10) * 0.24) * (radius * 0.042);
        const dist = radius * (0.65 + ((i * 13) % 10) * 0.08);
        droplets.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.15,
          r: 1.0 + ((i * 5) % 6) * 0.55,
          alpha: 0.92,
          life: 0,
          maxLife: 1.35 + ((i * 3) % 7) * 0.14,
          kind: i % 5 === 0 ? 'mist' : 'ink',
        });
      }
    };

    const spawnStreakMist = (startX: number, endX: number, cy: number, logoH: number) => {
      for (let i = 0; i < 24; i++) {
        const u = i / 24;
        droplets.push({
          x: lerp(startX, endX, u),
          y: cy + Math.sin(i * 4.3) * logoH * 0.52,
          vx: 0.45 + ((i * 7) % 5) * 0.22,
          vy: Math.cos(i * 3.1) * 0.35,
          r: 0.9 + (i % 4) * 0.42,
          alpha: 0.72,
          life: 0,
          maxLife: 1.25 + (i % 5) * 0.18,
          kind: i % 3 === 0 ? 'mist' : 'ink',
        });
      }
    };

    const spawnWaterExitDroplets = (startX: number, cy: number, logoH: number) => {
      for (let i = 0; i < 22; i++) {
        const spreadY = (Math.sin(i * 9.7) * 0.55) * logoH;
        droplets.push({
          x: startX + (i % 6) * 8,
          y: cy + spreadY,
          vx: 1.2 + ((i * 11) % 10) * 0.32,
          vy: spreadY * 0.015 + Math.cos(i * 5.2) * 0.45,
          r: 1.2 + (i % 5) * 0.65,
          alpha: 0.85,
          life: 0,
          maxLife: 1.15 + (i % 4) * 0.2,
          kind: i % 2 === 0 ? 'water' : 'ink',
        });
      }
    };

    const startNow = performance.now();
    let prevNow = startNow;
    let rafId = 0;

    // Reduced-motion fast path: clean porcelain studio logo reveal
    if (prefersReducedMotion) {
      const quickTimer = window.setTimeout(finishIntro, 1150);
      const drawStatic = () => {
        const bgGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.46,
          Math.min(width, height) * 0.08,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.78,
        );
        bgGrad.addColorStop(0, '#FFFFFF');
        bgGrad.addColorStop(0.68, '#F6F7F9');
        bgGrad.addColorStop(1, '#E7EBEF');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        const logoW = Math.max(210, Math.min(width * 0.72, 460));
        const logoH = logoW / 5.69;
        if (logoReady) {
          ctx.drawImage(logoImg, (width - logoW) * 0.5, (height - logoH) * 0.5, logoW, logoH);
        }
        if (!completedRef.current) rafId = window.requestAnimationFrame(drawStatic);
      };
      rafId = window.requestAnimationFrame(drawStatic);
      return () => {
        window.clearTimeout(quickTimer);
        window.cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
      };
    }

    const render = (now: number) => {
      const elapsed = (now - startNow) / 1000;
      const dt = Math.min(0.033, Math.max(0.004, (now - prevNow) / 1000));
      prevNow = now;

      // Responsive Joie Salon logo metrics centered on stage
      const logoW = Math.max(220, Math.min(width * 0.76, 480));
      const logoH = logoW / (1895 / 333);
      const logoX = (width - logoW) * 0.5;
      const logoY = (height - logoH) * 0.5;

      // Exact Joie emblem & wordmark split coordinates matching joie-salon-logo.png
      const emblemRatio = 336 / 1895;
      const emblemW = logoW * emblemRatio;
      const emblemCX = logoX + emblemW * 0.52;
      const emblemCY = logoY + logoH * 0.5;
      const wordmarkStartX = logoX + emblemW;
      const wordmarkEndX = logoX + logoW;
      const floorY = logoY + logoH * 1.48;

      // 1. Porcelain-White Studio Cyclorama Backdrop
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        Math.min(width, height) * 0.06,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.82,
      );
      bgGrad.addColorStop(0, '#FFFFFF');
      bgGrad.addColorStop(0.62, '#F7F8FA');
      bgGrad.addColorStop(1, '#E8ECF0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle studio diamond glint in lower-right (subtle cinematic nod)
      const glintAlpha = 0.25 + 0.15 * Math.sin(elapsed * 2.4);
      const gx = width * 0.9;
      const gy = height * 0.83;
      const gSize = Math.min(width, height) * 0.022;
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${glintAlpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(gx, gy - gSize);
      ctx.quadraticCurveTo(gx, gy, gx + gSize, gy);
      ctx.quadraticCurveTo(gx, gy, gx, gy + gSize);
      ctx.quadraticCurveTo(gx, gy, gx - gSize, gy);
      ctx.quadraticCurveTo(gx, gy, gx, gy - gSize);
      ctx.fill();
      ctx.restore();

      // Trigger concentric water ripples & droplet bursts at exact choreographic beats
      if (!splashSpawned && elapsed >= 0.72) {
        splashSpawned = true;
        ripples.push(
          { x: emblemCX, y: emblemCY, startTime: elapsed, duration: 2.35, maxRadius: Math.max(width, height) * 0.48, strength: 1 },
          { x: emblemCX, y: emblemCY, startTime: elapsed + 0.16, duration: 2.25, maxRadius: Math.max(width, height) * 0.36, strength: 0.76 },
          { x: emblemCX, y: emblemCY, startTime: elapsed + 0.34, duration: 2.15, maxRadius: Math.max(width, height) * 0.26, strength: 0.52 },
        );
        spawnSwirlDroplets(emblemCX, emblemCY, emblemW * 0.72);
      }
      if (!streakSplashSpawned && elapsed >= 1.62) {
        streakSplashSpawned = true;
        ripples.push({
          x: width * 0.48,
          y: emblemCY,
          startTime: elapsed,
          duration: 1.9,
          maxRadius: Math.max(width, height) * 0.52,
          strength: 0.55,
        });
        spawnStreakMist(wordmarkStartX, wordmarkEndX, emblemCY, logoH);
      }
      if (!waterBurstSpawned && elapsed >= 2.22) {
        waterBurstSpawned = true;
        spawnWaterExitDroplets(wordmarkEndX - logoW * 0.05, emblemCY, logoH);
      }

      // 2. Render Expanding 3D Embossed White Water Ripples
      for (const rip of ripples) {
        const rt = (elapsed - rip.startTime) / rip.duration;
        if (rt <= 0 || rt >= 1) continue;
        const rEase = easeOutCubic(rt);
        const curRadius = 18 + rEase * rip.maxRadius;
        const fade = Math.sin(clamp01(rt) * Math.PI) * (1 - rt * 0.45) * rip.strength;
        drawWaterRipple(ctx, rip.x, rip.y, curRadius, fade, 0.9);
      }

      // 3. Soft Studio Floor Contact Shadow (tracks ink -> emblem -> full wordmark)
      ctx.save();
      let shadowCX = emblemCX;
      let shadowRX = emblemW * 0.65;
      let shadowAlpha = 0;

      if (elapsed < 0.85) {
        const p1 = easeOutCubic(elapsed / 0.85);
        shadowCX = lerp(-logoW * 0.1, emblemCX, p1);
        shadowRX = lerp(logoW * 0.18, emblemW * 0.62, p1);
        shadowAlpha = 0.08 * p1;
      } else if (elapsed < 1.68) {
        const p2 = easeInOutCubic((elapsed - 0.85) / 0.83);
        shadowCX = emblemCX;
        shadowRX = lerp(emblemW * 0.62, emblemW * 0.78, p2);
        shadowAlpha = lerp(0.08, 0.14, p2);
      } else {
        const p3 = easeOutCubic((elapsed - 1.68) / 0.9);
        shadowCX = lerp(emblemCX, logoX + logoW * 0.5, p3);
        shadowRX = lerp(emblemW * 0.78, logoW * 0.54, p3);
        shadowAlpha = lerp(0.14, 0.12, p3);
      }

      const shadowRY = Math.max(4, logoH * 0.11);
      ctx.translate(shadowCX, floorY);
      ctx.scale(1, shadowRY / Math.max(1, shadowRX));
      const shadowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(1, shadowRX));
      shadowGrad.addColorStop(0, `rgba(18, 22, 30, ${shadowAlpha.toFixed(3)})`);
      shadowGrad.addColorStop(0.58, `rgba(18, 22, 30, ${(shadowAlpha * 0.35).toFixed(3)})`);
      shadowGrad.addColorStop(1, 'rgba(18, 22, 30, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, shadowRX), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. PHASE 1 (0.00s -> 1.05s): Glossy Black Liquid Ink Ribbon Whipping in from Left
      if (elapsed < 1.08) {
        const pHead = easeOutCubic(elapsed / 0.84);
        const pTail = easeInOutCubic((elapsed - 0.24) / 0.82);
        const ribbonAlpha = elapsed > 0.86 ? 1 - clamp01((elapsed - 0.86) / 0.22) : 1;

        const segments = 34;
        const pts: RibbonPoint[] = [];
        const startX = -width * 0.08;
        const targetX = emblemCX;
        const ampY = Math.min(height * 0.085, logoH * 0.92);

        for (let i = 0; i <= segments; i++) {
          const u = lerp(pTail, pHead, i / segments);
          const x = lerp(startX, targetX, u);
          // Graceful S-whip crest that arcs up then dips cleanly into the emblem center
          const wave = Math.sin(u * Math.PI * 2.15 - 0.45) * ampY * (1 - u * 0.32);
          const y = emblemCY + wave - Math.sin(u * Math.PI) * ampY * 0.35;
          const localU = i / segments;
          // Organic liquid necking + glossy bulbous head tip
          const pinch = 0.55 + 0.45 * Math.sin(localU * Math.PI * 2.2);
          const headBulb = localU > 0.82 ? 1 + ((localU - 0.82) / 0.18) * 0.72 : 1;
          const tailTaper = Math.pow(localU, 0.72);
          const baseThick = Math.max(5.5, logoH * 0.155);
          const radius = baseThick * tailTaper * pinch * headBulb;

          pts.push({ x, y, radius });
        }

        drawGlossyFluidRibbon(ctx, pts, ribbonAlpha, 'ink');

        // Glossy liquid droplet head sphere at the leading crest
        const headPt = pts[pts.length - 1];
        if (headPt && ribbonAlpha > 0.05) {
          ctx.save();
          ctx.globalAlpha = ribbonAlpha;
          const dropGrad = ctx.createRadialGradient(
            headPt.x - headPt.radius * 0.3,
            headPt.y - headPt.radius * 0.35,
            headPt.radius * 0.12,
            headPt.x,
            headPt.y,
            headPt.radius * 1.15,
          );
          dropGrad.addColorStop(0, '#5A6270');
          dropGrad.addColorStop(0.26, '#15181E');
          dropGrad.addColorStop(1, '#050608');
          ctx.fillStyle = dropGrad;
          ctx.beginPath();
          ctx.arc(headPt.x, headPt.y, headPt.radius * 1.08, 0, Math.PI * 2);
          ctx.fill();

          // Tiny crisp wet catchlight dot on the ink head
          ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
          ctx.beginPath();
          ctx.ellipse(
            headPt.x - headPt.radius * 0.32,
            headPt.y - headPt.radius * 0.32,
            headPt.radius * 0.28,
            headPt.radius * 0.14,
            -0.55,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.restore();
        }
      }

      // 5. PHASE 2 (0.72s -> 1.88s): Translucent Smoky Ink Veils Swirling Around Joie Emblem
      if (elapsed >= 0.7 && elapsed <= 1.92) {
        const sProg = clamp01((elapsed - 0.7) / 1.22);
        const envelope = Math.sin(sProg * Math.PI);
        const contract = lerp(1.36, 0.82, easeOutCubic(sProg));
        const baseR = emblemW * 0.62 * contract;

        drawSmokySwirlVeil(ctx, emblemCX, emblemCY, baseR * 1.16, sProg * 3.1, envelope * 0.92, 0.2);
        drawSmokySwirlVeil(ctx, emblemCX, emblemCY, baseR * 0.94, -sProg * 2.5 + 1.4, envelope * 0.78, 2.1);
        drawSmokySwirlVeil(ctx, emblemCX, emblemCY, baseR * 0.78, sProg * 4.2 + 2.7, envelope * 0.62, 4.4);
      }

      // 6. OFFICIAL JOIE SALON LOGO REVEAL (Emblem coalescence -> Horizontal wordmark wipe -> Metallic sheen)
      if (elapsed >= 0.76 && logoReady && logoCtx) {
        const bufW = Math.max(1, Math.ceil(logoW * dpr));
        const bufH = Math.max(1, Math.ceil(logoH * dpr));
        if (logoBuffer.width !== bufW || logoBuffer.height !== bufH) {
          logoBuffer.width = bufW;
          logoBuffer.height = bufH;
        }

        logoCtx.save();
        logoCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        logoCtx.clearRect(0, 0, logoW, logoH);

        // 6a. Emblem coalescence (0.76s -> 1.52s)
        const embT = clamp01((elapsed - 0.76) / 0.74);
        const embScale = lerp(0.74, 1, easeOutBack(embT));
        const embAlpha = easeOutCubic(clamp01((elapsed - 0.76) / 0.42));

        if (embAlpha > 0.005) {
          logoCtx.save();
          logoCtx.globalAlpha = embAlpha;
          const ecx = emblemW * 0.5;
          const ecy = logoH * 0.5;
          logoCtx.translate(ecx, ecy);
          logoCtx.scale(embScale, embScale);
          logoCtx.rotate(lerp(-0.22, 0, easeOutQuint(embT)));
          logoCtx.drawImage(
            logoImg,
            0,
            0,
            336,
            333,
            -ecx,
            -ecy,
            emblemW,
            logoH,
          );
          logoCtx.restore();
        }

        // 6b. Wordmark horizontal liquid wipe reveal (1.68s -> 2.48s)
        if (elapsed >= 1.66) {
          const wordT = easeOutCubic((elapsed - 1.66) / 0.84);
          const revealRight = emblemW + (logoW - emblemW) * wordT;

          logoCtx.save();
          logoCtx.beginPath();
          logoCtx.rect(emblemW - 2, 0, Math.max(0, revealRight - emblemW + 4), logoH);
          logoCtx.clip();

          logoCtx.drawImage(
            logoImg,
            336,
            0,
            1895 - 336,
            333,
            emblemW,
            0,
            logoW - emblemW,
            logoH,
          );

          // Soft feathery dissolve edge at the advancing ink wavefront
          if (wordT < 0.995) {
            const featherW = Math.max(18, logoW * 0.08);
            logoCtx.globalCompositeOperation = 'destination-out';
            const fadeGrad = logoCtx.createLinearGradient(
              revealRight - featherW,
              0,
              revealRight + 2,
              0,
            );
            fadeGrad.addColorStop(0, 'rgba(0,0,0,0)');
            fadeGrad.addColorStop(1, 'rgba(0,0,0,1)');
            logoCtx.fillStyle = fadeGrad;
            logoCtx.fillRect(revealRight - featherW, 0, featherW + 6, logoH);
          }
          logoCtx.restore();
        }

        // 6c. Wet Glossy Reflection during Emblem Formation + Metallic Specular Sheen Sweep (2.75s -> 3.65s)
        if (elapsed >= 0.85 && elapsed <= 1.75) {
          const wetAlpha = Math.sin(clamp01((elapsed - 0.85) / 0.9) * Math.PI) * 0.32;
          logoCtx.save();
          logoCtx.globalCompositeOperation = 'source-atop';
          const wetGrad = logoCtx.createLinearGradient(0, 0, emblemW, logoH);
          wetGrad.addColorStop(0, `rgba(255,255,255,${wetAlpha.toFixed(3)})`);
          wetGrad.addColorStop(0.45, 'rgba(255,255,255,0)');
          wetGrad.addColorStop(1, `rgba(210,220,235,${(wetAlpha * 0.5).toFixed(3)})`);
          logoCtx.fillStyle = wetGrad;
          logoCtx.fillRect(0, 0, emblemW, logoH);
          logoCtx.restore();
        }

        if (elapsed >= 2.7 && elapsed <= 3.72) {
          const sheenT = easeInOutCubic((elapsed - 2.7) / 0.96);
          const bandX = lerp(-logoW * 0.3, logoW * 1.32, sheenT);
          const bandW = logoW * 0.24;

          logoCtx.save();
          logoCtx.globalCompositeOperation = 'source-atop';
          const sheenGrad = logoCtx.createLinearGradient(
            bandX - bandW,
            0,
            bandX + bandW,
            logoH * 0.55,
          );
          sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          sheenGrad.addColorStop(0.42, 'rgba(225, 232, 242, 0.34)');
          sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.72)');
          sheenGrad.addColorStop(0.58, 'rgba(225, 232, 242, 0.34)');
          sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          logoCtx.fillStyle = sheenGrad;
          logoCtx.fillRect(0, 0, logoW, logoH);
          logoCtx.restore();
        }

        logoCtx.restore();

        // Composite the crisp alpha-masked logo onto the white studio stage
        ctx.drawImage(logoBuffer, 0, 0, bufW, bufH, logoX, logoY, logoW, logoH);
      }

      // 7. PHASE 3 (1.58s -> 2.78s): Horizontal Silk-Ink Whip Streak -> Translucent Water Glass Splash
      if (elapsed >= 1.56 && elapsed <= 2.86) {
        const wProg = clamp01((elapsed - 1.56) / 1.24);
        const headU = easeOutCubic(clamp01((elapsed - 1.56) / 0.92));
        const tailU = easeInOutCubic(clamp01((elapsed - 1.88) / 0.92));

        const streakStartX = logoX + emblemW * 0.88;
        const streakEndX = width + width * 0.08;

        const whipPts: RibbonPoint[] = [];
        const smokePts: RibbonPoint[] = [];
        const count = 34;

        for (let i = 0; i <= count; i++) {
          const frac = i / count;
          const u = lerp(tailU, headU, frac);
          const x = lerp(streakStartX, streakEndX, u);
          const undulate = Math.sin(u * Math.PI * 5 - elapsed * 6) * logoH * 0.11 * Math.sin(frac * Math.PI);
          const y = emblemCY + undulate;

          // Razor-tapered needle point ahead, organic swell near middle
          const bell = Math.sin(frac * Math.PI);
          const inkRadius = Math.max(0.8, logoH * 0.145 * Math.pow(bell, 0.85) * (1 - wProg * 0.42));
          whipPts.push({ x, y, radius: inkRadius });
          smokePts.push({
            x,
            y: y + Math.cos(u * Math.PI * 4) * logoH * 0.09,
            radius: inkRadius * 1.9,
          });
        }

        // Before the wave passes the end of "SALON", it's dark silk ink; past "SALON", it turns into crystal water!
        const crystalMix = clamp01((elapsed - 2.15) / 0.35);
        const fadeOut = elapsed > 2.52 ? 1 - clamp01((elapsed - 2.52) / 0.34) : 1;

        if (crystalMix < 0.95) {
          drawGlossyFluidRibbon(ctx, smokePts, (1 - crystalMix) * 0.72 * fadeOut, 'smoke');
          drawGlossyFluidRibbon(ctx, whipPts, (1 - crystalMix) * 0.95 * fadeOut, 'ink');
        }
        if (crystalMix > 0.02) {
          drawGlossyFluidRibbon(ctx, whipPts, crystalMix * 0.95 * fadeOut, 'water');
        }
      }

      // 8. Update & Draw Physically Simulated Ink & Water Droplets
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];
        d.life += dt;
        if (d.life >= d.maxLife) {
          droplets.splice(i, 1);
          continue;
        }
        // Air drag + gentle gravity drift
        const drag = Math.pow(0.24, dt);
        d.vx *= drag;
        d.vy = d.vy * drag + 10 * dt * (d.kind === 'water' ? 0.65 : 0.25);
        d.x += d.vx * dt * 60;
        d.y += d.vy * dt * 60;

        const lifeRatio = d.life / d.maxLife;
        const fade = lifeRatio < 0.12 ? lifeRatio / 0.12 : 1 - Math.pow((lifeRatio - 0.12) / 0.88, 1.8);
        const curR = d.r * (1 - lifeRatio * 0.35);

        ctx.save();
        ctx.globalAlpha = clamp01(d.alpha * fade);
        if (d.kind === 'water') {
          const wg = ctx.createRadialGradient(
            d.x - curR * 0.3,
            d.y - curR * 0.3,
            curR * 0.1,
            d.x,
            d.y,
            curR,
          );
          wg.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          wg.addColorStop(0.55, 'rgba(182, 192, 206, 0.55)');
          wg.addColorStop(1, 'rgba(100, 110, 126, 0.38)');
          ctx.fillStyle = wg;
          ctx.beginPath();
          ctx.arc(d.x, d.y, curR, 0, Math.PI * 2);
          ctx.fill();
        } else if (d.kind === 'mist') {
          ctx.fillStyle = 'rgba(42, 48, 58, 0.55)';
          ctx.beginPath();
          ctx.arc(d.x, d.y, curR, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#0D0F13';
          ctx.beginPath();
          ctx.arc(d.x, d.y, curR, 0, Math.PI * 2);
          ctx.fill();
          if (curR > 1.7) {
            ctx.fillStyle = 'rgba(255,255,255,0.65)';
            ctx.beginPath();
            ctx.arc(d.x - curR * 0.3, d.y - curR * 0.3, curR * 0.28, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 9. Subtle Studio Air Light Motes during Final Hold
      if (elapsed > 2.3) {
        const moteEnv = clamp01((elapsed - 2.3) / 0.8);
        ctx.save();
        for (const m of ambientMotes) {
          const mx = m.x * width + Math.sin(elapsed * m.speed + m.phase) * 14;
          const my = m.y * height - (elapsed - 2.3) * m.speed * 10;
          const twinkle = 0.25 + 0.75 * Math.abs(Math.sin(elapsed * 1.9 + m.phase));
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.55 * moteEnv * twinkle).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(mx, my, m.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed >= TOTAL_DURATION) {
        finishIntro();
        return;
      }

      if (!completedRef.current) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [finishIntro]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Joie Salon"
      className={`fixed inset-0 z-[9999] bg-[#F7F8FA] transition-all duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        exiting ? 'pointer-events-none opacity-0 scale-[1.03]' : 'opacity-100 scale-100'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={finishIntro}
        className="fixed bottom-6 right-6 z-10 rounded-full border border-[#232C3B]/15 bg-white/75 px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#232C3B]/70 transition-all hover:border-[#232C3B]/35 hover:bg-white hover:text-[#232C3B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#232C3B]/40"
      >
        Skip
      </button>
    </div>
  );
}

export default LiquidInkPreloader;
