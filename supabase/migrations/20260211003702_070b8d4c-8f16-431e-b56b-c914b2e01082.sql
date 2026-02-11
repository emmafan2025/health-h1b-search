
-- Remove author_email columns from forum tables to prevent email harvesting
ALTER TABLE public.forum_posts DROP COLUMN IF EXISTS author_email;
ALTER TABLE public.forum_replies DROP COLUMN IF EXISTS author_email;
