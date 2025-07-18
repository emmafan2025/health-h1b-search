-- Add email field to profiles table for email marketing
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Update the handle_new_user function to save email from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id, 
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'User_' || substring(NEW.id::text from 1 for 8)
    ),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;