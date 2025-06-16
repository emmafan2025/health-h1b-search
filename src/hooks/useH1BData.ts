
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
      
      // Start with base query
      const baseQuery = supabase
        .from('healthcare_h1b_cases')
        .select('*', { count: 'exact' });

      let query = baseQuery;

      // Apply search filters for soc_title and employer_name
      if (filters?.searchQuery && filters.searchQuery.trim()) {
        const searchTerm = filters.searchQuery.trim();
        query = query.or(`soc_title.ilike.%${searchTerm}%,employer_name.ilike.%${searchTerm}%`);
      }

      // Apply location filter
      if (filters?.location && filters.location.trim()) {
        const locationTerm = filters.location.trim();
        query = query.or(`worksite_city.ilike.%${locationTerm}%,worksite_state.ilike.%${locationTerm}%`);
      }

      // Apply salary range filters
      if (filters?.minSalary && filters?.maxSalary) {
        query = query
          .gte('wage_rate_of_pay_from', filters.minSalary)
          .lte('wage_rate_of_pay_from', filters.maxSalary);
      } else if (filters?.minSalary) {
        query = query.gte('wage_rate_of_pay_from', filters.minSalary);
      } else if (filters?.maxSalary) {
        query = query.lte('wage_rate_of_pay_from', filters.maxSalary);
      }

      // Apply job title filter
      if (filters?.jobTitle && filters.jobTitle.trim()) {
        query = query.ilike('job_title', `%${filters.jobTitle}%`);
      }

      // Apply state filter
      if (filters?.state && filters.state.trim()) {
        query = query.eq('worksite_state', filters.state);
      }

      // Apply year filter
      if (filters?.year) {
        query = query.eq('year', filters.year);
      }

      // Apply quarter filter
      if (filters?.quarter && filters.quarter.trim()) {
        query = query.eq('quarter', filters.quarter);
      }

      // Apply sorting
      const sortColumn = sortBy || 'created_at';
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data: result, error: queryError, count } = await query;

      console.log('Query result:', { result, error: queryError, count });

      if (queryError) {
        throw queryError;
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
