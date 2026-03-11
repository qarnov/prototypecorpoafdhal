import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import BottomNav from "./components/BottomNav";
import Feed from "./pages/Feed";
import PostRequest from "./pages/PostRequest";
import MapView from "./pages/MapView";
import ChatList from "./pages/ChatList";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import UsernameModal from "./components/UsernameModal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading, needsUsername, refreshProfile } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <div className="mx-auto max-w-md min-h-screen">
      {needsUsername && user && (
        <UsernameModal userId={user.id} onComplete={refreshProfile} />
      )}
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/post" element={<PostRequest />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
