import { MapPin, Clock } from 'lucide-react';
import type { Post } from '@/lib/constants';
import { CATEGORY_CONFIG, getRank } from '@/lib/constants';
import CategoryBadge from './CategoryBadge';

interface Props {
  post: Post;
  index: number;
  onHelp?: (post: Post) => void;
}

export default function RequestCard({ post, index, onHelp }: Props) {
  const firstLetter = post.username.charAt(0).toUpperCase();
  const rankInfo = getRank(
    post.userRank === 'Gold' ? 500 :
    post.userRank === 'Diamond' ? 1500 :
    post.userRank === 'Vanguard' ? 3000 : 0
  );

  return (
    <div
      className="animate-fade-in rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 font-heading text-sm font-bold text-primary">
            {firstLetter}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{post.username}</span>
              <span className="text-xs">{rankInfo.current.emoji}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {post.distance} · {post.areaName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {post.timestamp}
        </div>
      </div>

      {/* Body */}
      <p className="mb-3 text-sm leading-relaxed text-foreground/90">{post.text}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <CategoryBadge category={post.category} />
        <button
          onClick={() => onHelp?.(post)}
          className="rounded-lg bg-primary/15 px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25 active:scale-95"
        >
          Help
        </button>
      </div>
    </div>
  );
}
