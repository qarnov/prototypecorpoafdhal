import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DUMMY_POSTS, CATEGORY_CONFIG } from '@/lib/constants';
import type { Post, Category } from '@/lib/constants';
import CategoryBadge from '@/components/CategoryBadge';
import { X } from 'lucide-react';

const FILTER_OPTIONS: { label: string; value: Category | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🚨 Urgent', value: 'urgent' },
  { label: '🚗 Carpool', value: 'carpool' },
  { label: '📦 Services', value: 'errand' },
];

const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946];

const OFFSETS: [number, number][] = [
  [0.008, -0.012],
  [-0.015, 0.006],
  [0.004, 0.018],
  [-0.009, -0.005],
  [0.017, 0.009],
  [-0.006, 0.014],
];

function makeIcon(category: Category) {
  const emoji = CATEGORY_CONFIG[category].emoji;
  return L.divIcon({
    className: '',
    html: `<div style="font-size:22px;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(20,20,20,0.85);box-shadow:0 2px 8px rgba(0,0,0,0.5);">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;border-radius:50%;background:hsl(272,60%,47%);box-shadow:0 0 12px 4px hsla(272,60%,47%,0.5);border:2px solid white;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function MapView() {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [selected, setSelected] = useState<Post | null>(null);
  const [userPos, setUserPos] = useState<[number, number]>(DEFAULT_CENTER);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: 14,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    mapRef.current = map;

    // Get user location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        map.flyTo(coords, 14, { duration: 1.5 });
      },
      () => {/* keep default */},
      { enableHighAccuracy: true, timeout: 8000 }
    );

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when filter or userPos changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    userMarkerRef.current?.remove();

    // User marker
    userMarkerRef.current = L.marker(userPos, { icon: userIcon }).addTo(map);

    // Post markers
    const filtered = filter === 'all' ? DUMMY_POSTS : DUMMY_POSTS.filter(p => p.category === filter);
    filtered.forEach((post, i) => {
      const offset = OFFSETS[i % OFFSETS.length];
      const pos: [number, number] = [userPos[0] + offset[0], userPos[1] + offset[1]];
      const marker = L.marker(pos, { icon: makeIcon(post.category) })
        .addTo(map)
        .on('click', () => setSelected(post));
      markersRef.current.push(marker);
    });
  }, [filter, userPos]);

  return (
    <div className="relative h-screen w-full overflow-hidden pb-20">
      {/* Filters */}
      <div className="absolute top-3 left-0 right-0 z-[1000] flex justify-center gap-2 px-4">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setSelected(null); }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-lg transition-all ${
              filter === f.value
                ? 'gradient-karma text-primary-foreground'
                : 'bg-card/80 text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Map container */}
      <div ref={mapContainerRef} className="h-full w-full" style={{ background: '#0d0d0d' }} />

      {/* Selected popup */}
      {selected && (
        <div className="absolute bottom-24 left-4 right-4 z-[1000] animate-fade-in rounded-xl border border-border bg-card p-4">
          <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 font-heading text-xs font-bold text-primary">
              {selected.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-sm font-semibold">{selected.username}</span>
              <span className="ml-2 text-xs text-muted-foreground">{selected.distance}</span>
            </div>
          </div>
          <p className="mb-3 text-sm text-foreground/90">{selected.text}</p>
          <div className="flex items-center justify-between">
            <CategoryBadge category={selected.category} />
            <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
              Help
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
