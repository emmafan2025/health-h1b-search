
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
      
      // Start with a basic query - select all columns
      let queryBuilder = supabase
        .from('healthcare_h1b_cases')
        .select('*', { count: 'exact' });

      // Apply search filters
      if (filters?.searchQuery && filters.searchQuery.trim()) {
        const searchTerm = filters.searchQuery.trim();
        queryBuilder = queryBuilder.or(`"SOC_TITLE".ilike.%${searchTerm}%,"EMPLOYER_NAME".ilike.%${searchTerm}%`);
      }

      // Apply location filter
      if (filters?.location && filters.location.trim()) {
        const locationTerm = filters.location.trim();
        queryBuilder = queryBuilder.or(`"WORKSITE_CITY".ilike.%${locationTerm}%,"WORKSITE_STATE".ilike.%${locationTerm}%`);
      }

      // Apply salary range filters
      if (filters?.minSalary && filters?.maxSalary) {
        queryBuilder = queryBuilder
          .gte('WAGE_RATE_OF_PAY_FROM', filters.minSalary)
          .lte('WAGE_RATE_OF_PAY_FROM', filters.maxSalary);
      } else if (filters?.minSalary) {
        queryBuilder = queryBuilder.gte('WAGE_RATE_OF_PAY_FROM', filters.minSalary);
      } else if (filters?.maxSalary) {
        queryBuilder = queryBuilder.lte('WAGE_RATE_OF_PAY_FROM', filters.maxSalary);
      }

      // Apply job title filter
      if (filters?.jobTitle && filters.jobTitle.trim()) {
        queryBuilder = queryBuilder.ilike('JOB_TITLE', `%${filters.jobTitle}%`);
      }

      // Apply state filter
      if (filters?.state && filters.state.trim()) {
        queryBuilder = queryBuilder.eq('WORKSITE_STATE', filters.state);
      }

      // Apply year filter
      if (filters?.year) {
        queryBuilder = queryBuilder.eq('Year', filters.year);
      }

      // Apply quarter filter
      if (filters?.quarter && filters.quarter.trim()) {
        queryBuilder = queryBuilder.eq('Quarter', filters.quarter);
      }

      // Apply sorting with quoted column names
      let sortColumn = 'created_at'; // default
      if (sortBy === 'wage_rate_of_pay_from') sortColumn = 'WAGE_RATE_OF_PAY_FROM';
      else if (sortBy === 'employer_name') sortColumn = 'EMPLOYER_NAME';
      else if (sortBy === 'year') sortColumn = 'Year';
      
      queryBuilder = queryBuilder.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      queryBuilder = queryBuilder.range(from, to);

      // Execute query
      const { data: queryResult, error: queryError, count } = await queryBuilder;

      console.log('Query result:', { result: queryResult, error: queryError, count });

      if (queryError) {
        throw queryError;
      }

      // Use data directly since field names now match
      const mappedData: H1BCase[] = (queryResult || []) as H1BCase[];
      
      setData(mappedData);
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
