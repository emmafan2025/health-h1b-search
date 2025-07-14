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

const categoryDescriptions: { [key: string]: string } = {
  'EB-1': 'Priority Workers',
  'EB-2': 'Advanced Degree Professionals',
  'EB-3': 'Skilled Workers',
  'EB-4': 'Special Immigrants',
  'EB-5': 'Investors'
};

export const useVisaBulletinData = () => {
  const [data, setData] = useState<VisaBulletinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisaBulletinData = async () => {
    try {
      setLoading(true);
      
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
        return dbData.map(row => ({
          category: row.category || '',
          description: categoryDescriptions[row.category] || '',
          allCountries: row.global_current || 'U',
          china: row.china_current || 'U',
          india: row.india_current || 'U',
          mexico: row.mexico_current || 'U',
          philippines: row.philippines_current || 'U'
        }));
      };

      const visaBulletinData: VisaBulletinData = {
        finalActionDates: transformData(actionData || []),
        filingDates: transformData(filingData || [])
      };

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

  useEffect(() => {
    fetchVisaBulletinData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchVisaBulletinData
  };
};