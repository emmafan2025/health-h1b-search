
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { H1BCase, SearchFilters } from '@/types/h1b';

export const useH1BData = () => {
  const [data, setData] = useState<H1BCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (filters?: SearchFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('healthcare_h1b_cases')
        .select('*');

      // Apply filters if provided
      if (filters?.searchQuery) {
        query = query.or(`EMPLOYER_NAME.ilike.%${filters.searchQuery}%,JOB_TITLE.ilike.%${filters.searchQuery}%,WORKSITE_CITY.ilike.%${filters.searchQuery}%,WORKSITE_STATE.ilike.%${filters.searchQuery}%`);
      }

      if (filters?.location) {
        query = query.or(`WORKSITE_CITY.ilike.%${filters.location}%,WORKSITE_STATE.ilike.%${filters.location}%`);
      }

      if (filters?.minSalary && filters?.maxSalary) {
        query = query
          .gte('WAGE_RATE_OF_PAY_FROM', filters.minSalary)
          .lte('WAGE_RATE_OF_PAY_TO', filters.maxSalary);
      } else if (filters?.minSalary) {
        query = query.gte('WAGE_RATE_OF_PAY_FROM', filters.minSalary);
      } else if (filters?.maxSalary) {
        query = query.lte('WAGE_RATE_OF_PAY_TO', filters.maxSalary);
      }

      // Limit results for performance
      query = query.limit(100);

      const { data: result, error } = await query;

      if (error) {
        throw error;
      }

      setData(result || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching H1B data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
