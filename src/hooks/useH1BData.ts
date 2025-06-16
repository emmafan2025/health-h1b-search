
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { H1BCase, SearchFilters } from '@/types/h1b';

export const useH1BData = () => {
  const [data, setData] = useState<H1BCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async (filters?: SearchFilters, page: number = 1, pageSize: number = 20, sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') => {
    try {
      setLoading(true);
      console.log('Fetching data with filters:', filters);
      
      let query = supabase
        .from('healthcare_h1b_cases')
        .select('*', { count: 'exact' });

      // Apply search filters for SOC_TITLE and EMPLOYER_NAME
      if (filters?.searchQuery && filters.searchQuery.trim()) {
        query = query.or(`SOC_TITLE.ilike.%${filters.searchQuery}%,EMPLOYER_NAME.ilike.%${filters.searchQuery}%`);
      }

      // Apply location filter
      if (filters?.location && filters.location.trim()) {
        query = query.or(`WORKSITE_CITY.ilike.%${filters.location}%,WORKSITE_STATE.ilike.%${filters.location}%`);
      }

      // Apply salary range filters
      if (filters?.minSalary && filters?.maxSalary) {
        query = query
          .gte('WAGE_RATE_OF_PAY_FROM', filters.minSalary)
          .lte('WAGE_RATE_OF_PAY_TO', filters.maxSalary);
      } else if (filters?.minSalary) {
        query = query.gte('WAGE_RATE_OF_PAY_FROM', filters.minSalary);
      } else if (filters?.maxSalary) {
        query = query.lte('WAGE_RATE_OF_PAY_TO', filters.maxSalary);
      }

      // Apply job title filter
      if (filters?.jobTitle && filters.jobTitle.trim()) {
        query = query.ilike('JOB_TITLE', `%${filters.jobTitle}%`);
      }

      // Apply state filter
      if (filters?.state && filters.state.trim()) {
        query = query.eq('WORKSITE_STATE', filters.state);
      }

      // Apply year filter
      if (filters?.year) {
        query = query.eq('Year', filters.year);
      }

      // Apply quarter filter
      if (filters?.quarter && filters.quarter.trim()) {
        query = query.eq('Quarter', filters.quarter);
      }

      // Apply sorting
      if (sortBy) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: result, error, count } = await query;

      console.log('Query result:', { result, error, count });

      if (error) {
        throw error;
      }

      setData(result || []);
      setTotalCount(count || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching H1B data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      setTotalCount(0);
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
    totalCount,
    refetch: fetchData
  };
};
