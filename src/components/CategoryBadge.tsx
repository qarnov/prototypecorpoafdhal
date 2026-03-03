import type { Category } from '@/lib/constants';
import { CATEGORY_CONFIG } from '@/lib/constants';

interface Props {
  category: Category;
  size?: 'sm' | 'md';
}

const COLOR_MAP: Record<Category, string> = {
  urgent: 'bg-destructive/20 text-destructive',
  carpool: 'bg-primary/20 text-primary',
  errand: 'bg-muted text-muted-foreground',
  social: 'bg-social/20 text-social',
  emergency: 'bg-destructive/20 text-destructive flash-emergency',
};

export default function CategoryBadge({ category, size = 'sm' }: Props) {
  const config = CATEGORY_CONFIG[category];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${COLOR_MAP[category]} ${sizeClass}`}>
      {config.emoji} {config.label}
    </span>
  );
}
