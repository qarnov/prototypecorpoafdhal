export type Category = 'urgent' | 'carpool' | 'errand' | 'social' | 'emergency';

export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; emoji: string }> = {
  urgent: { label: 'Urgent', color: 'bg-destructive', emoji: '🚨' },
  carpool: { label: 'Carpool', color: 'bg-primary', emoji: '🚗' },
  errand: { label: 'Errand', color: 'bg-muted', emoji: '📦' },
  social: { label: 'Social', color: 'bg-social', emoji: '👋' },
  emergency: { label: 'Emergency', color: 'bg-destructive flash-emergency', emoji: '🆘' },
};

export const RANKS = [
  { name: 'Solver', xp: 0, emoji: '🔧' },
  { name: 'Gold', xp: 500, emoji: '🥇' },
  { name: 'Diamond', xp: 1500, emoji: '💎' },
  { name: 'Vanguard', xp: 3000, emoji: '⚔️' },
  { name: 'Dark Knight', xp: 6000, emoji: '🦇' },
  { name: 'Anbu', xp: 10000, emoji: '🥷' },
  { name: 'One For All', xp: 20000, emoji: '⚡' },
  { name: 'Hero of the City', xp: 50000, emoji: '🏆' },
];

export const BADGES = [
  { id: 'first-help', name: 'First Help', emoji: '⚡', desc: 'Help your first person', condition: (u: any) => u.helpCount >= 1 },
  { id: 'on-streak', name: 'On Streak', emoji: '🔥', desc: '7 day help streak', condition: (u: any) => u.streak >= 7 },
  { id: 'night-owl', name: 'Night Owl', emoji: '🌙', desc: 'Help after midnight', condition: () => false },
  { id: 'dark-knight', name: 'Dark Knight', emoji: '🦇', desc: 'Reach Diamond rank', condition: (u: any) => u.xp >= 1500 },
];

export function getRank(xp: number) {
  let current = RANKS[0];
  let next = RANKS[1];
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].xp) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
      break;
    }
  }
  return { current, next, rankIndex: RANKS.indexOf(current) };
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userRank: string;
  text: string;
  category: Category;
  areaName: string;
  distance: string;
  timestamp: string;
  status: 'open' | 'resolved';
}

export const DUMMY_POSTS: Post[] = [
  { id: '1', userId: 'u1', username: 'arjun_k', userRank: 'Gold', text: 'Ran out of fuel near Whitefield signal. Petrol pumps closed. Any biker nearby who can help? Happy to pay', category: 'urgent', areaName: 'Whitefield', distance: '0.4km', timestamp: 'just now', status: 'open' },
  { id: '2', userId: 'u2', username: 'priya_m', userRank: 'Solver', text: 'Looking to carpool to Koramangala around 9AM. Uber keeps cancelling. Anyone going that way?', category: 'carpool', areaName: 'HSR Layout', distance: '0.8km', timestamp: '2 mins ago', status: 'open' },
  { id: '3', userId: 'u3', username: 'dev_shah', userRank: 'Diamond', text: 'Need someone to print 2 pages urgently. Printer dead. Will Swiggy someone coffee in return', category: 'errand', areaName: 'Indiranagar', distance: '1.2km', timestamp: '5 mins ago', status: 'open' },
  { id: '4', userId: 'u4', username: 'sneha_r', userRank: 'Gold', text: 'My dog slipped out of the gate, anyone seen a black lab near Indiranagar?', category: 'emergency', areaName: 'Indiranagar', distance: '0.6km', timestamp: '12 mins ago', status: 'open' },
  { id: '5', userId: 'u5', username: 'rahul_v', userRank: 'Solver', text: "Anyone up for a run at 6AM tomorrow? I'm new here", category: 'social', areaName: 'Koramangala', distance: '0.3km', timestamp: '18 mins ago', status: 'open' },
  { id: '6', userId: 'u6', username: 'ananya_j', userRank: 'Vanguard', text: 'Tyre puncture near HSR Layout. Anyone with a pump or knows a nearby mechanic?', category: 'urgent', areaName: 'HSR Layout', distance: '1.8km', timestamp: '25 mins ago', status: 'open' },
];
