-- Enable public read access to green card priority dates tables
-- These tables contain public visa bulletin information that should be accessible to everyone

-- Create policy for green_card_priority_dates_action table
CREATE POLICY "Allow public read access to priority dates action" 
ON public.green_card_priority_dates_action 
FOR SELECT 
USING (true);

-- Create policy for green_card_priority_dates_filing table  
CREATE POLICY "Allow public read access to priority dates filing" 
ON public.green_card_priority_dates_filing 
FOR SELECT 
USING (true);