import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface UsernameModalProps {
  userId: string;
  onComplete: () => void;
}

export default function UsernameModal({ userId, onComplete }: UsernameModalProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      toast.error('Username is required');
      return;
    }
    if (trimmed.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ username: trimmed })
      .eq('id', userId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome to Karma!');
      onComplete();
    }
    setLoading(false);
  };

  return (
    <Dialog open>
      <DialogContent className="border-border bg-card sm:max-w-sm [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center font-heading text-2xl">
            Choose your username
          </DialogTitle>
          <DialogDescription className="text-center">
            This is how others will see you on Karma
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. arjun_k"
            autoFocus
            className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            minLength={3}
            maxLength={20}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 font-heading text-sm font-bold text-primary-foreground transition-all disabled:opacity-40 active:scale-[0.98]"
          >
            {loading ? '...' : "Let's go"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
