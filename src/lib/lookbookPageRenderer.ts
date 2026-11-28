import * as THREE from 'three';
import type { BookPageSpec, GalleryLookItem, LookbookVolume } from '../data/lookbookBooks';

import { getLookbookPageImageSources, loadGalleryImage } from './lookbookImages';

export const PAGE_ASPECT = 1.377;

const imagePromiseCache = new Map<string, Promise<HTMLImageElement>>();
let fontsReadyPromise: Promise<void> | null = null;

function ensureFontsReady(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return Promise.resolve();
  }
  if (!fontsReadyPromise) {
    fontsReadyPromise = Promise.race([
      document.fonts.ready.then(() => undefined),
      new Promise<void>((resolve) => setTimeout(resolve, 900)),
    ]);
  }
  return fontsReadyPromise;
}


function drawPageImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  focusY = 0.28,
  preserveFraming = false,
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;

  if (preserveFraming) {
    const scale = Math.min(w / iw, h / ih);
    const fittedW = iw * scale;
    const fittedH = ih * scale;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, x + (w - fittedW) / 2, y + (h - fittedH) / 2, fittedW, fittedH);
    return;
  }

  const boxRatio = w / h;
  const imgRatio = iw / ih;
  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;

  if (imgRatio > boxRatio) {
    sw = ih * boxRatio;
    sx = (iw - sw) * 0.5;
  } else {
    sh = iw / boxRatio;
    sy = (ih - sh) * focusY;
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawPaperSubtleTexture(ctx: CanvasRenderingContext2D, w: number, h: number, baseHex: string, isLeftPage: boolean) {
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, w, h);

  // Subtle warm archival border vignette
  const vignette = ctx.createRadialGradient(w * 0.5, h * 0.48, w * 0.22, w * 0.5, h * 0.5, w * 0.85);
  vignette.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
  vignette.addColorStop(1, 'rgba(40, 28, 18, 0.045)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);

  // Fine cloth/paper micro-texture lines (deterministic, ultra-fast)
  ctx.fillStyle = 'rgba(35, 28, 22, 0.015)';
  const step = Math.max(4, Math.round(w / 140));
  for (let py = 0; py < h; py += step * 2) {
    ctx.fillRect(0, py, w, 1);
  }

  // Spine crease shading so inner spreads read with realistic book gutter depth
  const spineW = w * 0.075;
  const crease = isLeftPage
    ? ctx.createLinearGradient(w - spineW, 0, w, 0)
    : ctx.createLinearGradient(0, 0, spineW, 0);
  if (isLeftPage) {
    crease.addColorStop(0, 'rgba(22, 16, 12, 0)');
    crease.addColorStop(0.75, 'rgba(22, 16, 12, 0.035)');
    crease.addColorStop(1, 'rgba(22, 16, 12, 0.095)');
    ctx.fillStyle = crease;
    ctx.fillRect(w - spineW, 0, spineW, h);
  } else {
    crease.addColorStop(0, 'rgba(22, 16, 12, 0.095)');
    crease.addColorStop(0.25, 'rgba(22, 16, 12, 0.035)');
    crease.addColorStop(1, 'rgba(22, 16, 12, 0)');
    ctx.fillStyle = crease;
    ctx.fillRect(0, 0, spineW, h);
  }
}

function drawClothHardcoverBase(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  volume: LookbookVolume,
  spineOnLeft: boolean,
) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, volume.coverCloth);
  grad.addColorStop(1, volume.coverClothDeep);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Woven linen threads
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  const weaveStep = Math.max(3, Math.round(w / 190));
  for (let y = 0; y < h; y += weaveStep) {
    ctx.fillRect(0, y, w, 1);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  for (let x = 0; x < w; x += weaveStep) {
    ctx.fillRect(x, 0, 1, h);
  }

  // Soft studio highlight sweep across cover board
  const sheen = ctx.createLinearGradient(0, 0, w, h * 0.7);
  sheen.addColorStop(0, 'rgba(255, 248, 232, 0.08)');
  sheen.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  sheen.addColorStop(1, 'rgba(0, 0, 0, 0.14)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // Pressed hardcover spine hinge groove
  const hingeX = spineOnLeft ? w * 0.048 : w * 0.952;
  const groove = ctx.createLinearGradient(hingeX - w * 0.014, 0, hingeX + w * 0.014, 0);
  groove.addColorStop(0, 'rgba(0, 0, 0, 0)');
  groove.addColorStop(0.45, 'rgba(0, 0, 0, 0.36)');
  groove.addColorStop(0.65, 'rgba(255, 255, 255, 0.08)');
  groove.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = groove;
  ctx.fillRect(hingeX - w * 0.014, 0, w * 0.028, h);

  // Inner embossed brass border rules
  const inset = w * 0.068;
  const leftOffset = spineOnLeft ? w * 0.032 : 0;
  const rightOffset = spineOnLeft ? 0 : w * 0.032;
  const bx = inset + leftOffset;
  const bw = w - inset * 2 - leftOffset - rightOffset;
  const by = h * 0.052;
  const bh = h - by * 2;

  ctx.strokeStyle = volume.coverFoil;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = Math.max(1.2, w * 0.0022);
  ctx.strokeRect(bx, by, bw, bh);

  ctx.globalAlpha = 0.24;
  ctx.lineWidth = Math.max(0.8, w * 0.0012);
  ctx.strokeRect(bx + w * 0.012, by + w * 0.012, bw - w * 0.024, bh - w * 0.024);
  ctx.globalAlpha = 1;
}

function drawRunningChrome(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  volume: LookbookVolume,
  page: BookPageSpec,
  isLeftPage: boolean,
) {
  const padX = w * 0.09;
  const topY = h * 0.054;
  const botY = h * 0.955;

  ctx.save();
  ctx.fillStyle = '#6E6256';
  ctx.font = `600 ${Math.round(w * 0.018)}px "Plus Jakarta Sans", sans-serif`;
  ctx.textBaseline = 'middle';

  if (isLeftPage) {
    ctx.textAlign = 'left';
    ctx.fillText(`JOIE SALON · ${volume.roman}`, padX, topY);
    if (page.kicker) {
      ctx.textAlign = 'right';
      ctx.fillText(page.kicker, w - padX, topY);
    }
  } else {
    ctx.textAlign = 'left';
    if (page.kicker) ctx.fillText(page.kicker, padX, topY);
    ctx.textAlign = 'right';
    ctx.fillText(volume.shortTitle.toUpperCase(), w - padX, topY);
  }

  // Hairline rule at footer + folio
  ctx.strokeStyle = 'rgba(42, 34, 28, 0.14)';
  ctx.lineWidth = Math.max(1, w * 0.0014);
  ctx.beginPath();
  ctx.moveTo(padX, botY - h * 0.022);
  ctx.lineTo(w - padX, botY - h * 0.022);
  ctx.stroke();

  ctx.fillStyle = '#3E362F';
  ctx.font = `600 ${Math.round(w * 0.02)}px "Cinzel", Georgia, serif`;
  ctx.textAlign = isLeftPage ? 'left' : 'right';
  ctx.fillText(page.folio ? `PLATE ${page.folio}` : volume.roman, isLeftPage ? padX : w - padX, botY);

  ctx.fillStyle = '#7B6F63';
  ctx.font = `500 ${Math.round(w * 0.017)}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = isLeftPage ? 'right' : 'left';
  ctx.fillText('ARCHIVAL COLLECTION', isLeftPage ? w - padX : padX, botY);
  ctx.restore();
}

export async function renderLookbookPageToCanvas(
  canvas: HTMLCanvasElement,
  volume: LookbookVolume,
  pageIndex: number,
  width: number,
): Promise<void> {
  const page = volume.pages[pageIndex];
  if (!page) return;

  await ensureFontsReady();

  const loadedImages = new Map<string, HTMLImageElement>();
  await Promise.all(
    getLookbookPageImageSources(page).map(async (src) => {
      try {
        const img = await loadGalleryImage(src);
        loadedImages.set(src, img);
      } catch {
        // Keep graceful fallback frame if an individual image fails
      }
    }),
  );

  const height = Math.round(width * PAGE_ASPECT);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);
  const isLeftPage = pageIndex % 2 === 1;
  const padX = width * 0.09;

  if (page.layout === 'front-cover') {
    drawClothHardcoverBase(ctx, width, height, volume, true);

    const contentX = width * 0.135;
    const contentW = width - width * 0.235;
    const centerX = contentX + contentW * 0.5;

    ctx.textAlign = 'center';
    ctx.fillStyle = volume.coverFoil;
    ctx.font = `600 ${Math.round(width * 0.023)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`${page.kicker ?? 'JOIE SALON · RAJKOT'}  ·  ${volume.roman}`, centerX, height * 0.115);

    // Subtle hairline under header
    ctx.strokeStyle = volume.coverFoil;
    ctx.globalAlpha = 0.42;
    ctx.lineWidth = Math.max(1, width * 0.0015);
    ctx.beginPath();
    ctx.moveTo(centerX - contentW * 0.24, height * 0.14);
    ctx.lineTo(centerX + contentW * 0.24, height * 0.14);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Embossed Title
    const titleLines = (page.heading ?? volume.title).split('\n');
    ctx.fillStyle = volume.coverInk;
    ctx.font = `700 ${Math.round(width * 0.088)}px "Cinzel", Georgia, serif`;
    titleLines.forEach((line, idx) => {
      ctx.fillText(line, centerX, height * (0.215 + idx * 0.075));
    });

    // Inset framed hero photography plate
    const plateW = contentW * 0.8;
    const plateH = height * 0.43;
    const plateX = centerX - plateW * 0.5;
    const plateY = height * 0.345;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.26)';
    ctx.fillRect(plateX + width * 0.008, plateY + width * 0.01, plateW, plateH);

    // Warm archival mat frame around cover photo
    const mat = width * 0.016;
    ctx.fillStyle = '#F7F1E8';
    ctx.fillRect(plateX - mat, plateY - mat, plateW + mat * 2, plateH + mat * 2);

    const coverImg = page.primaryItem ? loadedImages.get(page.primaryItem.image) : undefined;
    if (coverImg && page.primaryItem) {
      drawPageImage(
        ctx,
        coverImg,
        plateX,
        plateY,
        plateW,
        plateH,
        0.22,
        Boolean(volume.preservePhotoFraming && page.primaryItem.image.endsWith('.png')),
      );
    } else {
      ctx.fillStyle = volume.coverClothDeep;
      ctx.fillRect(plateX, plateY, plateW, plateH);
    }

    ctx.strokeStyle = volume.coverFoil;
    ctx.lineWidth = Math.max(1, width * 0.0018);
    ctx.strokeRect(plateX - mat, plateY - mat, plateW + mat * 2, plateH + mat * 2);

    // Subtle edition copy at bottom
    ctx.fillStyle = volume.coverInk;
    ctx.globalAlpha = 0.88;
    ctx.font = `400 ${Math.round(width * 0.025)}px "Plus Jakarta Sans", sans-serif`;
    const subLines = wrapTextLines(ctx, page.body ?? volume.subtitle, contentW * 0.82);
    subLines.slice(0, 2).forEach((line, idx) => {
      ctx.fillText(line, centerX, height * (0.855 + idx * 0.028));
    });

    ctx.globalAlpha = 0.65;
    ctx.fillStyle = volume.coverFoil;
    ctx.font = `600 ${Math.round(width * 0.019)}px "Cinzel", Georgia, serif`;
    ctx.fillText('ARCHIVAL PHOTOGRAPHY MONOGRAPH', centerX, height * 0.922);
    ctx.globalAlpha = 1;
    return;
  }

  if (page.layout === 'back-cover') {
    drawClothHardcoverBase(ctx, width, height, volume, false);

    const centerX = width * 0.484;
    ctx.textAlign = 'center';

    // Embossed JS Monogram Medallion
    const medalY = height * 0.41;
    const medalR = width * 0.11;
    ctx.strokeStyle = volume.coverFoil;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = Math.max(1.4, width * 0.0022);
    ctx.beginPath();
    ctx.arc(centerX, medalY, medalR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.arc(centerX, medalY, medalR * 0.84, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.fillStyle = volume.coverFoil;
    ctx.font = `400 ${Math.round(width * 0.085)}px "Great Vibes", "Cinzel", serif`;
    ctx.fillText('Joie', centerX, medalY + width * 0.026);

    ctx.fillStyle = volume.coverInk;
    ctx.font = `600 ${Math.round(width * 0.027)}px "Cinzel", Georgia, serif`;
    ctx.fillText(page.heading ?? volume.title.toUpperCase(), centerX, height * 0.59);

    ctx.fillStyle = volume.coverFoil;
    ctx.globalAlpha = 0.8;
    ctx.font = `500 ${Math.round(width * 0.02)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(page.body ?? 'Jyoti Nagar Main Rd · Behind Crystal Mall, Rajkot', centerX, height * 0.635);
    ctx.fillText(page.kicker ?? 'JOIE SALON · RAJKOT', centerX, height * 0.88);
    ctx.globalAlpha = 1;
    return;
  }

  // Interior Editorial Paper Pages
  drawPaperSubtleTexture(ctx, width, height, volume.paperTone, isLeftPage);
  drawRunningChrome(ctx, width, height, volume, page, isLeftPage);

  if (page.layout === 'full-image') {
    const imgW = width - padX * 2;
    const imgH = height * 0.72;
    const imgX = padX;
    const imgY = height * 0.092;

    const img = page.primaryItem ? loadedImages.get(page.primaryItem.image) : undefined;
    if (img && page.primaryItem) {
      drawPageImage(
        ctx,
        img,
        imgX,
        imgY,
        imgW,
        imgH,
        0.2,
        Boolean(volume.preservePhotoFraming && page.primaryItem.image.endsWith('.png')),
      );
    }
    ctx.strokeStyle = 'rgba(35, 28, 22, 0.16)';
    ctx.lineWidth = 1;
    ctx.strokeRect(imgX, imgY, imgW, imgH);

    const capY = imgY + imgH + height * 0.042;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1E1A16';
    ctx.font = `600 ${Math.round(width * 0.032)}px "Cinzel", Georgia, serif`;
    ctx.fillText(page.heading ?? '', padX, capY, imgW);

    ctx.fillStyle = '#564C42';
    ctx.font = `italic 400 ${Math.round(width * 0.022)}px "Plus Jakarta Sans", sans-serif`;
    const capLines = wrapTextLines(ctx, page.body ?? '', imgW);
    capLines.slice(0, 2).forEach((line, idx) => {
      ctx.fillText(line, padX, capY + height * (0.032 + idx * 0.026));
    });
    return;
  }

  if (page.layout === 'collage') {
    const innerW = width - padX * 2;
    const items: GalleryLookItem[] = page.collageItems ?? [];
    const gap = width * 0.024;
    const gridY = height * 0.105;
    const gridH = height * 0.61;
    const leftW = innerW * 0.56;
    const rightW = innerW - leftW - gap;
    const halfH = (gridH - gap) * 0.5;

    const slots = [
      { x: padX, y: gridY, w: leftW, h: gridH, item: items[0] },
      { x: padX + leftW + gap, y: gridY, w: rightW, h: halfH, item: items[1] },
      { x: padX + leftW + gap, y: gridY + halfH + gap, w: rightW, h: halfH, item: items[2] },
    ];

    slots.forEach((slot) => {
      if (!slot.item) return;
      const img = loadedImages.get(slot.item.image);
      if (img) {
        drawPageImage(
          ctx,
          img,
          slot.x,
          slot.y,
          slot.w,
          slot.h,
          0.24,
          Boolean(volume.preservePhotoFraming && slot.item.image.endsWith('.png')),
        );
      } else {
        ctx.fillStyle = '#EAE3D8';
        ctx.fillRect(slot.x, slot.y, slot.w, slot.h);
      }
      ctx.strokeStyle = 'rgba(35, 28, 22, 0.14)';
      ctx.lineWidth = 1;
      ctx.strokeRect(slot.x, slot.y, slot.w, slot.h);
    });

    const textY = gridY + gridH + height * 0.055;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1E1A16';
    ctx.font = `700 ${Math.round(width * 0.038)}px "Cinzel", Georgia, serif`;
    ctx.fillText(page.heading ?? 'Archival Triptych', padX, textY);

    ctx.fillStyle = '#564C42';
    ctx.font = `400 ${Math.round(width * 0.022)}px "Plus Jakarta Sans", sans-serif`;
    const summary = items.map((item) => item.title).join('  ·  ');
    const summaryLines = wrapTextLines(ctx, summary, innerW);
    summaryLines.slice(0, 2).forEach((line, idx) => {
      ctx.fillText(line, padX, textY + height * (0.038 + idx * 0.028));
    });
    return;
  }

  if (page.layout === 'closing') {
    const innerW = width - padX * 2;
    const centerX = width * 0.5;
    const gap = width * 0.035;
    const tileW = (innerW - gap) / 2;
    const tileH = height * 0.245;
    const rowHeight = height * 0.33;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1E1A16';
    ctx.font = `700 ${Math.round(width * 0.046)}px "Cinzel", Georgia, serif`;
    ctx.fillText(page.heading ?? 'Gallery', padX, height * 0.127, innerW);

    const items = page.indexItems ?? [];
    items.forEach((item, idx) => {
      const x = padX + (idx % 2) * (tileW + gap);
      const y = height * 0.165 + Math.floor(idx / 2) * rowHeight;
      const img = loadedImages.get(item.image);
      if (img) {
        drawPageImage(
          ctx,
          img,
          x,
          y,
          tileW,
          tileH,
          0.23,
          Boolean(volume.preservePhotoFraming && item.image.endsWith('.png')),
        );
      } else {
        ctx.fillStyle = '#EAE3D8';
        ctx.fillRect(x, y, tileW, tileH);
      }

      ctx.fillStyle = '#1E1A16';
      ctx.font = `600 ${Math.round(width * 0.025)}px "Plus Jakarta Sans", sans-serif`;
      wrapTextLines(ctx, item.title, tileW).slice(0, 2).forEach((line, lineIndex) => {
        ctx.fillText(line, x, y + tileH + height * (0.027 + lineIndex * 0.024), tileW);
      });
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#6E6256';
    ctx.font = `italic 400 ${Math.round(width * 0.021)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(page.body ?? 'Joie Salon · Rajkot', centerX, height * 0.89, innerW);
  }
}

function paintPlaceholderCanvas(canvas: HTMLCanvasElement, volume: LookbookVolume, pageIndex: number) {
  canvas.width = 16;
  canvas.height = 22;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const isCover = pageIndex === 0 || pageIndex === volume.pages.length - 1;
  ctx.fillStyle = isCover ? volume.coverCloth : volume.paperTone;
  ctx.fillRect(0, 0, 16, 22);
}

/**
 * Manages CanvasTextures for a single 3D Lookbook volume with lazy on-demand rendering
 * and automatic distance-based eviction of offscreen interior pages.
 */
export class LookbookTextureBank {
  readonly textures: THREE.CanvasTexture[] = [];
  private readonly canvases: HTMLCanvasElement[] = [];
  private readonly renderedWidth: number[] = [];
  private readonly inflight = new Map<number, number>();
  private generation = 0;
  private disposed = false;

  constructor(
    private readonly volume: LookbookVolume,
    private readonly maxAnisotropy: number,
    private readonly onTextureUpdated: () => void,
  ) {
    this.textures = volume.pages.map((_, idx) => {
      const canvas = document.createElement('canvas');
      paintPlaceholderCanvas(canvas, volume, idx);
      this.canvases.push(canvas);
      this.renderedWidth.push(0);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(4, maxAnisotropy);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      return tex;
    });
  }

  async renderPages(indices: number[], targetWidth: number): Promise<void> {
    if (this.disposed) return;

    const needed = new Set<number>([0]); // Always keep front cover crisp
    indices.forEach((idx) => {
      if (idx >= 0 && idx < this.volume.pages.length) needed.add(idx);
    });

    const tasks = Array.from(needed).map(async (idx) => {
      if (this.renderedWidth[idx] >= targetWidth || this.inflight.has(idx)) return;
      const token = ++this.generation;
      this.inflight.set(idx, token);
      try {
        const prevW = this.canvases[idx].width;
        const prevH = this.canvases[idx].height;
        await renderLookbookPageToCanvas(this.canvases[idx], this.volume, idx, targetWidth);
        if (this.disposed) return;
        this.renderedWidth[idx] = targetWidth;
        if (this.canvases[idx].width !== prevW || this.canvases[idx].height !== prevH) {
          // Dispose the previous immutable WebGL2 texStorage2D allocation so Three.js
          // allocates fresh storage matching the new canvas dimensions.
          this.textures[idx].dispose();
        }
        this.textures[idx].anisotropy = Math.min(4, this.maxAnisotropy);
        this.textures[idx].needsUpdate = true;
        this.onTextureUpdated();
      } finally {
        if (this.inflight.get(idx) === token) {
          this.inflight.delete(idx);
        }
      }
    });

    await Promise.all(tasks);
  }

  dispose() {
    this.disposed = true;
    this.inflight.clear();
    this.textures.forEach((tex) => tex.dispose());
    this.canvases.forEach((c) => {
      c.width = 0;
      c.height = 0;
    });
  }
}
