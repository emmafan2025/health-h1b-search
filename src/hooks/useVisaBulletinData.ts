import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VisaBulletinRow {
  category: string;
  description: string;
  allCountries: string;
  china: string;
  india: string;
  mexico: string;
  philippines: string;
}

export interface VisaBulletinData {
  finalActionDates: VisaBulletinRow[];
  filingDates: VisaBulletinRow[];
}

interface SyncMetadata {
  last_sync_at: string | null;
  sync_status: string;
  records_updated: number;
  error_message: string | null;
  source_url: string | null;
}

const categoryDescriptions: { [key: string]: string } = {
  'EB-1': 'Priority Workers',
  'EB-2': 'Advanced Degree Professionals', 
  'EB-3': 'Skilled Workers',
  'EB-4': 'Special Immigrants',
  'EB-5': 'Investors',
  'Other Workers': 'Other Workers',
  'Certain Religious Workers': 'Certain Religious Workers'
};

export const useVisaBulletinData = () => {
  const [data, setData] = useState<VisaBulletinData | null>(null);
  const [syncMetadata, setSyncMetadata] = useState<SyncMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVisaBulletinData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch sync metadata
      const { data: metaData, error: metaError } = await supabase
        .from('visa_sync_metadata')
        .select('*')
        .eq('id', 1)
        .single();

      if (!metaError && metaData) {
        setSyncMetadata({
          last_sync_at: metaData.last_sync_at,
          sync_status: metaData.sync_status,
          records_updated: metaData.records_updated || 0,
          error_message: metaData.error_message,
          source_url: metaData.source_url
        });
      }
      
      // Fetch final action dates
      const { data: actionData, error: actionError } = await supabase
        .from('green_card_priority_dates_action')
        .select('*')
        .order('id');

      if (actionError) throw actionError;

      // Fetch filing dates
      const { data: filingData, error: filingError } = await supabase
        .from('green_card_priority_dates_filing')
        .select('*')
        .order('id');

      if (filingError) throw filingError;

      // Transform the data to match the component's expected format
      const transformData = (dbData: any[]): VisaBulletinRow[] => {
        console.log('Transforming data:', dbData);
        return dbData.map(row => {
          const transformedRow = {
            category: row.category || '',
            description: categoryDescriptions[row.category] || row.category || 'Unknown Category',
            allCountries: row.global_current || 'U',
            china: row.china_current || 'U',
            india: row.india_current || 'U',
            mexico: row.mexico_current || 'U',
            philippines: row.philippines_current || 'U'
          };
          console.log('Transformed row:', transformedRow);
          return transformedRow;
        });
      };

      const visaBulletinData: VisaBulletinData = {
        finalActionDates: transformData(actionData || []),
        filingDates: transformData(filingData || [])
      };

      console.log('Final visa bulletin data:', visaBulletinData);
      setData(visaBulletinData);
      setError(null);
    } catch (err) {
      console.error('Error fetching visa bulletin data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const manualSync = async () => {
    try {
      setSyncing(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('sync-visa-data');

      if (error) {
        throw new Error(`Sync failed: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Sync failed');
      }

      // Refresh data after successful sync
      await fetchVisaBulletinData();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchVisaBulletinData();
  }, []);

  return {
    data,
    syncMetadata,
    loading,
    syncing,
    error,
    refetch: fetchVisaBulletinData,
    manualSync
  };
};