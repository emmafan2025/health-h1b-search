-- Set up automated visa data synchronization using pg_cron
-- This will run the sync function every day at 9 AM UTC (which is around 5 AM EST)

-- First, enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the visa data sync job to run daily at 9:00 AM UTC
SELECT cron.schedule(
  'daily-visa-sync',
  '0 9 * * *', -- Daily at 9:00 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://okwimslqbvgszjiqzorb.supabase.co/functions/v1/sync-visa-data',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rd2ltc2xxYnZnc3pqaXF6b3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MjU1MzQsImV4cCI6MjA2NTQwMTUzNH0.d62e3KuAT5brEQrsVLIcPSbmmRWOa5Ps73MSCfo-eP0"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);