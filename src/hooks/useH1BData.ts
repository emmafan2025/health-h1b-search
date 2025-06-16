
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
      
      // Build query step by step to avoid complex type inference
      let queryBuilder = supabase
        .from('healthcare_h1b_cases')
        .select('*', { count: 'exact' });

      // Apply search filters for soc_title and employer_name
      if (filters?.searchQuery && filters.searchQuery.trim()) {
        const searchTerm = filters.searchQuery.trim();
        queryBuilder = queryBuilder.or(`soc_title.ilike.%${searchTerm}%,employer_name.ilike.%${searchTerm}%`);
      }

      // Apply location filter
      if (filters?.location && filters.location.trim()) {
        const locationTerm = filters.location.trim();
        queryBuilder = queryBuilder.or(`worksite_city.ilike.%${locationTerm}%,worksite_state.ilike.%${locationTerm}%`);
      }

      // Apply salary range filters
      if (filters?.minSalary && filters?.maxSalary) {
        queryBuilder = queryBuilder
          .gte('wage_rate_of_pay_from', filters.minSalary)
          .lte('wage_rate_of_pay_from', filters.maxSalary);
      } else if (filters?.minSalary) {
        queryBuilder = queryBuilder.gte('wage_rate_of_pay_from', filters.minSalary);
      } else if (filters?.maxSalary) {
        queryBuilder = queryBuilder.lte('wage_rate_of_pay_from', filters.maxSalary);
      }

      // Apply job title filter
      if (filters?.jobTitle && filters.jobTitle.trim()) {
        queryBuilder = queryBuilder.ilike('job_title', `%${filters.jobTitle}%`);
      }

      // Apply state filter
      if (filters?.state && filters.state.trim()) {
        queryBuilder = queryBuilder.eq('worksite_state', filters.state);
      }

      // Apply year filter
      if (filters?.year) {
        queryBuilder = queryBuilder.eq('year', filters.year);
      }

      // Apply quarter filter
      if (filters?.quarter && filters.quarter.trim()) {
        queryBuilder = queryBuilder.eq('quarter', filters.quarter);
      }

      // Apply sorting
      const sortColumn = sortBy || 'created_at';
      queryBuilder = queryBuilder.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      queryBuilder = queryBuilder.range(from, to);

      // Execute query with type assertion
      const result = await queryBuilder;
      const { data: queryResult, error: queryError, count } = result;

      console.log('Query result:', { result: queryResult, error: queryError, count });

      if (queryError) {
        throw queryError;
      }

      // Type assertion to avoid complex type inference
      setData((queryResult as any[])?.map(item => ({
        id: item.id,
        case_number: item.case_number,
        employer_name: item.employer_name,
        job_title: item.job_title,
        soc_code: item.soc_code,
        soc_title: item.soc_title,
        full_time_position: item.full_time_position,
        begin_date: item.begin_date,
        end_date: item.end_date,
        worksite_address1: item.worksite_address1,
        worksite_city: item.worksite_city,
        worksite_county: item.worksite_county,
        worksite_state: item.worksite_state,
        worksite_postal_code: item.worksite_postal_code,
        wage_rate_of_pay_from: item.wage_rate_of_pay_from,
        wage_rate_of_pay_to: item.wage_rate_of_pay_to,
        wage_unit_of_pay: item.wage_unit_of_pay,
        pw_wage_level: item.pw_wage_level,
        year: item.year,
        quarter: item.quarter,
        trade_name_dba: item.trade_name_dba,
        created_at: item.created_at
      })) || []);
      
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
