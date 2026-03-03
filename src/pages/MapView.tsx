import { useState } from 'react';
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

// Simulated pin positions on a dark map
const PIN_POSITIONS = [
  { top: '28%', left: '62%' },
  { top: '45%', left: '30%' },
  { top: '55%', left: '70%' },
  { top: '35%', left: '45%' },
  { top: '68%', left: '55%' },
  { top: '20%', left: '38%' },
];

const PIN_COLORS: Record<Category, string> = {
  urgent: 'bg-destructive',
  carpool: 'bg-primary',
  errand: 'bg-muted-foreground',
  social: 'bg-social',
  emergency: 'bg-destructive',
};

export default function MapView() {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [selected, setSelected] = useState<Post | null>(null);

  const filtered = filter === 'all' ? DUMMY_POSTS : DUMMY_POSTS.filter(p => p.category === filter);

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      {/* Filters */}
      <div className="absolute top-3 left-0 right-0 z-30 flex justify-center gap-2 px-4">
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

      {/* Dark Map */}
      <div className="relative h-screen w-full bg-[#0d0d0d]">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(hsl(272 60% 47% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(272 60% 47% / 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* User location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="h-4 w-4 rounded-full bg-primary glow-purple" />
            <div className="absolute inset-0 h-4 w-4 rounded-full bg-primary/40 pulse-ring" />
          </div>
        </div>

        {/* Pins */}
        {filtered.map((post, i) => {
          const pos = PIN_POSITIONS[i % PIN_POSITIONS.length];
          const config = CATEGORY_CONFIG[post.category];
          return (
            <button
              key={post.id}
              onClick={() => setSelected(post)}
              className="absolute z-20 flex flex-col items-center gap-0.5 animate-scale-in"
              style={{ top: pos.top, left: pos.left, animationDelay: `${i * 100}ms` }}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${PIN_COLORS[post.category]} shadow-lg text-sm`}>
                {config.emoji}
              </div>
              <span className="rounded bg-card/90 px-1.5 py-0.5 text-[9px] font-medium text-foreground backdrop-blur-sm">
                {post.areaName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected popup */}
      {selected && (
        <div className="absolute bottom-24 left-4 right-4 z-40 animate-fade-in rounded-xl border border-border bg-card p-4">
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
