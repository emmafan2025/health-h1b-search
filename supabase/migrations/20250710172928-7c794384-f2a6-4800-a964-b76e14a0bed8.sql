-- Create forum posts table
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum replies table
CREATE TABLE public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (forum should be public)
CREATE POLICY "Forum posts are viewable by everyone" 
ON public.forum_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create forum posts" 
ON public.forum_posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Forum replies are viewable by everyone" 
ON public.forum_replies 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create forum replies" 
ON public.forum_replies 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_forum_posts_updated_at
BEFORE UPDATE ON public.forum_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
BEFORE UPDATE ON public.forum_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get posts with reply counts
CREATE OR REPLACE FUNCTION public.get_forum_posts_with_reply_counts()
RETURNS TABLE(
  id UUID,
  title TEXT,
  content TEXT,
  author_name TEXT,
  category TEXT,
  views INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  reply_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fp.id,
    fp.title,
    fp.content,
    fp.author_name,
    fp.category,
    fp.views,
    fp.created_at,
    fp.updated_at,
    COALESCE(COUNT(fr.id), 0) as reply_count
  FROM public.forum_posts fp
  LEFT JOIN public.forum_replies fr ON fp.id = fr.post_id
  GROUP BY fp.id, fp.title, fp.content, fp.author_name, fp.category, fp.views, fp.created_at, fp.updated_at
  ORDER BY fp.updated_at DESC;
END;
$$;