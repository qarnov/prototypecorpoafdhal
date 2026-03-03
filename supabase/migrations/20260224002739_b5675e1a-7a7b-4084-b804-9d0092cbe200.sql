
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  xp INTEGER NOT NULL DEFAULT 0,
  rank TEXT NOT NULL DEFAULT 'Solver',
  help_count INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  area_name TEXT DEFAULT 'Unknown',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Create posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  user_rank TEXT NOT NULL DEFAULT 'Solver',
  text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('urgent', 'carpool', 'errand', 'social', 'emergency')),
  area_name TEXT NOT NULL DEFAULT 'Unknown',
  distance TEXT DEFAULT '0km',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create own posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- Create chats table
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_chat_participant(_chat_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chats
    WHERE id = _chat_id AND (user1_id = _user_id OR user2_id = _user_id)
  );
$$;

CREATE POLICY "Users can view own chats" ON public.chats FOR SELECT TO authenticated USING (user1_id = auth.uid() OR user2_id = auth.uid());
CREATE POLICY "Users can create chats" ON public.chats FOR INSERT TO authenticated WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their chats" ON public.messages FOR SELECT TO authenticated USING (public.is_chat_participant(chat_id, auth.uid()));
CREATE POLICY "Users can send messages in their chats" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid() AND public.is_chat_participant(chat_id, auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create ratings table
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rated_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(rater_id, post_id)
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ratings" ON public.ratings FOR SELECT TO authenticated USING (rater_id = auth.uid() OR rated_user_id = auth.uid());
CREATE POLICY "Users can create ratings" ON public.ratings FOR INSERT TO authenticated WITH CHECK (rater_id = auth.uid());

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
