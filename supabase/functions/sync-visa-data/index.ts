import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface VisaDataRow {
  category: string;
  china_current: string | null;
  india_current: string | null;
  mexico_current: string | null;
  philippines_current: string | null;
  global_current: string | null;
}

// Parse date from various formats to standardized format
function parseVisaDate(dateStr: string): string | null {
  if (!dateStr || dateStr.includes('暂无排期') || dateStr.includes('无需排期') || dateStr.includes('无变化')) {
    if (dateStr.includes('暂无排期')) return 'U';
    if (dateStr.includes('无需排期')) return 'C';
    return null;
  }

  // Extract date from Chinese format like "2022年11月15日"
  const dateMatch = dateStr.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日/);
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return null;
}

// Extract visa data from HTML
function extractVisaData(html: string): { actionDates: VisaDataRow[], filingDates: VisaDataRow[] } {
  const actionDates: VisaDataRow[] = [];
  const filingDates: VisaDataRow[] = [];

  // Extract table data - this is a simplified parser
  // In production, you'd want a more robust HTML parser
  const tableMatches = html.matchAll(/<table[^>]*>(.*?)<\/table>/gs);
  
  for (const tableMatch of tableMatches) {
    const tableContent = tableMatch[1];
    const rowMatches = tableContent.matchAll(/<tr[^>]*>(.*?)<\/tr>/gs);
    
    for (const rowMatch of rowMatches) {
      const rowContent = rowMatch[1];
      const cellMatches = [...rowContent.matchAll(/<td[^>]*>(.*?)<\/td>/gs)];
      
      if (cellMatches.length >= 3) {
        const categoryCell = cellMatches[0][1];
        const chinaCell = cellMatches[1][1];
        const globalCell = cellMatches[2][1];

        // Extract category name
        const categoryMatch = categoryCell.match(/EB-[1-5]|Other Workers|Certain Religious Workers/);
        if (categoryMatch) {
          const category = categoryMatch[0];
          
          // Parse China dates (multiple dates in cell)
          const chinaDateMatches = [...chinaCell.matchAll(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日/g)];
          const chinaDate = chinaDateMatches.length > 1 ? parseVisaDate(chinaDateMatches[1][0]) : parseVisaDate(chinaCell);
          
          // Parse global dates
          const globalDate = parseVisaDate(globalCell);

          const dataRow: VisaDataRow = {
            category,
            china_current: chinaDate,
            india_current: chinaDate, // Often same as China
            mexico_current: globalDate,
            philippines_current: globalDate,
            global_current: globalDate,
          };

          // Determine if this is action dates or filing dates based on table header
          const isFilingTable = html.indexOf('递件日期') > -1 && html.indexOf('递件日期') < tableMatch.index!;
          if (isFilingTable) {
            filingDates.push(dataRow);
          } else {
            actionDates.push(dataRow);
          }
        }
      }
    }
  }

  return { actionDates, filingDates };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate authorization - require service role key or a sync secret token
  const authHeader = req.headers.get('Authorization');
  const syncToken = req.headers.get('X-Sync-Token');
  const expectedSyncToken = Deno.env.get('SYNC_SECRET_TOKEN');
  const expectedAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const expectedServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  const bearerToken = authHeader?.replace('Bearer ', '');
  const isAuthorized =
    bearerToken === expectedServiceKey ||
    bearerToken === expectedAnonKey ||
    (expectedSyncToken && syncToken === expectedSyncToken);

  if (!isAuthorized) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('Starting visa data sync...');

    // Fetch data from external website
    const response = await fetch('https://visa.careerengine.us/');
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const html = await response.text();
    console.log('Fetched HTML data');

    // Extract visa data
    const { actionDates, filingDates } = extractVisaData(html);
    console.log(`Extracted ${actionDates.length} action dates, ${filingDates.length} filing dates`);

    // Update action dates table
    if (actionDates.length > 0) {
      // Clear existing data
      const { error: deleteError1 } = await supabase
        .from('green_card_priority_dates_action')
        .delete()
        .neq('id', 0);

      if (deleteError1) {
        console.error('Error clearing action dates:', deleteError1);
      }

      // Insert new data
      const { error: insertError1 } = await supabase
        .from('green_card_priority_dates_action')
        .insert(actionDates);

      if (insertError1) {
        console.error('Error inserting action dates:', insertError1);
        throw insertError1;
      }
    }

    // Update filing dates table
    if (filingDates.length > 0) {
      // Clear existing data
      const { error: deleteError2 } = await supabase
        .from('green_card_priority_dates_filing')
        .delete()
        .neq('id', 0);

      if (deleteError2) {
        console.error('Error clearing filing dates:', deleteError2);
      }

      // Insert new data
      const { error: insertError2 } = await supabase
        .from('green_card_priority_dates_filing')
        .insert(filingDates);

      if (insertError2) {
        console.error('Error inserting filing dates:', insertError2);
        throw insertError2;
      }
    }

    // Update sync metadata
    const { error: metaError } = await supabase
      .from('visa_sync_metadata')
      .upsert({
        id: 1,
        last_sync_at: new Date().toISOString(),
        sync_status: 'success',
        records_updated: actionDates.length + filingDates.length,
        source_url: 'https://visa.careerengine.us/'
      });

    if (metaError) {
      console.error('Error updating metadata:', metaError);
    }

    console.log('Visa data sync completed successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Visa data synchronized successfully',
      actionDatesCount: actionDates.length,
      filingDatesCount: filingDates.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sync-visa-data function:', error);

    // Update sync metadata with error
    await supabase
      .from('visa_sync_metadata')
      .upsert({
        id: 1,
        last_sync_at: new Date().toISOString(),
        sync_status: 'error',
        error_message: error.message,
        source_url: 'https://visa.careerengine.us/'
      });

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});