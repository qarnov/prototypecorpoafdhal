import { getRank, RANKS, BADGES } from '@/lib/constants';
import { Star, Flame, HandHelping, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const { profile, signOut } = useAuth();
  const user = {
    username: profile?.username ?? 'user',
    xp: profile?.xp ?? 0,
    helpCount: profile?.help_count ?? 0,
    rating: profile?.rating ?? 0,
    streak: profile?.streak ?? 0,
  };
  const { current, next, rankIndex } = getRank(user.xp);
  const progress = next ? ((user.xp - current.xp) / (next.xp - current.xp)) * 100 : 100;

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur-xl px-4 py-3">
        <h1 className="font-heading text-lg font-bold">Profile</h1>
        <button onClick={signOut} className="flex items-center gap-1 text-xs text-muted-foreground">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </header>

      <div className="mx-auto max-w-md px-4 pt-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="h-24 w-24 rounded-full p-[3px] gradient-karma">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-background font-heading text-3xl font-extrabold text-primary">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <h2 className="font-heading text-xl font-bold">{user.username}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-lg">{current.emoji}</span>
            <span className="text-sm font-semibold text-primary">{current.name}</span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-muted-foreground">{user.xp} XP</span>
            <span className="text-muted-foreground">{next ? `${next.xp} XP for ${next.name}` : 'Max Rank'}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full gradient-karma transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: HandHelping, label: 'Helped', value: user.helpCount },
            { icon: Star, label: 'Rating', value: `${user.rating}/5` },
            { icon: Flame, label: 'Streak', value: `${user.streak}d` },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center rounded-xl border border-border bg-card py-3">
              <stat.icon className="mb-1 h-4 w-4 text-primary" />
              <span className="text-lg font-bold font-heading">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Rank Path */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-4 font-heading text-sm font-bold">Rank Path</h3>
          <div className="space-y-0">
            {RANKS.map((rank, i) => {
              const achieved = i <= rankIndex;
              return (
                <div key={rank.name} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      achieved ? 'gradient-karma glow-purple-sm' : 'bg-secondary'
                    }`}>
                      {rank.emoji}
                    </div>
                    {i < RANKS.length - 1 && (
                      <div className={`h-6 w-0.5 ${achieved && i < rankIndex ? 'bg-primary' : 'bg-secondary'}`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <span className={`text-sm font-semibold ${achieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {rank.name}
                    </span>
                    <span className="ml-2 text-[10px] text-muted-foreground">{rank.xp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 font-heading text-sm font-bold">Badges</h3>
          <div className="grid grid-cols-2 gap-2">
            {BADGES.map((badge) => {
              const earned = badge.condition(user);
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-2 rounded-lg p-2.5 ${
                    earned ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50 opacity-40'
                  }`}
                >
                  <span className="text-xl">{badge.emoji}</span>
                  <div>
                    <span className="text-xs font-semibold">{badge.name}</span>
                    <p className="text-[10px] text-muted-foreground">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
