'use client';

import React, { useEffect, useRef, useState } from 'react';
import './MiniatureSalonFooter.css';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface MiniatureSalonFooterProps {
  name: string;
  tagline: string;
  columns: FooterColumn[];
  legal: FooterLink[];
  copyright: string;
}

interface WorkerSpec {
  id: string;
  role: string;
  message: string;
  hairStyle: 'bun' | 'long' | 'ponytail' | 'updo' | 'waves' | 'bob' | 'highbun';
  skin: string;
  hairColor: string;
  /** Positioned as % of stage */
  leftPct: number;
  bottomPct: number;
  sizeClamp: string;
  delay: string;
}

const WORKERS: WorkerSpec[] = [
  {
    id: 'cleaner',
    role: 'Cleaning Specialist',
    message: 'Polishing J to a shine!',
    hairStyle: 'bun',
    skin: '#f6c7ab',
    hairColor: '#5a3524',
    leftPct: 3.5,
    bottomPct: 5,
    sizeClamp: 'clamp(44px, 5.4vw, 78px)',
    delay: '0s',
  },
  {
    id: 'relaxer',
    role: 'Relaxing Guest',
    message: 'So cosy up here!',
    hairStyle: 'long',
    skin: '#f8cfb6',
    hairColor: '#4e2c1d',
    leftPct: 16.5,
    bottomPct: 48,
    sizeClamp: 'clamp(46px, 5.6vw, 82px)',
    delay: '-1.1s',
  },
  {
    id: 'stylist',
    role: 'Hair Stylist',
    message: 'Blow-dry magic!',
    hairStyle: 'ponytail',
    skin: '#f5c4a7',
    hairColor: '#482819',
    leftPct: 29.5,
    bottomPct: 48,
    sizeClamp: 'clamp(46px, 5.8vw, 84px)',
    delay: '-0.5s',
  },
  {
    id: 'assistant',
    role: 'Beauty Assistant',
    message: 'Fresh serums & plants!',
    hairStyle: 'updo',
    skin: '#f6c7ab',
    hairColor: '#543120',
    leftPct: 39.5,
    bottomPct: 5,
    sizeClamp: 'clamp(42px, 5vw, 72px)',
    delay: '-1.9s',
  },
  {
    id: 'ladder',
    role: 'Detail Polisher',
    message: 'Buffing the top of A!',
    hairStyle: 'waves',
    skin: '#f8cfb6',
    hairColor: '#4b2a1b',
    leftPct: 55.5,
    bottomPct: 26,
    sizeClamp: 'clamp(44px, 5.4vw, 78px)',
    delay: '-0.8s',
  },
  {
    id: 'mirror-girl',
    role: 'Mirror Specialist',
    message: 'Vanity bulbs glowing!',
    hairStyle: 'bob',
    skin: '#f5c4a7',
    hairColor: '#5a3524',
    leftPct: 75.5,
    bottomPct: 5,
    sizeClamp: 'clamp(42px, 5vw, 72px)',
    delay: '-1.5s',
  },
  {
    id: 'manager',
    role: 'Salon Manager',
    message: 'Bookings confirmed!',
    hairStyle: 'highbun',
    skin: '#f7cbb0',
    hairColor: '#4c2b1c',
    leftPct: 84.5,
    bottomPct: 48,
    sizeClamp: 'clamp(44px, 5.2vw, 76px)',
    delay: '-2.3s',
  },
];

const BULB_ANGLES = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);

/** Shared Pixar-inspired 3D-shaded miniature female worker SVG */
function WorkerIllustration({
  spec,
  eyeOffset,
  airflowOn,
}: {
  spec: WorkerSpec;
  eyeOffset: { x: number; y: number };
  airflowOn: boolean;
}) {
  const gradId = `skin-${spec.id}`;
  const hairId = `hair-${spec.id}`;

  return (
    <svg
      viewBox="0 0 110 135"
      className="w-full h-auto drop-shadow-[0_6px_8px_rgba(0,0,0,0.28)] overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradId} cx="42%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffe1cc" />
          <stop offset="100%" stopColor={spec.skin} />
        </radialGradient>
        <linearGradient id={hairId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7a4c35" />
          <stop offset="100%" stopColor={spec.hairColor} />
        </linearGradient>
      </defs>

      {/* Back Hair by Style */}
      {spec.hairStyle === 'long' || spec.hairStyle === 'waves' ? (
        <path
          d="M28 42 C22 58, 24 80, 34 86 L76 86 C86 80, 88 58, 82 42 Z"
          fill={`url(#${hairId})`}
        />
      ) : null}
      {spec.hairStyle === 'ponytail' ? (
        <path
          d="M28 36 C10 34, 8 62, 22 68 C26 60, 30 50, 34 44 Z"
          fill={`url(#${hairId})`}
          className={airflowOn ? 'msf-anim-wipe' : ''}
        />
      ) : null}
      {spec.hairStyle === 'bun' || spec.hairStyle === 'updo' || spec.hairStyle === 'highbun' ? (
        <circle cx="55" cy="14" r="13" fill={`url(#${hairId})`} />
      ) : null}
      {spec.hairStyle === 'highbun' ? (
        <ellipse cx="55" cy="21" rx="9" ry="3.5" fill="#e8799b" />
      ) : null}

      {/* Legs & White Sneakers */}
      <g className={spec.id === 'relaxer' ? 'msf-anim-swing-legs' : ''}>
        <rect x="40" y="92" width="10" height="24" rx="5" fill="#231c19" />
        <rect x="60" y="92" width="10" height="24" rx="5" fill="#231c19" />
        <ellipse cx="44" cy="118" rx="9" ry="5" fill="#ffffff" />
        <ellipse cx="66" cy="118" rx="9" ry="5" fill="#ffffff" />
        <path d="M36 120 H52" stroke="#e88fa8" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 120 H74" stroke="#e88fa8" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Torso: White Tee + Espresso Salon Apron */}
      <rect x="36" y="64" width="38" height="32" rx="11" fill="#ffffff" />
      <path d="M40 68 L70 68 L73 98 Q55 102 37 98 Z" fill="#2b211d" />
      <path d="M42 64 V70 M68 64 V70" stroke="#2b211d" strokeWidth="3.5" strokeLinecap="round" />
      {/* Gold Apron Pin */}
      <circle cx="55" cy="79" r="2.2" fill="#e5b96f" />

      {/* Head */}
      <ellipse cx="55" cy="41" rx="23" ry="22" fill={`url(#${gradId})`} />

      {/* Front Hair / Bangs */}
      <path
        d="M32 39 C32 20, 78 20, 78 39 C72 29, 60 27, 55 31 C50 27, 38 29, 32 39 Z"
        fill={`url(#${hairId})`}
      />

      {/* Rosy Cheeks */}
      <ellipse cx="40" cy="47" rx="4.5" ry="2.6" fill="#ff8fa3" opacity="0.55" />
      <ellipse cx="70" cy="47" rx="4.5" ry="2.6" fill="#ff8fa3" opacity="0.55" />

      {/* Blinking Eyes + Cursor Tracking Pupils */}
      <g className="msf-blink">
        <ellipse cx="45" cy="41" rx="4.2" ry="4.8" fill="#1b1411" />
        <ellipse cx="65" cy="41" rx="4.2" ry="4.8" fill="#1b1411" />
        <circle cx={46 + eyeOffset.x} cy={39.5 + eyeOffset.y} r="1.6" fill="#ffffff" />
        <circle cx={66 + eyeOffset.x} cy={39.5 + eyeOffset.y} r="1.6" fill="#ffffff" />
      </g>

      {/* Eyebrows & Smile */}
      <path d="M40 34 Q45 31.5 50 34" stroke="#4a2b1c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M60 34 Q65 31.5 70 34" stroke="#4a2b1c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M49 50 Q55 55 61 50" stroke="#9e4747" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Activity-Specific Arms & Props */}
      {spec.id === 'cleaner' || spec.id === 'mirror-girl' ? (
        <g className="msf-anim-wipe">
          <path d="M70 72 Q86 64 90 50" stroke={`url(#${gradId})`} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M84 42 Q96 38 99 52 Q88 58 82 50 Z" fill="#f48fb1" />
        </g>
      ) : null}

      {spec.id === 'stylist' ? (
        <g>
          <path d="M70 72 Q84 64 85 52" stroke={`url(#${gradId})`} strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Pink Hair Dryer */}
          <rect x="80" y="42" width="22" height="13" rx="6" fill="#e86e96" />
          <rect x="83" y="53" width="6" height="12" rx="2" fill="#d4527d" />
          <rect x="99" y="44" width="5" height="9" rx="1.5" fill="#2d2624" />
          {airflowOn ? (
            <g className="msf-anim-airflow" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeDasharray="6 4">
              <path d="M106 45 Q116 42 124 46" />
              <path d="M106 50 Q118 51 126 49" />
              <path d="M106 54 Q115 57 122 54" />
            </g>
          ) : null}
        </g>
      ) : null}

      {spec.id === 'ladder' ? (
        <g className="msf-anim-wipe">
          <path d="M38 72 Q24 62 22 48" stroke={`url(#${gradId})`} strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Beauty Polish Brush */}
          <rect x="10" y="40" width="16" height="8" rx="3" fill="#4e342e" />
          <rect x="11" y="34" width="14" height="6" rx="2" fill="#e5b96f" />
        </g>
      ) : null}

      {spec.id === 'manager' ? (
        <g>
          <path d="M38 72 Q36 82 46 84" stroke={`url(#${gradId})`} strokeWidth="6.5" strokeLinecap="round" fill="none" />
          <path d="M72 72 Q74 82 64 84" stroke={`url(#${gradId})`} strokeWidth="6.5" strokeLinecap="round" fill="none" />
          {/* Miniature Tablet */}
          <rect x="41" y="76" width="28" height="18" rx="3" fill="#2c3545" stroke="#d4a459" strokeWidth="1.2" />
          <rect x="44" y="79" width="22" height="12" rx="1.5" fill="#f8eff2" />
        </g>
      ) : null}

      {spec.id === 'assistant' ? (
        <g className="msf-anim-wipe">
          <path d="M70 74 Q84 78 88 70" stroke={`url(#${gradId})`} strokeWidth="6.5" strokeLinecap="round" fill="none" />
          <rect x="86" y="62" width="8" height="14" rx="2" fill="#f4a4bd" />
          <rect x="88" y="58" width="4" height="4" fill="#d4a459" />
        </g>
      ) : null}

      {spec.id === 'relaxer' ? (
        <g>
          <path d="M38 72 Q42 58 46 54" stroke={`url(#${gradId})`} strokeWidth="6.5" strokeLinecap="round" fill="none" />
          <path d="M72 72 Q68 58 64 54" stroke={`url(#${gradId})`} strokeWidth="6.5" strokeLinecap="round" fill="none" />
        </g>
      ) : null}
    </svg>
  );
}

export const MiniatureSalonFooter: React.FC<MiniatureSalonFooterProps> = ({
  name,
  tagline,
  columns,
  legal,
  copyright,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [mirrorLit, setMirrorLit] = useState(true);
  const [airflowOn, setAirflowOn] = useState(true);
  const [polishing, setPolishing] = useState(false);
  const [excitedId, setExcitedId] = useState<string | null>(null);
  const [wakingAll, setWakingAll] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Record<string, { x: number; y: number }>>({});
  const dragRef = useRef<{ id: string; sx: number; sy: number } | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2.4;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 1.8;
    setEyeOffset({ x: Math.max(-1.4, Math.min(1.4, nx)), y: Math.max(-1.1, Math.min(1.1, ny)) });
  };

  const handleWorkerClick = (id: string) => {
    setExcitedId(id);
    if (id === 'stylist') setAirflowOn((prev) => !prev);
    if (id === 'cleaner' || id === 'mirror-girl') {
      setPolishing(true);
      window.setTimeout(() => setPolishing(false), 1800);
    }
    window.setTimeout(() => setExcitedId((cur) => (cur === id ? null : cur)), 1600);
  };

  const handleWakeUp = () => {
    setWakingAll(true);
    setMirrorLit(true);
    setAirflowOn(true);
    setPolishing(true);
    window.setTimeout(() => {
      setWakingAll(false);
      setPolishing(false);
    }, 1400);
  };

  return (
    <footer className="msf-root">
      {/* Preserved Navigation, Contact, Hours & Copyright */}
      <div className="msf-top">
        <div>
          <p className="msf-name">{name}</p>
          <p className="msf-tag">{tagline}</p>
        </div>

        <nav className="msf-cols" aria-label="Footer">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="msf-ct">{col.title}</p>
              <ul className="msf-list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="msf-link"
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="msf-bottom">
        <span>{copyright}</span>
        <div className="msf-legal">
          {legal.map((item) => (
            <a key={item.label} className="msf-link" href={item.href}>
              {item.label}
            </a>
          ))}
          <button type="button" className="msf-wake-btn" onClick={handleWakeUp}>
            Wake up the salon
          </button>
        </div>
      </div>

      {/* Interactive Miniature JOIE SALON World */}
      <div
        ref={stageRef}
        className={`msf-stage ${inView ? '' : 'is-paused'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setEyeOffset({ x: 0, y: 0 })}
        onPointerMove={(e) => {
          const d = dragRef.current;
          if (!d) return;
          setDragOffset((prev) => ({
            ...prev,
            [d.id]: {
              x: Math.max(-45, Math.min(45, e.clientX - d.sx)),
              y: Math.max(-35, Math.min(20, e.clientY - d.sy)),
            },
          }));
        }}
        onPointerUp={() => {
          if (!dragRef.current) return;
          const id = dragRef.current.id;
          dragRef.current = null;
          setDragOffset((prev) => ({ ...prev, [id]: { x: 0, y: 0 } }));
        }}
      >
        {/* Architectural Wall Panels */}
        <div className="msf-walls" aria-hidden="true">
          <div className="msf-wall-panel" />
          <div className="msf-wall-panel" />
          <div className="msf-wall-panel" />
        </div>

        {/* Pendant Lights */}
        <div className="msf-pendants" aria-hidden="true">
          <div className="msf-pendant">
            <span className="msf-pendant__cord" />
            <span className="msf-pendant__globe" />
          </div>
          <div className="msf-pendant">
            <span className="msf-pendant__cord" />
            <span className="msf-pendant__globe" />
          </div>
        </div>

        {/* Illuminated Wall Crest */}
        <svg className="msf-wall-crest" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path d="M22 14 L26 8 L32 13 L38 8 L42 14 Z" stroke="#e5b96f" strokeWidth="1.8" />
          <path
            d="M20 44 C18 28, 30 18, 42 22 C48 25, 50 34, 44 40 C40 44, 44 50, 42 54"
            stroke="#e5b96f"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Subtle Floating Pink Petals */}
        <span className="msf-petal" style={{ left: '14%', '--dur': '9s', '--del': '0s' } as React.CSSProperties} />
        <span className="msf-petal" style={{ left: '46%', '--dur': '11s', '--del': '-3s' } as React.CSSProperties} />
        <span className="msf-petal" style={{ left: '78%', '--dur': '10s', '--del': '-6s' } as React.CSSProperties} />

        {/* Glossy Floor */}
        <div className="msf-floor" aria-hidden="true" />

        {/* Giant 3D Extruded JOIE SALON Architecture */}
        <div className="msf-world">
          <div className="msf-letters">
            <div className="msf-letter-slot">
              <span className="msf-letter">J</span>
              {/* Miniature Pink Bucket beside J */}
              <svg
                className="msf-prop"
                style={{ left: '62%', bottom: '0%', width: 'clamp(16px, 2vw, 28px)' }}
                viewBox="0 0 28 24"
                aria-hidden="true"
              >
                <ellipse cx="14" cy="5" rx="10" ry="3.5" fill="#fff" />
                <path d="M5 6 L8 22 H20 L23 6 Z" fill="#e97fa1" />
              </svg>
            </div>

            <div className="msf-letter-slot">
              <span className="msf-letter">O</span>
            </div>

            <div className="msf-letter-slot">
              <span className="msf-letter">I</span>
            </div>

            <div className="msf-letter-slot">
              <span className="msf-letter">E</span>
              {/* Folded Pink Towels */}
              <div className="msf-prop msf-towels" style={{ left: '84%', bottom: '0%' }} aria-hidden="true">
                <span className="msf-towel" />
                <div className="msf-towel-row">
                  <span className="msf-towel" />
                  <span className="msf-towel" />
                </div>
              </div>
            </div>

            <div className="msf-space" />

            <div className="msf-letter-slot">
              <span className="msf-letter">S</span>
              {/* Potted Plant */}
              <svg
                className="msf-prop msf-plant"
                style={{ left: '-12%', bottom: '0%', width: 'clamp(18px, 2.2vw, 32px)' }}
                viewBox="0 0 32 36"
                aria-hidden="true"
              >
                <path d="M16 20 C10 10, 4 12, 8 22 M16 20 C16 6, 22 6, 18 22 M16 20 C24 12, 28 16, 22 22" stroke="#5b7a4b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <path d="M9 22 H23 L20 34 H12 Z" fill="#c7974f" />
              </svg>
            </div>

            <div className="msf-letter-slot">
              <span className="msf-letter">A</span>
              {/* Wooden Ladder leaning on A */}
              <svg
                className="msf-prop"
                style={{ left: '54%', bottom: '0%', width: 'clamp(16px, 2vw, 28px)', transform: 'rotate(-10deg)' }}
                viewBox="0 0 24 68"
                aria-hidden="true"
              >
                <line x1="4" y1="2" x2="4" y2="66" stroke="#b98a5a" strokeWidth="2.8" strokeLinecap="round" />
                <line x1="20" y1="2" x2="20" y2="66" stroke="#b98a5a" strokeWidth="2.8" strokeLinecap="round" />
                {[12, 24, 36, 48, 58].map((y) => (
                  <line key={y} x1="4" y1={y} x2="20" y2={y} stroke="#d4a673" strokeWidth="2.2" />
                ))}
              </svg>
            </div>

            <div className="msf-letter-slot">
              <span className="msf-letter">L</span>
            </div>

            {/* Second O: Interactive Illuminated Salon Mirror */}
            <div className="msf-letter-slot">
              <button
                type="button"
                aria-label={mirrorLit ? 'Turn off vanity mirror lights' : 'Turn on vanity mirror lights'}
                className={`msf-mirror-o ${mirrorLit ? 'is-lit' : ''}`}
                onClick={() => setMirrorLit((prev) => !prev)}
              >
                {BULB_ANGLES.map((ang, idx) => (
                  <span
                    key={idx}
                    className="msf-bulb"
                    style={{
                      left: `${50 + Math.cos(ang) * 58}%`,
                      top: `${50 + Math.sin(ang) * 58}%`,
                    }}
                  />
                ))}
              </button>
            </div>

            <div className="msf-letter-slot">
              <span className="msf-letter">N</span>
            </div>
          </div>

          {/* 7 Articulated Miniature Female Salon Workers */}
          {WORKERS.map((worker) => {
            const isExcited = wakingAll || excitedId === worker.id;
            const dOff = dragOffset[worker.id] ?? { x: 0, y: 0 };
            return (
              <div
                key={worker.id}
                role="button"
                tabIndex={0}
                aria-label={`${worker.role} — click to interact`}
                className={`msf-char msf-anim-breathe ${isExcited ? 'is-excited' : ''} ${
                  polishing && (worker.id === 'cleaner' || worker.id === 'mirror-girl') ? 'is-polishing' : ''
                } ${worker.id === 'ladder' ? 'msf-anim-climb' : ''}`}
                style={{
                  left: `${worker.leftPct}%`,
                  bottom: `${worker.bottomPct}%`,
                  width: worker.sizeClamp,
                  animationDelay: worker.delay,
                  transform: `translate(${dOff.x}px, ${dOff.y}px)`,
                }}
                onClick={() => handleWorkerClick(worker.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleWorkerClick(worker.id);
                  }
                }}
                onPointerDown={(e) => {
                  dragRef.current = { id: worker.id, sx: e.clientX, sy: e.clientY };
                }}
              >
                {excitedId === worker.id ? (
                  <span className="msf-bubble">{worker.message}</span>
                ) : null}
                <WorkerIllustration spec={worker} eyeOffset={eyeOffset} airflowOn={airflowOn} />
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default MiniatureSalonFooter;
