import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
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

// Seeded offsets per post index so pins are stable
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
    html: `<div style="font-size:24px;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:hsl(0 0% 10% / 0.85);box-shadow:0 2px 8px rgba(0,0,0,0.5);">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function FlyToUser({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function MapView() {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [selected, setSelected] = useState<Post | null>(null);
  const [userPos, setUserPos] = useState<[number, number]>(DEFAULT_CENTER);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {/* keep default */},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const filtered = filter === 'all' ? DUMMY_POSTS : DUMMY_POSTS.filter(p => p.category === filter);

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

      {/* Map */}
      <MapContainer
        center={userPos}
        zoom={14}
        zoomControl={false}
        className="h-full w-full"
        style={{ background: '#0d0d0d' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FlyToUser center={userPos} />

        {/* Post markers */}
        {filtered.map((post, i) => {
          const offset = OFFSETS[i % OFFSETS.length];
          const position: [number, number] = [
            userPos[0] + offset[0],
            userPos[1] + offset[1],
          ];
          return (
            <Marker
              key={post.id}
              position={position}
              icon={makeIcon(post.category)}
              eventHandlers={{ click: () => setSelected(post) }}
            />
          );
        })}

        {/* User location marker */}
        <Marker
          position={userPos}
          icon={L.divIcon({
            className: '',
            html: `<div style="width:16px;height:16px;border-radius:50%;background:hsl(272 60% 47%);box-shadow:0 0 12px 4px hsl(272 60% 47% / 0.5);border:2px solid white;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}
        />
      </MapContainer>

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
