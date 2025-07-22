-- Enable Row Level Security for healthcare_h1b_cases table
ALTER TABLE public.healthcare_h1b_cases ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public read access to H1B data
CREATE POLICY "Allow public read access to H1B data" 
ON public.healthcare_h1b_cases 
FOR SELECT 
USING (true);

-- Optional: Add a comment explaining why this policy exists
COMMENT ON POLICY "Allow public read access to H1B data" ON public.healthcare_h1b_cases 
IS 'H1B case data is public information and should be accessible to all users for research and analysis purposes';