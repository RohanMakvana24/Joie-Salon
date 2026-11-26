import type { ThemeMode } from '../data/barbershopData';
import { yieldToBrowser } from './scheduleWork';

export interface SocialCardProfile {
  id: string;
  platform: string;
  handle: string;
  category: string;
  headline: string;
  description: string;
  action: string;
  href: string;
}

const WIDTH = 1024;
const HEIGHT = 1440;
const imageCache = new Map<string, Promise<HTMLImageElement | null>>();

function loadImage(src: string) {
  if (!imageCache.has(src)) {
    imageCache.set(
      src,
      new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = src;
      })
    );
  }
  return imageCache.get(src)!;
}

function rounded(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string | CanvasGradient
) {
  context.beginPath();
  context.roundRect(x, y, w, h, r);
  context.fillStyle = color;
  context.fill();
}

function strokedRounded(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
  lineWidth = 2
) {
  context.beginPath();
  context.roundRect(x, y, w, h, r);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
}

function cover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  x: number,
  y: number,
  w: number,
  h: number,
  radius = 0
) {
  if (!image) return;
  const scale = Math.max(w / image.width, h / image.height);
  context.save();
  context.beginPath();
  context.roundRect(x, y, w, h, radius);
  context.clip();
  context.drawImage(
    image,
    x + (w - image.width * scale) / 2,
    y + (h - image.height * scale) * 0.25,
    image.width * scale,
    image.height * scale
  );
  context.restore();
}

function text(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 500,
  family = 'Outfit'
) {
  context.font = `${weight} ${size}px "${family}", sans-serif`;
  context.fillStyle = color;
  context.fillText(value, x, y);
}

function lines(
  context: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  width: number,
  size: number,
  color: string,
  lineHeight: number,
  weight = 500,
  family = 'Outfit'
) {
  context.font = `${weight} ${size}px "${family}", sans-serif`;
  const result: string[] = [];
  let line = '';
  for (const word of value.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > width && line) {
      result.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) result.push(line);
  result.forEach((row, i) => text(context, row, x, y + i * lineHeight, size, color, weight, family));
  return result.length;
}

function arrow(context: CanvasRenderingContext2D, x: number, y: number, color: string) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = 5;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.moveTo(x - 16, y + 16);
  context.lineTo(x + 16, y - 16);
  context.moveTo(x - 12, y - 16);
  context.lineTo(x + 16, y - 16);
  context.lineTo(x + 16, y + 12);
  context.stroke();
}

function drawCtaButton(
  context: CanvasRenderingContext2D,
  label: string,
  useGoldFill: boolean
) {
  if (useGoldFill) {
    const grad = context.createLinearGradient(68, 1220, 956, 1355);
    grad.addColorStop(0, '#E9CE9E');
    grad.addColorStop(0.55, '#D8B173');
    grad.addColorStop(1, '#C59A58');
    rounded(context, 68, 1220, 888, 135, 18, grad);
    text(context, label, 116, 1302, 34, '#1F1711', 600, 'Plus Jakarta Sans');
    arrow(context, 882, 1287, '#1F1711');
  } else {
    rounded(context, 68, 1220, 888, 135, 18, '#232C3B');
    strokedRounded(context, 68, 1220, 888, 135, 18, 'rgba(201, 164, 107, 0.35)', 2);
    text(context, label, 116, 1302, 34, '#FFF9EE', 600, 'Plus Jakarta Sans');
    arrow(context, 882, 1287, '#DEC094');
  }
}

/** Draw card artwork with the site's fonts; no remote rendering service is used. */
export async function createSocialCardTextures(
  profile: SocialCardProfile,
  index: number,
  theme: ThemeMode,
  iconSvg: string,
  review?: { name: string; quote: string }
) {
  await Promise.all([
    document.fonts.load('600 60px "Outfit"'),
    document.fonts.load('500 40px "Plus Jakarta Sans"'),
    document.fonts.load('600 48px "Cinzel"'),
  ]);

  const [logo, bridal1, bridal2, bridal3, videoStill, icon] = await Promise.all([
    loadImage('/assets/brand/joie-salon-icon-gold.webp'),
    profile.id === 'instagram' ? loadImage('/assets/bridals/sangeet-caramel-glam.png') : null,
    profile.id === 'instagram' ? loadImage('/assets/bridals/reception-couture-blowout.png') : null,
    profile.id === 'instagram' ? loadImage('/assets/bridals/haldi-dewy-glow.png') : null,
    profile.id === 'youtube' ? loadImage('/assets/bridals/royal-maroon-bridal.png') : null,
    loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSvg)}`),
  ]);

  const dark = profile.id === 'instagram' || theme === 'dark';
  const paper = dark ? '#1C1612' : '#FFFDF8';
  const ink = dark ? '#FFF7EA' : '#232C3B';
  const muted = dark ? '#BBA995' : '#68707D';
  const gold = '#D8B173';
  const accentLabel = dark ? '#DEC094' : '#8F6B36';
  const hairline = dark ? 'rgba(222, 192, 148, 0.22)' : 'rgba(35, 44, 59, 0.12)';

  const front = document.createElement('canvas');
  front.width = WIDTH;
  front.height = HEIGHT;
  const c = front.getContext('2d');
  if (!c) throw new Error('Canvas unavailable');

  // Card base + subtle top sheen
  c.fillStyle = paper;
  c.fillRect(0, 0, WIDTH, HEIGHT);
  if (dark) {
    const glow = c.createRadialGradient(WIDTH * 0.5, 220, 40, WIDTH * 0.5, 360, 740);
    glow.addColorStop(0, 'rgba(217, 163, 75, 0.14)');
    glow.addColorStop(1, 'rgba(28, 22, 18, 0)');
    c.fillStyle = glow;
    c.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // Luxury inset pass border (keeps clear of punched slot at y=60..105)
  strokedRounded(c, 32, 32, WIDTH - 64, HEIGHT - 64, 24, dark ? 'rgba(222, 192, 148, 0.26)' : 'rgba(180, 143, 86, 0.28)', 2);

  // Header bar (below slot)
  if (icon) c.drawImage(icon, 68, 134, 46, 46);
  text(c, profile.platform, 132, 171, 36, ink, 600);
  c.textAlign = 'right';
  text(c, `0${index + 1} / 04`, 956, 170, 26, muted, 600);
  c.textAlign = 'left';

  c.beginPath();
  c.moveTo(68, 206);
  c.lineTo(956, 206);
  c.strokeStyle = hairline;
  c.lineWidth = 2;
  c.stroke();

  // Brand identity crest
  rounded(c, 68, 242, 122, 122, 61, '#221A14');
  strokedRounded(c, 68, 242, 122, 122, 61, '#C59A58', 3);
  if (logo) c.drawImage(logo, 90, 259, 78, 88);
  text(c, 'Joie Salon', 218, 290, 44, ink, 600);
  text(c, profile.handle, 218, 340, 29, muted, 500, 'Plus Jakarta Sans');

  // Visual preview stage (y = 402..804)
  if (profile.id === 'instagram') {
    const gap = 14;
    const w = (888 - gap * 2) / 3;
    [bridal1, bridal2, bridal3].forEach((image, i) => {
      const x = 68 + i * (w + gap);
      rounded(c, x, 402, w, 402, 14, '#292019');
      cover(c, image, x, 402, w, 402, 14);
      strokedRounded(c, x, 402, w, 402, 14, 'rgba(222, 192, 148, 0.3)', 2);
    });
    const scrim = c.createLinearGradient(0, 690, 0, 804);
    scrim.addColorStop(0, 'rgba(20, 15, 11, 0)');
    scrim.addColorStop(1, 'rgba(20, 15, 11, 0.78)');
    rounded(c, 68, 690, 888, 114, 14, scrim);
    text(c, 'LOOKBOOK · RAJKOT STUDIO', 96, 774, 22, '#F4DFB8', 600, 'Plus Jakarta Sans');
  } else if (profile.id === 'facebook') {
    rounded(c, 68, 402, 888, 402, 18, dark ? '#242A32' : '#EEF2F5');
    strokedRounded(c, 68, 402, 888, 402, 18, dark ? 'rgba(255,255,255,0.1)' : '#DCE4EB', 2);
    if (icon) {
      c.save();
      c.globalAlpha = dark ? 0.08 : 0.06;
      c.drawImage(icon, 690, 480, 240, 310);
      c.restore();
    }
    text(c, 'OUR KIND OF COMMUNITY', 114, 474, 22, dark ? '#99AABB' : '#627687', 600, 'Plus Jakarta Sans');
    text(c, 'Rooted in Rajkot.', 114, 578, 58, dark ? '#F5F7FA' : '#232C3B', 600);
    text(c, 'Connected by style.', 114, 650, 58, dark ? '#DEC094' : '#354653', 600);
    text(c, 'JYOTI NAGAR · BEHIND CRYSTAL MALL', 114, 754, 23, dark ? '#A5B2C0' : '#657887', 600, 'Plus Jakarta Sans');
  } else if (profile.id === 'google') {
    rounded(c, 68, 402, 888, 402, 18, dark ? '#261E17' : '#F6EFE2');
    strokedRounded(c, 68, 402, 888, 402, 18, dark ? 'rgba(222,192,148,0.22)' : '#E4D6BE', 2);
    text(c, '“', 108, 534, 140, '#C59A58', 400, 'Georgia');
    text(c, '★ ★ ★ ★ ★', 688, 472, 28, '#D9A34B', 600);
    lines(
      c,
      review?.quote ?? 'Every visit feels calm, polished, and effortless.',
      114,
      580,
      788,
      46,
      dark ? '#FBF3E4' : '#4A3923',
      60
    );
    rounded(c, 114, 722, 46, 46, 23, '#D8B173');
    text(c, (review?.name ?? 'J')[0], 128, 755, 27, '#221911', 700);
    text(c, review?.name ?? 'Joie Salon Client', 176, 754, 26, dark ? '#DEC094' : '#6D583B', 600, 'Plus Jakarta Sans');
    c.textAlign = 'right';
    text(c, 'Verified Google Review', 910, 754, 22, dark ? '#A89882' : '#8C7D68', 500, 'Plus Jakarta Sans');
    c.textAlign = 'left';
  } else {
    rounded(c, 68, 402, 888, 402, 18, '#1B1510');
    cover(c, videoStill, 68, 402, 888, 402, 18);
    const scrim = c.createLinearGradient(0, 402, 0, 804);
    scrim.addColorStop(0, 'rgba(18, 13, 10, 0.25)');
    scrim.addColorStop(1, 'rgba(18, 13, 10, 0.72)');
    rounded(c, 68, 402, 888, 402, 18, scrim);
    strokedRounded(c, 68, 402, 888, 402, 18, 'rgba(222, 192, 148, 0.35)', 2);
    c.beginPath();
    c.arc(512, 603, 66, 0, Math.PI * 2);
    c.fillStyle = 'rgba(28, 22, 18, 0.55)';
    c.fill();
    c.strokeStyle = '#E6C995';
    c.lineWidth = 3;
    c.stroke();
    c.beginPath();
    c.moveTo(496, 575);
    c.lineTo(496, 631);
    c.lineTo(542, 603);
    c.closePath();
    c.fillStyle = '#FFF9EE';
    c.fill();
    text(c, 'INSIDE THE CHAIR · STUDIO FILM', 110, 764, 23, '#F6E6CA', 600, 'Plus Jakarta Sans');
  }

  // Editorial copy (y = 875..1170)
  text(c, profile.category, 68, 884, 23, accentLabel, 700, 'Plus Jakarta Sans');
  const count = lines(c, profile.headline, 68, 968, 888, 58, ink, 68, 600);
  lines(c, profile.description, 68, count > 1 ? 1094 : 1064, 888, 31, muted, 46, 400, 'Plus Jakarta Sans');

  // Interactive 3D CTA button (UV [0.07..0.93, 0.055..0.16])
  drawCtaButton(c, profile.action, dark);

  // Micro footer
  text(c, 'JOIE SALON · SOCIAL CLUB', 68, 1396, 19, muted, 600, 'Plus Jakarta Sans');
  c.textAlign = 'right';
  text(c, 'DRAG · TAP TO FLIP', 956, 1396, 19, muted, 600, 'Plus Jakarta Sans');
  c.textAlign = 'left';

  await yieldToBrowser();

  // Back face (Luxury dark espresso & gold VIP pass)
  const back = document.createElement('canvas');
  back.width = WIDTH;
  back.height = HEIGHT;
  const b = back.getContext('2d');
  if (!b) throw new Error('Canvas unavailable');

  b.fillStyle = '#1B1612';
  b.fillRect(0, 0, WIDTH, HEIGHT);
  const backGlow = b.createRadialGradient(WIDTH * 0.5, HEIGHT * 0.42, 40, WIDTH * 0.5, HEIGHT * 0.42, 640);
  backGlow.addColorStop(0, 'rgba(216, 177, 115, 0.22)');
  backGlow.addColorStop(1, 'rgba(27, 22, 18, 0)');
  b.fillStyle = backGlow;
  b.fillRect(0, 0, WIDTH, HEIGHT);

  strokedRounded(b, 32, 32, WIDTH - 64, HEIGHT - 64, 24, 'rgba(222, 192, 148, 0.28)', 2);
  strokedRounded(b, 56, 206, WIDTH - 112, 974, 18, 'rgba(222, 192, 148, 0.18)', 2);

  if (icon) b.drawImage(icon, 68, 134, 46, 46);
  b.textAlign = 'right';
  text(b, `${profile.platform.toUpperCase()} · PASS 0${index + 1}`, 956, 168, 25, gold, 600, 'Plus Jakarta Sans');
  b.textAlign = 'center';

  if (logo) b.drawImage(logo, 412, 300, 200, 226);
  text(b, 'JOIE SALON', 512, 636, 74, '#FFF7EA', 600, 'Cinzel');
  text(b, 'HAIR · SKIN · BRIDAL · RAJKOT', 512, 694, 26, gold, 600, 'Plus Jakarta Sans');

  b.beginPath();
  b.moveTo(352, 746);
  b.lineTo(672, 746);
  b.strokeStyle = 'rgba(222, 192, 148, 0.35)';
  b.lineWidth = 2;
  b.stroke();

  lines(b, profile.headline, 512, 836, 760, 50, '#F5E6CF', 62, 600);
  text(b, profile.handle, 512, 996, 30, '#CBB89E', 500, 'Plus Jakarta Sans');
  text(b, 'JYOTI NAGAR · BEHIND CRYSTAL MALL', 512, 1060, 21, '#9E8C73', 600, 'Plus Jakarta Sans');
  text(b, 'TAP TO FLIP · DRAG TO SWING', 512, 1132, 21, '#8D7B63', 600, 'Plus Jakarta Sans');

  b.textAlign = 'left';
  drawCtaButton(b, profile.action, true);
  text(b, 'JOIE SALON · SOCIAL CLUB', 68, 1396, 19, '#9F8B70', 600, 'Plus Jakarta Sans');
  b.textAlign = 'right';
  text(b, 'OFFICIAL CIRCLE', 956, 1396, 19, '#9F8B70', 600, 'Plus Jakarta Sans');
  b.textAlign = 'left';

  // Woven lanyard strap texture (horizontal pattern rotated along strap in Lanyard.jsx)
  const strap = document.createElement('canvas');
  strap.width = 480;
  strap.height = 192;
  const s = strap.getContext('2d');
  if (!s) throw new Error('Canvas unavailable');
  s.scale(2, 2);
  s.fillStyle = '#1E1712';
  s.fillRect(0, 0, 240, 96);
  s.strokeStyle = 'rgba(216, 177, 115, 0.45)';
  s.lineWidth = 1.5;
  s.setLineDash([5, 4]);
  s.beginPath();
  s.moveTo(0, 9);
  s.lineTo(240, 9);
  s.moveTo(0, 87);
  s.lineTo(240, 87);
  s.stroke();
  s.setLineDash([]);
  s.textAlign = 'center';
  text(s, 'JOIE · SALON', 120, 58, 28, '#DEC094', 600, 'Cinzel');

  return { front, back, strap };
}
