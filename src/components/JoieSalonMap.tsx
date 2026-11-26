'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus, LocateFixed, Navigation, ArrowUpRight } from 'lucide-react';
import { BUSINESS_INFO } from '../data/barbershopData';
import { useTheme } from '../hooks/useActivity';

// Verified coordinates for Jyoti Nagar Main Road, Behind Crystal Mall, Rajkot 360005
const SALON_COORDS: [number, number] = [22.2798, 70.7632];
const DEFAULT_ZOOM = 16;

const OSM_TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const JoieSalonMap: React.FC = () => {
  const theme = useTheme();
  const isLight = theme === 'light';

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || mapRef.current) return;

    const map = L.map(el, {
      center: SALON_COORDS,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    const tiles = L.tileLayer(OSM_TILES, {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'joie-map-pin-wrapper',
      iconSize: [44, 52],
      iconAnchor: [22, 48],
      popupAnchor: [0, -46],
      html: `
        <div style="position:relative;width:44px;height:52px;display:flex;align-items:center;justify-content:center;">
          <span style="position:absolute;bottom:2px;width:24px;height:24px;border-radius:999px;background:rgba(35,44,59,0.28);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
          <div style="position:relative;width:36px;height:36px;border-radius:999px 999px 999px 0;transform:rotate(-45deg);background:#232C3B;border:2.5px solid #FFFFFF;box-shadow:0 8px 20px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
            <span style="transform:rotate(45deg);color:#F5F7FA;font-weight:800;font-size:13px;font-family:sans-serif;letter-spacing:-0.02em;">J</span>
          </div>
        </div>
      `,
    });

    const marker = L.marker(SALON_COORDS, { icon: pinIcon }).addTo(map);
    marker.bindPopup(
      `
      <div style="font-family:system-ui,-apple-system,sans-serif;min-width:190px;padding:2px 0;">
        <div style="font-weight:700;font-size:13px;color:#232C3B;letter-spacing:0.03em;">JOIE SALON · FOR LADIES</div>
        <div style="font-size:11.5px;color:#4B5563;margin-top:3px;line-height:1.4;">Jyoti Nagar Main Road, Near Masoom School, Behind Crystal Mall, Rajkot</div>
        <div style="font-size:11px;color:#6B7280;margin-top:4px;">Mon–Sun · 10:00 AM – 8:00 PM</div>
      </div>
      `,
      { closeButton: false }
    );

    map.on('zoomend', () => {
      setZoomLevel(map.getZoom());
    });

    mapRef.current = map;
    tileLayerRef.current = tiles;

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Apply dark-map filter cleanly on tile pane in dark mode (zero external API key needed)
  useEffect(() => {
    const pane = mapRef.current?.getPane('tilePane');
    if (!pane) return;
    pane.style.filter = isLight
      ? 'saturate(0.9) contrast(1.02)'
      : 'invert(1) hue-rotate(195deg) brightness(0.88) contrast(1.08) saturate(0.4)';
  }, [isLight]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleRecenter = () => {
    mapRef.current?.setView(SALON_COORDS, DEFAULT_ZOOM, { animate: true });
  };

  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[410px] rounded-xl overflow-hidden">
      <div ref={containerRef} className="w-full h-full min-h-[360px] sm:min-h-[410px] z-0" />

      {/* Top-Left Live Location Badge */}
      <div
        className={`pointer-events-none absolute top-3.5 left-3.5 z-[400] inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide backdrop-blur-md border shadow-sm ${
          isLight
            ? 'bg-white/90 text-[#232C3B] border-[#232C3B]/15'
            : 'bg-[#140F0C]/90 text-[#F7F1E8] border-[#DFAF63]/30'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Jyoti Nagar · Rajkot</span>
      </div>

      {/* Bottom-Right Custom Zoom & Recenter Controls */}
      <div
        className={`absolute bottom-10 right-3.5 z-[400] flex flex-col gap-1.5 p-1 rounded-xl border backdrop-blur-md shadow-md ${
          isLight
            ? 'bg-white/92 border-[#232C3B]/15 text-[#232C3B]'
            : 'bg-[#140F0C]/92 border-[#DFAF63]/30 text-[#F7F1E8]'
        }`}
        role="group"
        aria-label="Map zoom controls"
      >
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoomLevel >= 19}
          aria-label="Zoom in map"
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 disabled:opacity-35 transition-colors cursor-pointer"
        >
          <Plus size={15} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 11}
          aria-label="Zoom out map"
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 disabled:opacity-35 transition-colors cursor-pointer"
        >
          <Minus size={15} />
        </button>
        <div className={`h-px mx-1 ${isLight ? 'bg-[#232C3B]/10' : 'bg-white/10'}`} />
        <button
          type="button"
          onClick={handleRecenter}
          aria-label="Recenter map on Joie Salon"
          title="Recenter on Joie Salon"
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
        >
          <LocateFixed size={14} />
        </button>
      </div>

      {/* Bottom-Left Quick Directions Pill */}
      <a
        href={BUSINESS_INFO.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute bottom-3.5 left-3.5 z-[400] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-semibold tracking-wide shadow-md transition-transform hover:-translate-y-0.5 ${
          isLight
            ? 'bg-[#232C3B] text-[#F5F7FA] hover:bg-[#363D49]'
            : 'bg-[#E5B96F] text-[#0C0907] hover:brightness-110'
        }`}
      >
        <Navigation size={12} aria-hidden="true" />
        <span>Open in Google Maps</span>
        <ArrowUpRight size={12} aria-hidden="true" />
      </a>
    </div>
  );
};
