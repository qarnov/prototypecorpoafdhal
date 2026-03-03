import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import type { Category } from '@/lib/constants';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const CATEGORIES: Category[] = ['urgent', 'carpool', 'errand', 'social', 'emergency'];

export default function PostRequest() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('urgent');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!text.trim() || !user) return;
    setLoading(true);

    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      username: profile?.username ?? 'anonymous',
      user_rank: profile?.rank ?? 'Solver',
      text: text.trim(),
      category,
      area_name: profile?.area_name ?? 'Indiranagar',
      distance: '0km',
    });

    if (error) {
      toast.error('Failed to post: ' + error.message);
    } else {
      toast.success('Request posted!');
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/90 backdrop-blur-xl px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-heading text-lg font-bold">Post a Request</h1>
      </header>

      <div className="mx-auto max-w-md px-4 pt-6 space-y-6">
        <div className="flex items-center gap-2 rounded-lg bg-card px-3 py-2.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{profile?.area_name ?? 'Indiranagar'}, Bangalore</span>
          <span className="ml-auto text-[10px] text-primary">Auto-detected</span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you need help with?"
          className="w-full resize-none rounded-xl border border-border bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          rows={4}
        />

        <div>
          <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              const isActive = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'gradient-karma text-primary-foreground glow-purple-sm'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {config.emoji} {config.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handlePost}
          disabled={!text.trim() || loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-heading text-sm font-bold text-primary-foreground transition-all disabled:opacity-40 active:scale-[0.98] glow-purple"
        >
          <Send className="h-4 w-4" />
          {loading ? 'Posting...' : 'Post Request'}
        </button>
      </div>
    </div>
  );
}
