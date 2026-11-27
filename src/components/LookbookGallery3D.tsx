'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { LeafThroughObject, withSoftBasicShadows } from 'leafthrough';
import { BookOpen, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { LOOKBOOK_VOLUMES, type LookbookVolume } from '../data/lookbookBooks';
import {
  LookbookTextureBank,
  PAGE_ASPECT,
  renderLookbookPageToCanvas,
} from '../lib/lookbookPageRenderer';

type ShelfMode = 'single' | 'duo' | 'trio';

function shouldTurnBack(visiblePages: number[], pageCount: number, reversing: boolean): boolean {
  if (visiblePages.includes(pageCount - 1)) return true;
  return !visiblePages.includes(0) && reversing;
}

interface LookbookGallery3DProps {
  theme: 'light' | 'dark';
}

interface BookSlotTransform {
  visible: boolean;
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
}

interface BookRuntime {
  volume: LookbookVolume;
  index: number;
  slot: THREE.Group;
  hitMesh: THREE.Mesh;
  magazine: LeafThroughObject;
  textureBank: LookbookTextureBank;
  currentPage: number;
  visiblePages: number[];
  visualCenterX: number;
  target: BookSlotTransform;
}

function getShelfMode(width: number): ShelfMode {
  if (width < 680) return 'single';
  if (width < 1040) return 'duo';
  return 'trio';
}

function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false });
    return Boolean(gl);
  } catch {
    return false;
  }
}

function formatSpreadLabel(
  visiblePages: number[],
  pageCount: number,
  mode: ShelfMode,
): string {
  if (!visiblePages.length) return 'Cover';
  const first = visiblePages[0];
  const last = visiblePages[visiblePages.length - 1];
  const interiorTotal = Math.max(1, pageCount - 2);

  if (first === 0 && last === 0) return 'Front Cover';
  if (first === pageCount - 1 && last === pageCount - 1) return 'Back Cover';

  if (mode === 'single') {
    const p = first;
    if (p <= 0) return 'Front Cover';
    if (p >= pageCount - 1) return 'Back Cover';
    return `${String(p).padStart(2, '0')} / ${String(interiorTotal).padStart(2, '0')}`;
  }

  const left = Math.max(1, first);
  const right = Math.min(interiorTotal, last);
  if (left === right) {
    return `Plate ${String(left).padStart(2, '0')} / ${String(interiorTotal).padStart(2, '0')}`;
  }
  return `Pages ${String(left).padStart(2, '0')}–${String(right).padStart(2, '0')} / ${String(interiorTotal).padStart(2, '0')}`;
}

function computeVisualCenterOffset(
  visiblePages: number[],
  pageCount: number,
  isSpread: boolean,
): number {
  if (!isSpread) {
    // In single-page layout the resting sheet spans x in [0, 1]
    return 0.5;
  }
  const first = visiblePages[0] ?? 0;
  const last = visiblePages[visiblePages.length - 1] ?? 0;
  if (first === 0 && last === 0) return 0.5; // Closed front cover sits on [0, 1]
  if (first === pageCount - 1 && last === pageCount - 1) return -0.5; // Back cover rests on [-1, 0]
  return 0; // Open spread spans [-1, 1]
}

function getVisibleCaptions(volume: LookbookVolume, visiblePages: number[]) {
  const uniqueTitles: string[] = [];
  const descriptions: string[] = [];
  for (const pIdx of visiblePages) {
    const spec = volume.pages[pIdx];
    if (!spec) continue;
    if (spec.layout === 'front-cover') {
      uniqueTitles.push(`${volume.roman} · ${volume.title}`);
      descriptions.push(volume.subtitle);
    } else if (spec.layout === 'back-cover') {
      uniqueTitles.push(`${volume.roman} · Edition Colophon`);
      descriptions.push(spec.body ?? volume.editionNote);
    } else if (spec.heading) {
      uniqueTitles.push(spec.heading);
      if (spec.body) descriptions.push(spec.body);
    }
  }
  return {
    title: uniqueTitles[0] ?? volume.title,
    subtitle: descriptions[0] ?? volume.subtitle,
  };
}

/**
 * Fallback 2D Book Reader when WebGL is unavailable on the host device.
 */
function FallbackEditorialReader({
  theme,
  activeVolumeIdx,
  onSelectVolume,
}: {
  theme: 'light' | 'dark';
  activeVolumeIdx: number;
  onSelectVolume: (index: number) => void;
}) {
  const volume = LOOKBOOK_VOLUMES[activeVolumeIdx];
  const [pageIdx, setPageIdx] = useState(0);
  const [reversing, setReversing] = useState(false);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setPageIdx(0);
    setReversing(false);
  }, [activeVolumeIdx]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 680;
  const visiblePages = useMemo(() => {
    if (isMobile) return [pageIdx];
    if (pageIdx === 0) return [0];
    if (pageIdx >= volume.pages.length - 1) return [volume.pages.length - 1];
    const left = pageIdx % 2 === 1 ? pageIdx : pageIdx - 1;
    return [left, Math.min(left + 1, volume.pages.length - 1)];
  }, [isMobile, pageIdx, volume.pages.length]);

  useEffect(() => {
    let cancelled = false;
    const width = isMobile ? 480 : 580;
    if (visiblePages.length === 1 && rightCanvasRef.current) {
      renderLookbookPageToCanvas(rightCanvasRef.current, volume, visiblePages[0], width).catch(() => {});
    } else if (visiblePages.length === 2) {
      if (leftCanvasRef.current && !cancelled) {
        renderLookbookPageToCanvas(leftCanvasRef.current, volume, visiblePages[0], width).catch(() => {});
      }
      if (rightCanvasRef.current && !cancelled) {
        renderLookbookPageToCanvas(rightCanvasRef.current, volume, visiblePages[1], width).catch(() => {});
      }
    }
    return () => {
      cancelled = true;
    };
  }, [isMobile, visiblePages, volume]);

  const goNext = useCallback(() => {
    setPageIdx((p) => {
      if (isMobile) return Math.min(volume.pages.length - 1, p + 1);
      if (p === 0) return 1;
      return Math.min(volume.pages.length - 1, p + 2);
    });
  }, [isMobile, volume.pages.length]);

  const goPrev = useCallback(() => {
    setPageIdx((p) => {
      if (isMobile) return Math.max(0, p - 1);
      if (p <= 1) return 0;
      if (p >= volume.pages.length - 1) return volume.pages.length - 3;
      return Math.max(0, p - 2);
    });
  }, [isMobile, volume.pages.length]);

  const turnBack = shouldTurnBack(visiblePages, volume.pages.length, reversing);
  const continueReading = () => {
    setReversing(turnBack);
    if (turnBack) goPrev();
    else goNext();
  };
  const caption = getVisibleCaptions(volume, visiblePages);
  const borderColor = theme === 'light' ? 'border-[#232C3B]/15' : 'border-white/15';
  const textPrimary = theme === 'light' ? 'text-[#232C3B]' : 'text-[#F5F6F7]';
  const textMuted = theme === 'light' ? 'text-[#4B5563]' : 'text-[#C9B8A6]';

  return (
    <div
      className="flex flex-col items-center gap-6 py-4"
      onPointerDown={(e) => {
        swipeStart.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        if (!swipeStart.current) return;
        const dx = e.clientX - swipeStart.current.x;
        const dy = e.clientY - swipeStart.current.y;
        swipeStart.current = null;
        if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) goNext();
          else goPrev();
        }
      }}
    >
      <div className="flex max-w-full items-center justify-center gap-1 sm:gap-2 sm:px-2">
        {visiblePages.length === 2 && (
          <canvas
            ref={leftCanvasRef}
            onClick={goPrev}
            className={`min-w-0 max-h-[510px] w-auto cursor-pointer rounded-l-sm shadow-2xl border ${borderColor}`}
            aria-label={volume.pages[visiblePages[0]]?.alt}
          />
        )}
        <canvas
          ref={rightCanvasRef}
          onClick={continueReading}
          className={`min-w-0 max-h-[540px] w-auto cursor-pointer rounded-r-sm shadow-2xl border sm:max-h-[510px] ${borderColor}`}
          aria-label={volume.pages[visiblePages[visiblePages.length - 1]]?.alt}
        />
      </div>

      <div className="text-center px-4">
        <p className={`font-serif text-base sm:text-lg ${textPrimary}`}>{caption.title}</p>
        <p className={`mt-1 text-xs sm:text-sm ${textMuted}`}>{caption.subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          disabled={pageIdx === 0}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${borderColor} ${textPrimary} disabled:opacity-35`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className={`font-mono text-[11px] uppercase tracking-[0.2em] ${textMuted}`}>
          {formatSpreadLabel(visiblePages, volume.pages.length, isMobile ? 'single' : 'trio')}
        </span>
        <button
          type="button"
          onClick={continueReading}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${borderColor} ${textPrimary} disabled:opacity-35`}
          aria-label={turnBack ? 'Turn back one page' : 'Next page'}
          title={turnBack ? 'Turn back one page' : 'Next page'}
        >
          {turnBack ? <RotateCcw className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {LOOKBOOK_VOLUMES.map((vol, idx) => (
          <button
            key={vol.id}
            type="button"
            onClick={() => onSelectVolume(idx)}
            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition ${
              idx === activeVolumeIdx
                ? `${textPrimary} border-b border-current font-semibold`
                : `${textMuted} opacity-75 hover:opacity-100`
            }`}
          >
            {vol.roman} · {vol.shortTitle}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LookbookGallery3D({ theme }: LookbookGallery3DProps) {
  const stageHostRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  const [shelfMode, setShelfMode] = useState<ShelfMode>('trio');
  const [activeBookIdx, setActiveBookIdx] = useState<number>(1); // Middle volume starts in center spotlight
  const [pageInfo, setPageInfo] = useState<{ page: number; visiblePages: number[]; pageCount: number }>({
    page: 0,
    visiblePages: [0],
    pageCount: LOOKBOOK_VOLUMES[1].pages.length,
  });
  const [hoveredSideIdx, setHoveredSideIdx] = useState<number | null>(null);
  const [webglReady, setWebglReady] = useState<boolean>(true);
  const [reversing, setReversing] = useState(false);

  const shelfModeRef = useRef<ShelfMode>('trio');
  const activeIdxRef = useRef<number>(1);
  const savedPagesRef = useRef<number[]>([0, 0, 0]);
  const pendingRestoreTimerRef = useRef<number | null>(null);
  const hoveredSideRef = useRef<number | null>(null);
  const runtimesRef = useRef<BookRuntime[]>([]);
  const requestDrawRef = useRef<() => void>(() => {});
  const syncTargetsRef = useRef<() => void>(() => {});
  const themeRef = useRef(theme);
  const floorMaterialRef = useRef<THREE.ShadowMaterial | null>(null);
  const lightsRef = useRef<{ hemi: THREE.HemisphereLight; sun: THREE.DirectionalLight } | null>(null);

  themeRef.current = theme;

  // Measure actual container width for responsive 1 / 2 / 3 book layout
  useEffect(() => {
    const el = stageHostRef.current;
    if (!el) return;

    const updateSize = () => {
      const w = el.clientWidth || window.innerWidth;
      const nextMode = getShelfMode(w);
      if (nextMode !== shelfModeRef.current) {
        shelfModeRef.current = nextMode;
        setShelfMode(nextMode);
        syncTargetsRef.current();
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Dynamically update lighting & shadow opacity when light/dark theme toggles
  useEffect(() => {
    const floorMat = floorMaterialRef.current;
    if (floorMat) {
      floorMat.opacity = theme === 'light' ? 0.14 : 0.34;
      floorMat.needsUpdate = true;
    }
    const lights = lightsRef.current;
    if (lights) {
      lights.hemi.intensity = theme === 'light' ? 1.85 : 1.55;
      lights.sun.intensity = theme === 'light' ? 1.75 : 2.05;
    }
    requestDrawRef.current();
  }, [theme]);

  const selectBook = useCallback((nextIdx: number) => {
    const runtimes = runtimesRef.current;
    const prevIdx = activeIdxRef.current;
    if (nextIdx < 0 || nextIdx >= LOOKBOOK_VOLUMES.length) return;

    if (pendingRestoreTimerRef.current !== null) {
      window.clearTimeout(pendingRestoreTimerRef.current);
      pendingRestoreTimerRef.current = null;
    }

    if (prevIdx !== nextIdx && runtimes.length) {
      const prevBook = runtimes[prevIdx];
      const nextBook = runtimes[nextIdx];

      // Save reading progress for previous book & neatly close it as it slides to the side shelf
      savedPagesRef.current[prevIdx] = prevBook.currentPage;
      prevBook.magazine.enabled = false;
      if (prevBook.currentPage > 0) {
        prevBook.magazine.goTo(0, { animate: true });
      }

      activeIdxRef.current = nextIdx;
      setActiveBookIdx(nextIdx);
      setReversing(false);
      nextBook.magazine.enabled = true;

      // Update UI immediately with destination volume state
      setPageInfo({
        page: nextBook.magazine.page,
        visiblePages: nextBook.magazine.visiblePages,
        pageCount: nextBook.volume.pages.length,
      });

      const targetWidth = shelfModeRef.current === 'single' ? 720 : 800;
      const saved = savedPagesRef.current[nextIdx] ?? 0;

      // Prioritise textures for newly active book
      void nextBook.textureBank.renderPages([0, 1, 2, saved, saved + 1], targetWidth, true);

      // Restore previous page if reader had already opened this volume
      if (saved > 0) {
        pendingRestoreTimerRef.current = window.setTimeout(() => {
          if (activeIdxRef.current === nextIdx) {
            nextBook.magazine.goTo(saved, { animate: true });
          }
        }, 280);
      }

      syncTargetsRef.current();
      requestDrawRef.current();
    } else {
      activeIdxRef.current = nextIdx;
      setActiveBookIdx(nextIdx);
    }
  }, []);

  // Main Three.js + LeafThroughObject Scene Setup
  useEffect(() => {
    const mount = canvasHostRef.current;
    if (!mount) return;

    if (!detectWebGLSupport()) {
      setWebglReady(false);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglReady(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSingleInit = shelfModeRef.current === 'single';
    const dprCap = isSingleInit ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    // BasicShadowMap paired with LeafThrough's withSoftBasicShadows avoids Safari/WebKit shadow bugs
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.outline = 'none';
    renderer.domElement.style.touchAction = 'pan-y pinch-zoom';
    renderer.domElement.setAttribute(
      'aria-label',
      'Joie Salon 3D Lookbook shelf. Drag or click pages to flip, click side books to focus, or use Left and Right arrow keys.',
    );
    renderer.domElement.tabIndex = 0;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.2, 40);
    camera.position.set(0, 0, 5.2);
    camera.lookAt(0, 0, 0);

    const hemi = new THREE.HemisphereLight(
      '#FFFDF9',
      '#B5ACA0',
      themeRef.current === 'light' ? 1.85 : 1.55,
    );
    scene.add(hemi);

    const sunPos: [number, number, number] = [-3.2, 2.4, 5.8];
    const sun = new THREE.DirectionalLight(
      '#FFF8EE',
      themeRef.current === 'light' ? 1.75 : 2.05,
    );
    sun.position.set(...sunPos);
    sun.castShadow = !isSingleInit;
    const shadowRes = isSingleInit ? 512 : 1024;
    sun.shadow.mapSize.set(shadowRes, shadowRes);
    Object.assign(sun.shadow.camera, {
      left: -4.2,
      right: 4.2,
      top: 2.2,
      bottom: -2.2,
      near: 0.5,
      far: 16,
    });
    sun.shadow.bias = -0.0008;
    sun.shadow.normalBias = 0.002;
    scene.add(sun, sun.target);
    lightsRef.current = { hemi, sun };

    const rimLight = new THREE.DirectionalLight('#F4DEC0', 0.48);
    rimLight.position.set(3.2, 1.4, 3.4);
    scene.add(rimLight);

    const floorMat = new THREE.ShadowMaterial({
      opacity: themeRef.current === 'light' ? 0.14 : 0.34,
    });
    floorMat.onBeforeCompile = (program) => {
      program.fragmentShader = withSoftBasicShadows(program.fragmentShader);
    };
    floorMaterialRef.current = floorMat;

    const floorGeo = new THREE.PlaneGeometry(24, 14);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, 0, -0.002);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    let needsRender = true;
    let isDisposed = false;
    let isVisibleInViewport = true;
    let pointerTiltX = 0;
    let pointerTiltY = 0;
    let smoothTiltX = 0;
    let smoothTiltY = 0;

    const requestDraw = () => {
      needsRender = true;
    };
    requestDrawRef.current = requestDraw;

    // Invisible hit-plane geometry shared for side-book click detection
    const sideHitGeo = new THREE.PlaneGeometry(1.06, PAGE_ASPECT + 0.08);
    const sideHitMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    const initialMode = shelfModeRef.current;
    const initialTexWidth = initialMode === 'single' ? 720 : 800;

    const runtimes: BookRuntime[] = LOOKBOOK_VOLUMES.map((volume, idx) => {
      const slot = new THREE.Group();
      scene.add(slot);

      const textureBank = new LookbookTextureBank(volume, maxAnisotropy, () => {
        requestDraw();
      });

      const isActive = idx === activeIdxRef.current;
      const layoutMode = initialMode === 'single' ? 'single' : 'spread';

      const magazine = new LeafThroughObject(
        { renderer, camera, domElement: renderer.domElement },
        {
          pages: volume.pages.map((spec, pIdx) => ({
            src: textureBank.textures[pIdx],
            alt: spec.alt,
            text: spec.text,
          })),
          startPage: 0,
          layout: layoutMode,
          pageAspect: PAGE_ASPECT,
          loop: false,
          preload: Infinity,
          paper: {
            grain: true,
            grainScale: 1.5,
            grainStrength: 0.14,
            inkGloss: 0.3,
            roughness: 0.56,
            metalness: 0.08,
            backColor: volume.paperTone,
            showThrough: 0.03,
            wrinkles: 0.9,
            bulge: 1,
          },
          lighting: {
            shadows: true,
            sun: { position: sunPos },
          },
          motion: {
            speed: 1.05,
            curl: 1,
            hoverLift: prefersReducedMotion ? 0 : 0.035,
            reducedMotion: 'auto',
          },
          interaction: {
            drag: true,
            click: true,
            hold: true,
            hover: !prefersReducedMotion,
            keyboard: false, // Handled coherently at gallery controller level
          },
        },
      );

      magazine.enabled = isActive;
      slot.add(magazine);

      const hitMesh = new THREE.Mesh(sideHitGeo, sideHitMat);
      hitMesh.position.set(0, 0, 0.06);
      hitMesh.userData.bookIndex = idx;
      hitMesh.visible = !isActive;
      slot.add(hitMesh);

      const initialVisible = [0];
      const runtime: BookRuntime = {
        volume,
        index: idx,
        slot,
        hitMesh,
        magazine,
        textureBank,
        currentPage: 0,
        visiblePages: initialVisible,
        visualCenterX: computeVisualCenterOffset(initialVisible, volume.pages.length, layoutMode === 'spread'),
        target: {
          visible: true,
          x: 0,
          y: 0,
          z: 0,
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          scale: 1,
        },
      };

      magazine.position.x = -runtime.visualCenterX;

      magazine.addEventListener('change', () => {
        requestDraw();
      });

      magazine.addEventListener('pagechange', (e) => {
        const { page, visiblePages, pageCount } = e.detail;
        runtime.currentPage = page;
        runtime.visiblePages = visiblePages;

        if (activeIdxRef.current === idx) {
          savedPagesRef.current[idx] = page;
          setPageInfo({ page, visiblePages, pageCount });

          // Lazy render adjacent spreads around the active reading position
          const minV = visiblePages[0] ?? page;
          const maxV = visiblePages[visiblePages.length - 1] ?? page;
          const toLoad = [minV - 2, minV - 1, minV, maxV, maxV + 1, maxV + 2, maxV + 3];
          const tw = shelfModeRef.current === 'single' ? 720 : 800;
          void textureBank.renderPages(toLoad, tw, true);
        }
        requestDraw();
      });

      // Hydrate covers immediately, plus first two interior pages for the active hero volume
      const initPages = isActive ? [0, 1, 2, 3] : [0];
      void textureBank.renderPages(initPages, initialTexWidth, isActive);

      return runtime;
    });

    runtimesRef.current = runtimes;

    // Assign world shelf transforms cleanly for Trio (3), Duo (2), or Single (1)
    const syncTargets = (snap = false) => {
      const mode = shelfModeRef.current;
      const active = activeIdxRef.current;
      const hovered = hoveredSideRef.current;
      const leftIdx = (active + 2) % 3;
      const rightIdx = (active + 1) % 3;

      // Toggle floor & shadow pass: spread lays flat on z=0; single rolls pages behind spine
      floorMesh.position.z = mode === 'single' ? -0.45 : -0.002;
      floorMesh.visible = mode !== 'single';
      sun.castShadow = mode !== 'single';

      runtimes.forEach((rt, idx) => {
        const targetLayout = mode === 'single' ? 'single' : 'spread';
        if (rt.magazine.layout !== targetLayout) {
          rt.magazine.update({ layout: targetLayout });
          if (idx === active) {
            rt.currentPage = rt.magazine.page;
            rt.visiblePages = rt.magazine.visiblePages;
            setPageInfo({
              page: rt.magazine.page,
              visiblePages: rt.magazine.visiblePages,
              pageCount: rt.volume.pages.length,
            });
          }
        }

        const isActive = idx === active;
        rt.magazine.enabled = isActive;
        rt.hitMesh.visible = !isActive;

        if (mode === 'single') {
          rt.target = {
            visible: isActive,
            x: 0.08,
            y: 0,
            z: 0,
            rotX: 0,
            rotY: 0,
            rotZ: 0,
            scale: 1,
          };
        } else if (mode === 'duo') {
          if (isActive) {
            rt.target = {
              visible: true,
              x: -0.46,
              y: 0,
              z: 0.04,
              rotX: 0,
              rotY: 0,
              rotZ: 0,
              scale: 0.94,
            };
          } else if (idx === rightIdx) {
            const lift = hovered === idx ? 0.1 : 0;
            rt.target = {
              visible: true,
              x: 1.38,
              y: -0.02,
              z: -0.46 + lift,
              rotX: -0.03,
              rotY: hovered === idx ? -0.26 : -0.38,
              rotZ: 0.015,
              scale: 0.78,
            };
          } else {
            rt.target = {
              visible: false,
              x: -2.4,
              y: 0,
              z: -1.1,
              rotX: 0,
              rotY: 0.5,
              rotZ: 0,
              scale: 0.7,
            };
          }
        } else {
          // Trio Desktop Arrangement: center focal hero + symmetric angled left & right volumes
          if (isActive) {
            rt.target = {
              visible: true,
              x: 0,
              y: 0,
              z: 0.05,
              rotX: 0,
              rotY: 0,
              rotZ: 0,
              scale: 1,
            };
          } else if (idx === leftIdx) {
            const lift = hovered === idx ? 0.12 : 0;
            rt.target = {
              visible: true,
              x: -2.02,
              y: -0.02,
              z: -0.52 + lift,
              rotX: -0.035,
              rotY: hovered === idx ? 0.28 : 0.42,
              rotZ: -0.02,
              scale: 0.8,
            };
          } else {
            const lift = hovered === idx ? 0.12 : 0;
            rt.target = {
              visible: true,
              x: 2.02,
              y: -0.02,
              z: -0.52 + lift,
              rotX: -0.035,
              rotY: hovered === idx ? -0.28 : -0.42,
              rotZ: 0.02,
              scale: 0.8,
            };
          }
        }

        if (snap) {
          rt.slot.visible = rt.target.visible;
          rt.slot.position.set(rt.target.x, rt.target.y, rt.target.z);
          rt.slot.rotation.set(rt.target.rotX, rt.target.rotY, rt.target.rotZ);
          rt.slot.scale.setScalar(rt.target.scale);
        }
      });

      requestDraw();
    };

    syncTargetsRef.current = () => syncTargets(prefersReducedMotion);
    syncTargets(true);

    // Dynamic responsive camera framing so 1 / 2 / 3 books never clip or overflow
    const fitCamera = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      const mode = shelfModeRef.current;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mode === 'single' ? 1.5 : 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.zoom = mode === 'single' ? 1.16 : 1.06;

      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      const tanHalfV = Math.tan(fovRad / 2);
      const tanHalfH = tanHalfV * camera.aspect;

      // Bounding stage width & height in world space per layout mode
      const stageSpan =
        mode === 'trio'
          ? { w: 5.15, h: PAGE_ASPECT * 1.28 }
          : mode === 'duo'
            ? { w: 3.4, h: PAGE_ASPECT * 1.32 }
            : { w: 1.58, h: PAGE_ASPECT * 1.36 };

      const distH = stageSpan.h / (2 * tanHalfV);
      const distW = stageSpan.w / (2 * tanHalfH);
      const dist = Math.max(distH, distW);

      camera.position.set(0, 0, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      requestDraw();
    };

    fitCamera();
    const resizeObserver = new ResizeObserver(fitCamera);
    resizeObserver.observe(mount);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisibleInViewport = entries[entries.length - 1]?.isIntersecting ?? true;
        if (isVisibleInViewport) requestDraw();
      },
      { rootMargin: '120px 0px' },
    );
    intersectionObserver.observe(mount);

    // Pointer interaction for side-book hover, click-to-center, and subtle 3D tilt
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    let downInfo: { x: number; y: number; sideBook: number | null } | null = null;

    const raycastSideBook = (clientX: number, clientY: number): number | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNDC, camera);

      const candidates = runtimes
        .filter((rt) => rt.slot.visible && rt.hitMesh.visible)
        .map((rt) => rt.hitMesh);
      if (!candidates.length) return null;

      const hits = raycaster.intersectObjects(candidates, false);
      if (!hits.length) return null;
      const idx = hits[0].object.userData.bookIndex;
      return typeof idx === 'number' ? idx : null;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width && rect.height && !prefersReducedMotion) {
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        const activeBook = runtimes[activeIdxRef.current];
        const isDraggingPage = activeBook?.magazine.turning ?? false;
        pointerTiltY = isDraggingPage ? 0 : THREE.MathUtils.clamp(nx, -1, 1) * 0.052;
        pointerTiltX = isDraggingPage ? 0 : THREE.MathUtils.clamp(ny, -1, 1) * 0.032;
        requestDraw();
      }

      const activeBook = runtimes[activeIdxRef.current];
      if (activeBook?.magazine.covers(e.clientX, e.clientY)) {
        if (hoveredSideRef.current !== null) {
          hoveredSideRef.current = null;
          setHoveredSideIdx(null);
          syncTargets();
        }
        renderer.domElement.style.cursor = 'grab';
        return;
      }

      const sideHit = raycastSideBook(e.clientX, e.clientY);
      if (sideHit !== hoveredSideRef.current) {
        hoveredSideRef.current = sideHit;
        setHoveredSideIdx(sideHit);
        syncTargets();
      }
      renderer.domElement.style.cursor = sideHit !== null ? 'pointer' : '';
    };

    const onPointerLeave = () => {
      pointerTiltX = 0;
      pointerTiltY = 0;
      if (hoveredSideRef.current !== null) {
        hoveredSideRef.current = null;
        setHoveredSideIdx(null);
        syncTargets();
      }
      renderer.domElement.style.cursor = '';
      requestDraw();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const activeBook = runtimes[activeIdxRef.current];
      if (activeBook?.magazine.covers(e.clientX, e.clientY)) {
        downInfo = null;
        return;
      }
      const sideHit = raycastSideBook(e.clientX, e.clientY);
      downInfo = { x: e.clientX, y: e.clientY, sideBook: sideHit };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!downInfo || downInfo.sideBook === null) {
        downInfo = null;
        return;
      }
      const moved = Math.hypot(e.clientX - downInfo.x, e.clientY - downInfo.y);
      const clickedBook = downInfo.sideBook;
      downInfo = null;
      if (moved < 8) {
        selectBook(clickedBook);
      }
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglReady(false);
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    let lastNow = performance.now();
    const damp = (cur: number, target: number, lambda: number, dt: number) =>
      THREE.MathUtils.lerp(cur, target, 1 - Math.exp(-lambda * dt));

    renderer.setAnimationLoop((now) => {
      if (isDisposed || !isVisibleInViewport || document.hidden) return;
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;

      let moving = false;

      const tiltLambda = prefersReducedMotion ? 30 : 6;
      const nextTiltX = damp(smoothTiltX, pointerTiltX, tiltLambda, dt);
      const nextTiltY = damp(smoothTiltY, pointerTiltY, tiltLambda, dt);
      if (Math.abs(nextTiltX - smoothTiltX) > 1e-4 || Math.abs(nextTiltY - smoothTiltY) > 1e-4) {
        moving = true;
      }
      smoothTiltX = nextTiltX;
      smoothTiltY = nextTiltY;

      const slotLambda = prefersReducedMotion ? 35 : 8.5;

      for (const rt of runtimes) {
        if (rt.magazine.tick(now)) moving = true;

        const isActive = rt.index === activeIdxRef.current;
        const isSpread = rt.magazine.layout === 'spread';
        const targetCenter = computeVisualCenterOffset(rt.visiblePages, rt.volume.pages.length, isSpread);
        const nextCenter = damp(rt.visualCenterX, targetCenter, slotLambda, dt);
        if (Math.abs(nextCenter - rt.visualCenterX) > 1e-4) {
          rt.visualCenterX = nextCenter;
          moving = true;
        }
        rt.magazine.position.x = -rt.visualCenterX;

        if (!rt.target.visible && rt.slot.scale.x < 0.05) {
          rt.slot.visible = false;
          continue;
        }
        rt.slot.visible = true;

        const goalScale = rt.target.visible ? rt.target.scale : 0.01;
        const goalRotX = rt.target.rotX + (isActive ? smoothTiltX : 0);
        const goalRotY = rt.target.rotY + (isActive ? smoothTiltY : 0);

        const dx = Math.abs(rt.slot.position.x - rt.target.x);
        const dz = Math.abs(rt.slot.position.z - rt.target.z);
        const dry = Math.abs(rt.slot.rotation.y - goalRotY);
        const ds = Math.abs(rt.slot.scale.x - goalScale);
        if (dx > 5e-4 || dz > 5e-4 || dry > 5e-4 || ds > 5e-4) {
          moving = true;
        }

        rt.slot.position.x = damp(rt.slot.position.x, rt.target.x, slotLambda, dt);
        rt.slot.position.y = damp(rt.slot.position.y, rt.target.y, slotLambda, dt);
        rt.slot.position.z = damp(rt.slot.position.z, rt.target.z, slotLambda, dt);
        rt.slot.rotation.x = damp(rt.slot.rotation.x, goalRotX, slotLambda, dt);
        rt.slot.rotation.y = damp(rt.slot.rotation.y, goalRotY, slotLambda, dt);
        rt.slot.rotation.z = damp(rt.slot.rotation.z, rt.target.rotZ, slotLambda, dt);
        rt.slot.scale.setScalar(damp(rt.slot.scale.x, goalScale, slotLambda, dt));
      }

      if (moving || needsRender) {
        if (floorMesh.visible) {
          renderer.shadowMap.needsUpdate = true;
        }
        renderer.render(scene, camera);
        needsRender = false;
      }
    });

    return () => {
      isDisposed = true;
      if (pendingRestoreTimerRef.current !== null) {
        window.clearTimeout(pendingRestoreTimerRef.current);
      }
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);

      runtimes.forEach((rt) => {
        rt.magazine.dispose();
        rt.textureBank.dispose();
      });
      runtimesRef.current = [];
      sideHitGeo.dispose();
      sideHitMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      sun.shadow.map?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [selectBook]);

  const continueReading = useCallback(() => {
    const magazine = runtimesRef.current[activeIdxRef.current]?.magazine;
    if (!magazine || magazine.turning) return;
    const turnBack = shouldTurnBack(magazine.visiblePages, magazine.pageCount, reversing);
    const turned = turnBack ? magazine.prev() : magazine.next();
    if (turned) setReversing(turnBack);
  }, [reversing]);

  // Keyboard navigation when focused inside the lookbook gallery region
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;

      const active = runtimesRef.current[activeIdxRef.current];
      if (!active) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        continueReading();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        active.magazine.prev();
      } else if (e.key === 'Home' || e.key === 'Escape') {
        e.preventDefault();
        active.magazine.goTo(0, { animate: true });
      } else if (e.key === 'End') {
        e.preventDefault();
        active.magazine.goTo(active.volume.pages.length - 1, { animate: true });
      } else if (e.key === '1' || e.key === '2' || e.key === '3') {
        selectBook(Number(e.key) - 1);
      }
    },
    [continueReading, selectBook],
  );

  const activeVolume = LOOKBOOK_VOLUMES[activeBookIdx];
  const activeCaption = getVisibleCaptions(activeVolume, pageInfo.visiblePages);
  const isAtStart = pageInfo.page === 0;
  const turnBack = shouldTurnBack(pageInfo.visiblePages, pageInfo.pageCount, reversing);

  const borderTone = theme === 'light' ? 'border-[#232C3B]/15' : 'border-white/15';
  const primaryText = theme === 'light' ? 'text-[#232C3B]' : 'text-[#F5F6F7]';
  const mutedText = theme === 'light' ? 'text-[#4B5563]' : 'text-[#C9B8A6]';
  const accentText = theme === 'light' ? 'text-[#6D4C3D]' : 'text-[#DFC28C]';

  if (!webglReady) {
    return (
      <FallbackEditorialReader
        theme={theme}
        activeVolumeIdx={activeBookIdx}
        onSelectVolume={setActiveBookIdx}
      />
    );
  }

  return (
    <div
      ref={stageHostRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Joie Salon 3D Lookbook Library"
      className="relative w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-[#DFC28C]/60"
    >
      {/* 3D Interactive Book Canvas Stage */}
      <div
        ref={canvasHostRef}
        className="relative mx-auto h-[480px] w-full sm:h-[520px] lg:h-[580px]"
      />

      {/* Side-book hover label cue on desktop/tablet */}
      {shelfMode !== 'single' && (
        <div className="pointer-events-none mx-auto -mt-2 mb-2 flex min-h-[20px] items-center justify-center">
          <p className={`font-mono text-[10px] uppercase tracking-[0.22em] transition-opacity duration-200 ${mutedText}`}>
            {hoveredSideIdx !== null
              ? `Click to inspect ${LOOKBOOK_VOLUMES[hoveredSideIdx].roman} · ${LOOKBOOK_VOLUMES[hoveredSideIdx].shortTitle}`
              : shelfMode === 'trio'
                ? 'Drag or click pages to turn · Click side volumes to switch'
                : 'Drag or click pages to turn · Tap side volume to focus'}
          </p>
        </div>
      )}

      {/* Active Spread Editorial Caption + Page Controls */}
      <div className="mx-auto mt-2 flex max-w-2xl flex-col items-center px-3 text-center">
        <p className={`font-mono text-[10px] uppercase tracking-[0.24em] ${accentText}`}>
          {activeVolume.roman} · {activeVolume.shortTitle}
        </p>
        <h3 className={`mt-1.5 font-serif text-lg font-semibold tracking-tight sm:text-xl ${primaryText}`}>
          {activeCaption.title}
        </h3>
        <p className={`mt-1 max-w-lg text-xs leading-relaxed sm:text-sm ${mutedText}`}>
          {activeCaption.subtitle}
        </p>

        {/* Page Turn Controls & Subtle Counter */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-5">
          <button
            type="button"
            onClick={() => runtimesRef.current[activeBookIdx]?.magazine.prev()}
            disabled={isAtStart}
            aria-label="Previous page"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${borderTone} ${primaryText} hover:scale-105 disabled:pointer-events-none disabled:opacity-30`}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <span
            aria-live="polite"
            className={`min-w-[132px] font-mono text-[11px] uppercase tracking-[0.2em] ${mutedText}`}
          >
            {formatSpreadLabel(pageInfo.visiblePages, pageInfo.pageCount, shelfMode)}
          </span>

          <button
            type="button"
            onClick={continueReading}
            aria-label={turnBack ? 'Turn back one page' : 'Next page'}
            title={turnBack ? 'Turn back one page' : 'Next page'}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${borderTone} ${primaryText} hover:scale-105 disabled:pointer-events-none disabled:opacity-30`}
          >
            {turnBack ? <RotateCcw className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => {
              const mag = runtimesRef.current[activeBookIdx]?.magazine;
              if (!mag) return;
              if (isAtStart) mag.next();
              else mag.goTo(0, { animate: true });
            }}
            aria-label={isAtStart ? 'Open book' : 'Close book to cover'}
            className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 font-mono text-[10px] uppercase tracking-[0.16em] transition ${borderTone} ${primaryText} hover:opacity-80`}
          >
            {isAtStart ? (
              <>
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Open</span>
              </>
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Close</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Volume Selector — Clean Editorial Index Tabs */}
      <nav
        aria-label="Select lookbook volume"
        className="mx-auto mt-6 flex max-w-full items-center justify-start gap-2 overflow-x-auto px-4 pb-1 sm:justify-center sm:gap-6"
      >
        {LOOKBOOK_VOLUMES.map((vol, idx) => {
          const isCurrent = idx === activeBookIdx;
          return (
            <button
              key={vol.id}
              type="button"
              onClick={() => selectBook(idx)}
              aria-current={isCurrent ? 'true' : undefined}
              className={`shrink-0 border-b-2 px-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition ${
                isCurrent
                  ? `${primaryText} border-current font-semibold`
                  : `${mutedText} border-transparent opacity-70 hover:opacity-100`
              }`}
            >
              <span>{vol.roman}</span>
              <span className="mx-1.5 opacity-40">/</span>
              <span>{vol.shortTitle}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default LookbookGallery3D;
