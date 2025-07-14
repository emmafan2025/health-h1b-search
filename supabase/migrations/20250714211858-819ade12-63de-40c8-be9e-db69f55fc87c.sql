-- Create table to track visa data synchronization metadata
CREATE TABLE IF NOT EXISTS public.visa_sync_metadata (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending',
  records_updated INTEGER DEFAULT 0,
  error_message TEXT,
  source_url TEXT DEFAULT 'https://visa.careerengine.us/',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the metadata table
ALTER TABLE public.visa_sync_metadata ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to sync metadata
CREATE POLICY "Allow public read access to sync metadata" 
ON public.visa_sync_metadata 
FOR SELECT 
USING (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_visa_sync_metadata_updated_at
BEFORE UPDATE ON public.visa_sync_metadata
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial metadata record
INSERT INTO public.visa_sync_metadata (id, sync_status) 
VALUES (1, 'never_synced') 
ON CONFLICT (id) DO NOTHING;