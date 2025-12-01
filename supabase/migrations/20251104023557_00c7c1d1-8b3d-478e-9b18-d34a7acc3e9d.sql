-- Create social posts table for sharing bets and templates
CREATE TABLE public.social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_type TEXT NOT NULL CHECK (post_type IN ('prediction', 'template')),
  prediction_id UUID REFERENCES public.predictions(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.bet_templates(id) ON DELETE CASCADE,
  caption TEXT,
  likes_count INTEGER NOT NULL DEFAULT 0,
  tails_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT post_reference_check CHECK (
    (post_type = 'prediction' AND prediction_id IS NOT NULL AND template_id IS NULL) OR
    (post_type = 'template' AND template_id IS NOT NULL AND prediction_id IS NULL)
  )
);

-- Create social post likes table
CREATE TABLE public.social_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_post_likes ENABLE ROW LEVEL SECURITY;

-- Policies for social_posts
CREATE POLICY "Anyone can view social posts"
ON public.social_posts
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own posts"
ON public.social_posts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
ON public.social_posts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
ON public.social_posts
FOR DELETE
USING (auth.uid() = user_id);

-- Policies for social_post_likes
CREATE POLICY "Anyone can view likes"
ON public.social_post_likes
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own likes"
ON public.social_post_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
ON public.social_post_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX idx_social_posts_created_at ON public.social_posts(created_at DESC);
CREATE INDEX idx_social_post_likes_post_id ON public.social_post_likes(post_id);

-- Create trigger to update tails_count when template is used
CREATE OR REPLACE FUNCTION update_social_post_tails()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.social_posts
  SET tails_count = tails_count + 1
  WHERE template_id = NEW.id AND post_type = 'template';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_template_used
AFTER UPDATE OF times_used ON public.bet_templates
FOR EACH ROW
WHEN (NEW.times_used > OLD.times_used)
EXECUTE FUNCTION update_social_post_tails();