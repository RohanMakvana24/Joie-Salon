'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BRIDAL_LOOKS, buildBridalWhatsAppUrl } from '../data/bridalLookbookData';
import { useTheme } from '../hooks/useActivity';
import './OurBridalsSection.css';

const N = BRIDAL_LOOKS.length;
const STEP = (Math.PI * 2) / N;
const STIFF = 95;
const DAMP = 2 * Math.sqrt(STIFF);

const pad = (n: number) => String(n).padStart(2, '0');
const mod = (n: number, m: number) => ((n % m) + m) % m;
const wrapAngle = (a: number) => {
  let x = a % (Math.PI * 2);
  if (x > Math.PI) x -= Math.PI * 2;
  if (x <= -Math.PI) x += Math.PI * 2;
  return x;
};
const shortest = (target: number, from: number) => mod(target - from + N / 2, N) - N / 2;

export const OurBridalsSection: React.FC = () => {
  const theme = useTheme();
  const isLight = theme === 'light';

  const [active, setActiveState] = useState(0);
  const [grid, setGridState] = useState(false);
  const [focusOpen, setFocusOpenState] = useState(false);
  const [drawerOpen, setDrawerOpenState] = useState(false);
  const [autoplay, setAutoplayState] = useState(true);
  const [hotDot, setHotDot] = useState(0);

  const deckRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const loopRingRef = useRef<HTMLSpanElement>(null);
  const modelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const followRef = useRef<HTMLSpanElement>(null);
  const nowRef = useRef<HTMLDivElement>(null);
  const focusStageRef = useRef<HTMLDivElement>(null);
  const focusModelRef = useRef<HTMLDivElement>(null);
  const focusCloseRef = useRef<HTMLButtonElement>(null);
  const drawerBtnRef = useRef<HTMLButtonElement>(null);
  const drawerItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tagRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lineRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Mutable animation & interaction state
  const stateRef = useRef({
    pos: -1.15,
    goal: 0,
    vel: 0,
    active: 0,
    grid: false,
    focusOpen: false,
    drawerOpen: false,
    autoplay: true,
    dragging: false,
    slipHover: false,
    visible: true,
    dirty: true,
    reduced: false,
    W: 1200,
    H: 720,
    mobile: false,
    modelH: 480,
    w: 274,
    dragPx: 300,
    rafId: 0,
    lastT: 0,
    autoTimer: 0 as ReturnType<typeof setTimeout> | number,
    animTimer: 0 as ReturnType<typeof setTimeout> | number,
    focusTimer: 0 as ReturnType<typeof setTimeout> | number,
    wheelTimer: 0 as ReturnType<typeof setTimeout> | number,
    wheelSum: 0,
    wheelLock: false,
    dragEnd: 0,
    // Follow cursor state
    hasFollow: false,
    fX: 0,
    fY: 0,
    ftX: 0,
    ftY: 0,
    fRaf: 0,
    // Pointer drag state
    pId: -1,
    pStartX: 0,
    pStartY: 0,
    pStartGoal: 0,
    pMode: '' as '' | 'drag' | 'abort',
    trail: [] as { x: number; t: number }[],
    // Cached per-body values
    lastOp: new Array<string>(N).fill(''),
    lastFilter: new Array<string>(N).fill(''),
  });

  useEffect(() => {
    const s = stateRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    s.reduced = reduced;
    if (reduced) {
      s.pos = 0;
      s.autoplay = false;
      setAutoplayState(false);
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    s.hasFollow = finePointer;
    if (finePointer && deckRef.current) {
      deckRef.current.classList.add('has-follow');
    }

    const place = (
      el: HTMLDivElement | null,
      idx: number,
      x: number,
      y: number,
      sc: number,
      op: number,
      blur: number,
      z: number
    ) => {
      if (!el) return;
      let finalOp = op;
      if (x + (s.w * sc) / 2 < -4 || x - (s.w * sc) / 2 > s.W + 4) {
        finalOp = 0;
      }
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${(y - s.H).toFixed(1)}px, 0) translateX(-50%) scale(${sc.toFixed(4)})`;
      const opStr = finalOp.toFixed(3);
      if (s.lastOp[idx] !== opStr) {
        s.lastOp[idx] = opStr;
        el.style.opacity = opStr;
        el.style.visibility = finalOp < 0.01 ? 'hidden' : 'visible';
        el.style.pointerEvents = finalOp < 0.5 ? 'none' : 'auto';
      }
      const fStr = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : 'none';
      if (s.lastFilter[idx] !== fStr) {
        s.lastFilter[idx] = fStr;
        el.style.filter = fStr;
      }
      el.style.zIndex = String(z);
    };

    const layoutRing = () => {
      if (s.grid) return;
      const { W, H, mobile, modelH, pos } = s;
      const topPad = mobile ? 140 : 170;
      const bottomPad = mobile ? 100 : 96;
      const innerH = Math.max(240, H - topPad - bottomPad);

      const cx = W * 0.5;
      const cy = topPad + innerH * 0.5;
      const ry = innerH * (mobile ? 0.30 : 0.34);
      const rx = Math.min(W * (mobile ? 0.33 : 0.32), ry * (mobile ? 1.15 : 1.9));
      const frontH = Math.min(H * (mobile ? 0.42 : 0.50), W * (mobile ? 0.70 : 0.82));
      const front = frontH / modelH;

      if (stageRef.current) {
        stageRef.current.style.setProperty('--loop-y', `${(cy - frontH * 0.28).toFixed(1)}px`);
        stageRef.current.style.setProperty('--ring-y', `${cy.toFixed(1)}px`);
      }
      if (loopRingRef.current) {
        loopRingRef.current.style.width = `${(2 * rx).toFixed(1)}px`;
        loopRingRef.current.style.height = `${(2 * ry).toFixed(1)}px`;
      }

      for (let i = 0; i < N; i++) {
        const a = wrapAngle((i - pos) * STEP);
        const depth = (1 + Math.cos(a)) / 2;
        const dist = Math.abs(a) / STEP;
        const near = Math.max(0, Math.min(1, 1 - dist));
        const sc = front * (0.5 + 0.5 * depth) * (1 + 0.14 * near);
        const modelHeight = modelH * sc;
        const halfWidth = (s.w * sc) / 2;
        const x = Math.max(halfWidth + 12, Math.min(W - halfWidth - 12, cx + rx * Math.sin(a)));
        const baseline = cy + ry * Math.cos(a) + modelHeight * 0.08;
        const y = Math.max(modelHeight + (mobile ? 66 : 18), Math.min(H - bottomPad, baseline));
        const blur = Math.max(0, (1 - depth) * 2.2 - 0.3);
        const z = Math.round(depth * 1000) + 10;
        place(modelRefs.current[i], i, x, y, sc, 1, blur, z);
      }
    };

    const layoutGrid = () => {
      const { W, H, mobile, modelH } = s;
      const top = mobile ? 58 : 66;
      const bottomRes = mobile ? 86 : 80;
      const cols = mobile ? 2 : 3;
      const rows = Math.ceil(N / cols);
      const rowH = (H - bottomRes - top) / rows;
      const colW = W / cols;
      const sc = Math.max(0.2, Math.min(rowH - 42, (colW * 7) / 4 * 0.88) / modelH);

      for (let i = 0; i < N; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = colW * (col + 0.5);
        const y = top + rowH * (row + 1) - 28;
        place(modelRefs.current[i], i, x, y, sc, 1, 0, 10 + row);
        const lbl = labelRefs.current[i];
        if (lbl) {
          lbl.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + 10).toFixed(1)}px, 0) translateX(-50%)`;
        }
      }
    };

    const kick = () => {
      if (s.rafId || !s.visible) return;
      s.lastT = 0;
      s.rafId = requestAnimationFrame(tick);
    };

    const tick = (t: number) => {
      s.rafId = 0;
      const dt = s.lastT ? Math.min(0.034, (t - s.lastT) / 1000) : 1 / 60;
      s.lastT = t;

      let moving = false;
      if (s.reduced) {
        s.pos = s.goal;
        s.vel = 0;
      } else {
        const h = dt / 3;
        for (let step = 0; step < 3; step++) {
          const acc = -STIFF * (s.pos - s.goal) - DAMP * s.vel;
          s.vel += acc * h;
          s.pos += s.vel * h;
        }
        if (Math.abs(s.pos - s.goal) <= 5e-4 && Math.abs(s.vel) <= 5e-4) {
          s.pos = s.goal;
          s.vel = 0;
        } else {
          moving = true;
        }
      }

      if (moving || s.dirty || s.dragging) {
        s.dirty = false;
        if (!s.grid) layoutRing();
      }

      if (deckRef.current) {
        deckRef.current.classList.toggle('is-moving', moving || s.dragging);
      }

      if (moving || s.dragging) {
        s.rafId = requestAnimationFrame(tick);
      }
    };

    const measure = () => {
      const stage = stageRef.current;
      if (!stage) return;
      s.W = stage.clientWidth || 1000;
      s.H = stage.clientHeight || 640;
      s.mobile = window.innerWidth < 810;
      const topPad = s.mobile ? 140 : 170;
      const bottomPad = s.mobile ? 100 : 96;
      s.modelH = Math.max(200, Math.round((s.H - bottomPad - 18 - topPad) / 1.12));
      s.w = (s.modelH * 4) / 7;
      s.dragPx = Math.max(s.mobile ? 90 : 120, s.W * 0.3);
      stage.style.setProperty('--model-h', `${s.modelH}px`);
      if (s.grid) layoutGrid();
      s.dirty = true;
      kick();
    };

    const scheduleAuto = () => {
      clearTimeout(s.autoTimer as number);
      if (!s.autoplay) return;
      s.autoTimer = setTimeout(() => {
        if (
          s.visible &&
          !s.dragging &&
          !document.hidden &&
          !s.slipHover &&
          !s.focusOpen &&
          !s.grid &&
          !s.drawerOpen
        ) {
          goTo(Math.round(s.goal) + 1);
        } else {
          scheduleAuto();
        }
      }, 5000);
    };

    const triggerSwapAndGlint = () => {
      if (s.reduced) return;
      if (stageRef.current) {
        stageRef.current.classList.remove('is-glint');
        void stageRef.current.offsetWidth;
        stageRef.current.classList.add('is-glint');
      }
      if (nowRef.current) {
        nowRef.current.classList.remove('is-swap');
        void nowRef.current.offsetWidth;
        nowRef.current.classList.add('is-swap');
      }
    };

    const setActive = (i: number, quiet = false) => {
      const nextIdx = mod(i, N);
      if (nextIdx === s.active && !quiet) return;
      s.active = nextIdx;
      setActiveState(nextIdx);
      if (!quiet) {
        triggerSwapAndGlint();
      }
      scheduleAuto();
    };

    const goTo = (g: number) => {
      s.goal = g;
      setActive(mod(Math.round(g), N));
      kick();
    };

    // Expose helpers on window-less ref for React handlers
    (stageRef.current as HTMLDivElement & { __bridalApi?: Record<string, unknown> }).__bridalApi = {
      goTo,
      setActive,
      layoutGrid,
      layoutRing,
      kick,
      scheduleAuto,
    };

    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);

    const io = new IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1];
        s.visible = Boolean(last?.isIntersecting);
        if (s.visible) kick();
      },
      { threshold: 0.05 }
    );
    if (stageRef.current) io.observe(stageRef.current);

    const onVis = () => {
      if (!document.hidden) {
        kick();
        scheduleAuto();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    measure();
    setActive(0, true);
    scheduleAuto();
    kick();

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(s.rafId);
      cancelAnimationFrame(s.fRaf);
      clearTimeout(s.autoTimer as number);
      clearTimeout(s.animTimer as number);
      clearTimeout(s.focusTimer as number);
      clearTimeout(s.wheelTimer as number);
    };
  }, []);

  const getApi = () =>
    (stageRef.current as (HTMLDivElement & { __bridalApi?: {
      goTo: (g: number) => void;
      setActive: (i: number, quiet?: boolean) => void;
      layoutGrid: () => void;
      layoutRing: () => void;
      kick: () => void;
      scheduleAuto: () => void;
    } }) | null)?.__bridalApi;

  const stopAuto = () => {
    const s = stateRef.current;
    if (!s.autoplay) return;
    s.autoplay = false;
    setAutoplayState(false);
    clearTimeout(s.autoTimer as number);
  };

  const toggleAuto = () => {
    const s = stateRef.current;
    s.autoplay = !s.autoplay;
    setAutoplayState(s.autoplay);
    if (s.autoplay) getApi()?.scheduleAuto();
    else clearTimeout(s.autoTimer as number);
  };

  const jumpTo = (i: number) => {
    const s = stateRef.current;
    getApi()?.goTo(Math.round(s.goal) + shortest(i, s.active));
  };

  const setGrid = (on: boolean) => {
    const s = stateRef.current;
    if (on === s.grid || s.focusOpen) return;
    stopAuto();
    s.grid = on;
    setGridState(on);

    for (let i = 0; i < N; i++) {
      const el = modelRefs.current[i];
      if (!el) continue;
      const ringIdx = Math.round((Math.abs(wrapAngle((i - s.pos) * STEP)) / Math.PI) * 3);
      el.style.setProperty('--d', `${(ringIdx * (on ? 0.28 : 0.22)).toFixed(2)}s`);
    }

    if (deckRef.current) {
      deckRef.current.classList.add('is-anim');
      clearTimeout(s.animTimer as number);
      s.animTimer = setTimeout(() => {
        deckRef.current?.classList.remove('is-anim');
      }, s.reduced ? 0 : 1650);
    }

    if (on) {
      getApi()?.layoutGrid();
    } else {
      s.lastOp.fill('');
      s.lastFilter.fill('');
      s.dirty = true;
      getApi()?.layoutRing();
      getApi()?.kick();
    }
  };

  const openFocus = (overrideIndex?: number) => {
    const s = stateRef.current;
    if (s.focusOpen) return;
    stopAuto();
    setHotDot(0);
    if (s.drawerOpen) {
      s.drawerOpen = false;
      setDrawerOpenState(false);
    }

    const idx = overrideIndex !== undefined ? overrideIndex : s.active;
    if (overrideIndex !== undefined && overrideIndex !== s.active) {
      s.active = overrideIndex;
      setActiveState(overrideIndex);
    }

    const srcFig = modelRefs.current[idx]?.querySelector('.bridal-model__fig');
    const srcRect = srcFig?.getBoundingClientRect();

    s.focusOpen = true;
    setFocusOpenState(true);

    requestAnimationFrame(() => {
      const fStage = focusStageRef.current;
      const fModel = focusModelRef.current;
      if (!fStage || !fModel) return;
      const r = fStage.getBoundingClientRect();
      const h = Math.max(180, Math.min(r.height, r.width / (4 / 7)));
      fModel.style.setProperty('--model-h', `${h.toFixed(0)}px`);

      if (!s.reduced && srcRect && srcRect.height > 0) {
        const dstRect = fModel.getBoundingClientRect();
        const dx = srcRect.left - dstRect.left;
        const dy = srcRect.bottom - dstRect.bottom;
        const sc = srcRect.height / dstRect.height;
        fModel.style.transition = 'none';
        fModel.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
        void fModel.offsetWidth;
        fModel.style.transition = '';
        fModel.style.transform = '';
      }

      focusCloseRef.current?.focus({ preventScroll: true });
    });
  };

  const closeFocus = () => {
    const s = stateRef.current;
    if (!s.focusOpen) return;
    const fModel = focusModelRef.current;
    const srcFig = modelRefs.current[s.active]?.querySelector('.bridal-model__fig');
    const dstRect = srcFig?.getBoundingClientRect();

    if (!s.reduced && fModel && dstRect && dstRect.height > 0) {
      const curRect = fModel.getBoundingClientRect();
      const dx = dstRect.left - curRect.left;
      const dy = dstRect.bottom - curRect.bottom;
      const sc = dstRect.height / curRect.height;
      fModel.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
    }

    s.focusOpen = false;
    setFocusOpenState(false);
    setHotDot(0);
    stageRef.current?.focus({ preventScroll: true });
  };

  const setDrawer = (open: boolean) => {
    const s = stateRef.current;
    if (open === s.drawerOpen) return;
    if (open) {
      stopAuto();
      if (s.focusOpen) closeFocus();
      s.drawerOpen = true;
      setDrawerOpenState(true);
      requestAnimationFrame(() => {
        drawerItemRefs.current[s.active]?.focus({ preventScroll: true });
      });
    } else {
      s.drawerOpen = false;
      setDrawerOpenState(false);
      drawerBtnRef.current?.focus({ preventScroll: true });
    }
  };

  // Follow cursor lerp
  const updateFollow = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s.hasFollow || e.pointerType !== 'mouse' || !stageRef.current || !followRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    s.ftX = e.clientX - rect.left;
    s.ftY = e.clientY - rect.top;

    const fEl = followRef.current;
    if (!fEl.classList.contains('is-on')) {
      s.fX = s.ftX;
      s.fY = s.ftY;
      fEl.style.transform = `translate3d(${s.fX.toFixed(1)}px, ${s.fY.toFixed(1)}px, 0)`;
      fEl.classList.add('is-on');
    }

    const hit = (e.target as HTMLElement).closest('.bridal-model__hit') as HTMLElement | null;
    if (hit && !s.dragging && !s.focusOpen) {
      const idx = Number(hit.dataset.i);
      const isFront = s.grid || mod(Math.round(s.goal), N) === idx;
      fEl.classList.toggle('is-view', isFront);
      fEl.classList.toggle('is-link', !isFront);
    } else {
      fEl.classList.remove('is-view', 'is-link');
    }

    const isPin =
      s.focusOpen &&
      Boolean((e.target as HTMLElement).closest('.bridal-tag, .bridal-focus__close, .bridal-slip'));
    fEl.classList.toggle('is-pin', isPin);

    if (!s.fRaf) {
      const stepFollow = () => {
        s.fRaf = 0;
        const lerp = s.reduced ? 1 : 0.18;
        s.fX += (s.ftX - s.fX) * lerp;
        s.fY += (s.ftY - s.fY) * lerp;
        if (followRef.current) {
          followRef.current.style.transform = `translate3d(${s.fX.toFixed(1)}px, ${s.fY.toFixed(1)}px, 0)`;
        }
        if (Math.hypot(s.ftX - s.fX, s.ftY - s.fY) > 0.4) {
          s.fRaf = requestAnimationFrame(stepFollow);
        }
      };
      s.fRaf = requestAnimationFrame(stepFollow);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (s.focusOpen || s.grid) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    s.pId = e.pointerId;
    s.pStartX = e.clientX;
    s.pStartY = e.clientY;
    s.pStartGoal = s.goal;
    s.pMode = '';
    s.trail = [{ x: e.clientX, t: performance.now() }];
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    updateFollow(e);
    const s = stateRef.current;
    if (s.pId !== e.pointerId || s.pMode === 'abort') return;
    if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) {
      finishPointer(e);
      return;
    }

    const dx = e.clientX - s.pStartX;
    const dy = e.clientY - s.pStartY;
    if (!s.pMode) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        s.pMode = 'abort';
        return;
      }
      if (Math.abs(dx) > 8 && Math.abs(dx) > 1.2 * Math.abs(dy)) {
        s.pMode = 'drag';
        s.dragging = true;
        deckRef.current?.classList.add('is-dragging');
        try {
          stageRef.current?.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        stopAuto();
      } else {
        return;
      }
    }

    s.trail.push({ x: e.clientX, t: performance.now() });
    if (s.trail.length > 6) s.trail.shift();
    s.goal = s.pStartGoal - dx / s.dragPx;
    getApi()?.setActive(mod(Math.round(s.goal), N));
    getApi()?.kick();
  };

  const finishPointer = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (s.pId !== e.pointerId) return;
    const wasDrag = s.pMode === 'drag';
    s.pId = -1;
    s.pMode = '';
    if (!wasDrag) return;

    s.dragging = false;
    deckRef.current?.classList.remove('is-dragging');
    s.dragEnd = performance.now();

    const first = s.trail[0];
    const last = s.trail[s.trail.length - 1];
    const dt = last && first ? Math.max(1, last.t - first.t) : 1;
    const v = last && first ? (last.x - first.x) / dt : 0;
    const base = Math.round(s.pStartGoal);
    const dx = e.clientX - s.pStartX;

    let target: number;
    if (s.mobile) {
      target = Math.abs(dx) > 30 || Math.abs(v) > 0.3 ? base + (dx < 0 ? 1 : -1) : base;
    } else {
      target = Math.round(s.goal - (v * 160) / s.dragPx);
      if (target === base && Math.abs(v) > 0.3) target = base + (v < 0 ? 1 : -1);
      target = Math.max(base - 2, Math.min(base + 2, target));
    }
    getApi()?.goTo(target);
  };

  const handleStageClick = (e: React.MouseEvent) => {
    const s = stateRef.current;
    if (performance.now() - s.dragEnd < 60) return;
    const hit = (e.target as HTMLElement).closest('.bridal-model__hit') as HTMLElement | null;
    if (!hit) return;
    const idx = Number(hit.dataset.i);
    if (s.grid) {
      s.goal = s.pos = idx;
      s.vel = 0;
      openFocus(idx);
      return;
    }
    const d = shortest(idx, Math.round(s.goal));
    if (d === 0) {
      openFocus();
    } else {
      stopAuto();
      getApi()?.goTo(Math.round(s.goal) + d);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const s = stateRef.current;
    if (s.focusOpen || s.grid) return;
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    if (s.wheelLock) return;
    s.wheelSum += e.deltaX;
    if (Math.abs(s.wheelSum) > 45) {
      stopAuto();
      getApi()?.goTo(Math.round(s.goal) + (s.wheelSum > 0 ? 1 : -1));
      s.wheelSum = 0;
      s.wheelLock = true;
      clearTimeout(s.wheelTimer as number);
      s.wheelTimer = setTimeout(() => {
        s.wheelLock = false;
      }, 520);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const s = stateRef.current;
    if (e.key === 'Escape') {
      if (s.focusOpen) closeFocus();
      else if (s.drawerOpen) setDrawer(false);
      return;
    }
    if (s.focusOpen) return;
    if (e.key === 'ArrowRight') {
      stopAuto();
      getApi()?.goTo(Math.round(s.goal) + 1);
    } else if (e.key === 'ArrowLeft') {
      stopAuto();
      getApi()?.goTo(Math.round(s.goal) - 1);
    } else if (s.grid && e.key === 'ArrowDown') {
      stopAuto();
      jumpTo(mod(s.active + 3, N));
    } else if (s.grid && e.key === 'ArrowUp') {
      stopAuto();
      jumpTo(mod(s.active - 3, N));
    } else if (e.key === 'Enter') {
      if (s.grid) {
        s.goal = s.pos = s.active;
        s.vel = 0;
      }
      openFocus();
    }
  };

  const fitTip = (p: number) => {
    const tag = tagRefs.current[p - 1];
    const stage = focusStageRef.current;
    if (!tag || !stage) return;
    tag.classList.remove('is-flip');
    const tip = tag.querySelector('.bridal-tag__tip') as HTMLElement | null;
    if (!tip) return;
    const tRect = tag.getBoundingClientRect();
    const sRect = stage.getBoundingClientRect();
    if (tRect.right + tip.offsetWidth > sRect.right - 8 && tRect.left - tip.offsetWidth >= sRect.left + 8) {
      tag.classList.add('is-flip');
    }
  };

  const activateHot = (p: number, scroll = false) => {
    setHotDot(p);
    if (p > 0) {
      fitTip(p);
      if (scroll) {
        lineRefs.current[p - 1]?.scrollIntoView({
          block: 'nearest',
          behavior: stateRef.current.reduced ? 'auto' : 'smooth',
        });
      }
    }
  };

  const activeLook = BRIDAL_LOOKS[active];

  return (
    <section
      id="bridals"
      aria-labelledby="bridals-heading"
      className="bridal-section relative pt-20 md:pt-24 pb-6 overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: isLight ? '#F5F6F7' : '#0B0806' }}
    >
      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* Centered Header matching Signature Packages */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center gap-2.5 mb-3.5">
            <span className="h-px w-7 bg-[#E5B96F]" />
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#E5B96F]">
              BRIDAL COUTURE · RAJKOT
            </p>
            <span className="h-px w-7 bg-[#E5B96F]" />
          </div>

          <h2
            id="bridals-heading"
            className={`font-display uppercase text-4xl sm:text-5xl md:text-[3.5rem] tracking-[-0.01em] leading-tight ${
              isLight ? 'text-[#232C3B]' : 'text-[#F7F1E8]'
            }`}
          >
            OUR{' '}
            <span
              className={`bg-gradient-to-b bg-clip-text text-transparent ${
                isLight
                  ? 'from-[#5C392E] via-[#4C2E26] to-[#2A170F]'
                  : 'from-[#FFF2C6] via-[#E5B96F] to-[#C28B37]'
              }`}
            >
              BRIDALS
            </span>
          </h2>

          <p className={`mt-3 text-sm sm:text-base leading-relaxed ${isLight ? 'text-[#4B5563]' : 'text-[#C9B8A6]'}`}>
            Explore bridal looks for your wedding celebrations. Select a look to see the makeup and styling details.
          </p>
        </div>
      </div>

      {/* Full-Bleed Interactive Circle Lookbook Deck */}
      <div
        ref={deckRef}
          className={`bridal-deck ${grid ? 'is-grid' : ''} ${focusOpen ? 'is-focus' : ''} ${drawerOpen ? 'is-drawer' : ''}`}
          onKeyDown={handleKeyDown}
        >
          <div
            ref={stageRef}
            className="bridal-deck__stage"
            tabIndex={0}
            role="region"
            aria-roledescription={grid ? 'grid of bridal looks' : 'carousel'}
            aria-label="Our Bridals — arrow keys turn the ring, Enter opens View Bridal"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointer}
            onPointerCancel={finishPointer}
            onPointerLeave={() => followRef.current?.classList.remove('is-on', 'is-view', 'is-link')}
            onClick={handleStageClick}
            onWheel={handleWheel}
          >
            <span ref={loopRingRef} className="bridal-loop__ring" aria-hidden="true" />

            <div className="bridal-loop" aria-hidden="true">
              <p className="bridal-loop__t">
                Bridal<br />Couture
              </p>
              <p className="bridal-loop__s">Vol. 01 — {pad(N)} looks</p>
            </div>

            {/* 6 Rotating Bridal Models */}
            <div className="bridal-deck__crowd">
              {BRIDAL_LOOKS.map((look, i) => (
                <div
                  key={look.id}
                  ref={(el) => {
                    modelRefs.current[i] = el;
                  }}
                  className="bridal-model"
                  style={{ '--foot': look.foot } as React.CSSProperties}
                >
                  <div className="bridal-model__fig">
                    <span className="bridal-model__shadow" aria-hidden="true" />
                    <img
                      className="bridal-model__pic"
                      src={look.image}
                      alt={look.name}
                      draggable={false}
                      decoding="async"
                    />
                    <button
                      type="button"
                      className="bridal-model__hit"
                      data-i={i}
                      tabIndex={active === i ? 0 : -1}
                      aria-label={`Look ${pad(i + 1)}: ${look.name}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Grid Labels */}
            <div className="bridal-deck__labels" aria-hidden="true">
              {BRIDAL_LOOKS.map((look, i) => (
                <span
                  key={look.id}
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  className={`bridal-label bridal-cap ${active === i ? 'is-on' : ''}`}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  {pad(i + 1)}&nbsp;&nbsp;{look.name}
                </span>
              ))}
            </div>

            <span className="bridal-glint" aria-hidden="true" />

            {/* Follow Cursor */}
            <span ref={followRef} className="bridal-follow" aria-hidden="true">
              <span className="bridal-follow__in">
                <b className="f-drag">Drag</b>
                <b className="f-view">View</b>
              </span>
            </span>
          </div>

          {/* Left Vertical "Bridals" Drawer Button */}
          <button
            ref={drawerBtnRef}
            type="button"
            className="bridal-looksbtn bridal-pill"
            aria-expanded={drawerOpen}
            aria-controls="bridal-drawer"
            onClick={() => setDrawer(!drawerOpen)}
          >
            Bridals
          </button>

          {/* Right Vertical Ring / Grid Toggle */}
          <div className="bridal-view" role="group" aria-label="View mode">
            <button
              type="button"
              className="bridal-vbtn"
              aria-pressed={!grid}
              onClick={() => setGrid(false)}
            >
              Ring
            </button>
            <button
              type="button"
              className="bridal-vbtn"
              aria-pressed={grid}
              onClick={() => setGrid(true)}
            >
              Grid
            </button>
          </div>

          {/* Bottom Dock */}
          <div className="bridal-dock">
            <div ref={nowRef} className="bridal-dock__now">
              <div className="bridal-dock__count">
                <span className="bridal-cap">
                  {pad(active + 1)} / {pad(N)}
                </span>
                <button
                  type="button"
                  className="bridal-auto"
                  aria-label="Autoplay bridal ring"
                  aria-pressed={autoplay}
                  onClick={toggleAuto}
                >
                  {autoplay ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M6.5 4.5h3.5v15H6.5zM14 4.5h3.5v15H14z" />
                    </svg>
                  ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M7 4.5v15l12.5-7.5z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="bridal-dock__name">{activeLook.name}</div>
            </div>

            <button
              type="button"
              className="bridal-dock__shop"
              aria-label="View Bridal"
              onClick={() => openFocus()}
            >
              <span className="bridal-cap">View Bridal</span>
              <span className="bridal-dock__dot" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M12 4v16M4 12h16" />
                </svg>
              </span>
            </button>
          </div>

          {/* Left Slide-out Bridals Drawer */}
          <div id="bridal-drawer" className="bridal-drawer" aria-hidden={!drawerOpen}>
            <div className="bridal-drawer__top">
              <span className="bridal-cap">Our Bridals · Vol. 01</span>
              <button type="button" className="bridal-pill" onClick={() => setDrawer(false)}>
                Close
              </button>
            </div>
            <ol className="bridal-drawer__list">
              {BRIDAL_LOOKS.map((look, i) => (
                <li key={look.id}>
                  <button
                    ref={(el) => {
                      drawerItemRefs.current[i] = el;
                    }}
                    type="button"
                    className="bridal-drawer__item"
                    aria-current={active === i ? 'true' : 'false'}
                    onClick={() => {
                      jumpTo(i);
                      setDrawer(false);
                    }}
                  >
                    <span className="bridal-cap">{pad(i + 1)}</span>
                    <span className="bridal-drawer__name">{look.name}</span>
                    <span className="bridal-drawer__meta">{look.duration}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Advanced Animated Focus View (FLIP + Dots + Thermal Receipt Slip) */}
          <div className="bridal-focus" aria-hidden={!focusOpen}>
            <div className="bridal-focus__top">
              <p className="bridal-focus__cap">
                <span>{pad(active + 1)}.</span>
                <i>{activeLook.name}</i>
              </p>
              <button
                ref={focusCloseRef}
                type="button"
                className="bridal-focus__close"
                aria-label="Close View Bridal"
                onClick={closeFocus}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>

            <div
              ref={focusStageRef}
              className="bridal-focus__stage"
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest('.bridal-model__fig')) closeFocus();
              }}
            >
              <div
                ref={focusModelRef}
                className="bridal-focus__model"
                style={{ '--foot': activeLook.foot } as React.CSSProperties}
              >
                <div className="bridal-model__fig">
                  <span className="bridal-model__shadow" aria-hidden="true" />
                  <img
                    className="bridal-model__pic"
                    src={activeLook.image}
                    alt={activeLook.name}
                    draggable={false}
                  />
                  <div className="bridal-tags">
                    {activeLook.details.map((detail, idx) => {
                      const p = idx + 1;
                      return (
                        <button
                          key={detail.name}
                          ref={(el) => {
                            tagRefs.current[idx] = el;
                          }}
                          type="button"
                          className={`bridal-tag ${hotDot === p ? 'is-hot' : ''}`}
                          style={{ left: `${detail.x}%`, top: `${detail.y}%`, '--pi': p } as React.CSSProperties}
                          aria-label={`${pad(p)}: ${detail.name} — ${detail.note}`}
                          onPointerEnter={() => activateHot(p, false)}
                          onFocus={() => activateHot(p, false)}
                          onClick={(e) => {
                            e.stopPropagation();
                            activateHot(p, true);
                          }}
                        >
                          <span className="bridal-dotnum">{pad(p)}</span>
                          <span className="bridal-tag__tip">
                            <b>{detail.name}</b>
                            <span>{detail.kind}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <p className="bridal-focus__hint bridal-cap">Tap a dot to inspect bridal craft</p>
          </div>

          {/* Printed Atelier Receipt Slip */}
          <aside
            className="bridal-slip"
            aria-label="Bridal look breakdown"
            aria-hidden={!focusOpen}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') stateRef.current.slipHover = true;
            }}
            onPointerLeave={() => {
              stateRef.current.slipHover = false;
              setHotDot(0);
            }}
          >
            <div className="bridal-slip__head">
              <div className="bridal-slip__logo">JOIE SALON</div>
              <span className="bridal-cap">Bridal Studio · Rajkot</span>
              <span className="bridal-cap">
                Look {pad(active + 1)} — {activeLook.name}
              </span>
            </div>

            <ul className="bridal-slip__lines">
              {activeLook.details.map((detail, idx) => {
                const p = idx + 1;
                return (
                  <li
                    key={detail.name}
                    ref={(el) => {
                      lineRefs.current[idx] = el;
                    }}
                    className={`bridal-line ${hotDot === p ? 'is-hot' : ''}`}
                    onPointerEnter={() => activateHot(p, false)}
                    onClick={() => activateHot(p, false)}
                  >
                    <span className="bridal-line__num">{pad(p)}</span>
                    <span className="bridal-line__name">
                      {detail.name} · <i>{detail.kind}</i>
                    </span>
                    <span className="bridal-line__note">{detail.note}</span>
                  </li>
                );
              })}
            </ul>

            <div className="bridal-slip__bundle">
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="bridal-cap opacity-70">Occasion</span>
                <span className="font-medium">{activeLook.occasion}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="bridal-cap opacity-70">Session</span>
                <span className="font-medium">{activeLook.duration}</span>
              </div>
              <a
                href={buildBridalWhatsAppUrl(activeLook)}
                target="_blank"
                rel="noopener noreferrer"
                className="bridal-slip__cta"
              >
                <span>Book This Bridal Look</span>
                <svg width="18" height="10" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 7h24M19 1l6 6-6 6" />
                </svg>
              </a>
            </div>

            <div className="bridal-slip__foot" aria-hidden="true">
              <div className="bridal-slip__code" />
              <span className="bridal-cap">Adding joy to every style</span>
            </div>
          </aside>
      </div>
    </section>
  );
};
