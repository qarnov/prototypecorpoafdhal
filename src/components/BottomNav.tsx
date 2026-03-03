import { Home, MapPin, MessageCircle, User, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Feed' },
  { path: '/map', icon: MapPin, label: 'Map' },
  { path: '/post', icon: Plus, label: 'Post', isCenter: true },
  { path: '/chats', icon: MessageCircle, label: 'Chats' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl safe-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="gradient-karma -mt-6 flex h-14 w-14 items-center justify-center rounded-full glow-purple transition-transform active:scale-95"
              >
                <Icon className="h-6 w-6 text-primary-foreground" />
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
