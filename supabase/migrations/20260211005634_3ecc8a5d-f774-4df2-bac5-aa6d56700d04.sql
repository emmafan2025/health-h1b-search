
-- Fix 1: Enable RLS on green card priority dates tables
ALTER TABLE public.green_card_priority_dates_action ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.green_card_priority_dates_filing ENABLE ROW LEVEL SECURITY;

-- Fix 2: Remove email from profiles table and update handle_new_user function
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id, 
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'User_' || substring(NEW.id::text from 1 for 8)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
