import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import RequestCard from '@/components/RequestCard';
import { DUMMY_POSTS, getRank } from '@/lib/constants';
import type { Post, Category } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export default function Feed() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>(DUMMY_POSTS);
  const [dbPosts, setDbPosts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch initial posts
    supabase.from('posts').select('*').eq('status', 'open').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setDbPosts(data);
    });

    // Realtime subscription
    const channel = supabase
      .channel('posts-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setDbPosts((prev) => [payload.new as any, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setDbPosts((prev) => prev.filter((p) => p.id !== (payload.old as any).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const livePosts: Post[] = dbPosts.map((p) => ({
    id: p.id,
    userId: p.user_id,
    username: p.username,
    userRank: p.user_rank,
    text: p.text,
    category: p.category as Category,
    areaName: p.area_name,
    distance: p.distance || '0km',
    timestamp: timeAgo(p.created_at),
    status: p.status,
  }));

  const allPosts = [...livePosts, ...DUMMY_POSTS];

  const userXp = profile?.xp ?? 0;
  const { current: rank } = getRank(userXp);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gradient-karma font-heading text-2xl font-extrabold tracking-tight">karma</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs">{rank.emoji}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{rank.name} · {userXp} XP</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 font-heading text-sm font-bold text-primary"
          >
            {profile?.username?.charAt(0)?.toUpperCase() ?? 'U'}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 pt-4">
        <button
          onClick={() => navigate('/post')}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-destructive py-3.5 font-heading text-sm font-bold text-destructive-foreground glow-red transition-transform active:scale-[0.98]"
        >
          <AlertTriangle className="h-4 w-4" />
          Post a Request
        </button>

        <div className="space-y-3">
          {allPosts.map((post, i) => (
            <RequestCard key={post.id} post={post} index={i} onHelp={() => navigate('/chats')} />
          ))}
        </div>
      </div>
    </div>
  );
}
