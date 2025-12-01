-- Fix security issue: Set search_path for the function
DROP TRIGGER IF EXISTS on_template_used ON public.bet_templates;
DROP FUNCTION IF EXISTS update_social_post_tails();

CREATE OR REPLACE FUNCTION update_social_post_tails()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.social_posts
  SET tails_count = tails_count + 1
  WHERE template_id = NEW.id AND post_type = 'template';
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_template_used
AFTER UPDATE OF times_used ON public.bet_templates
FOR EACH ROW
WHEN (NEW.times_used > OLD.times_used)
EXECUTE FUNCTION update_social_post_tails();