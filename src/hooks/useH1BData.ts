
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { H1BCase, SearchFilters } from '@/types/h1b';

export const useH1BData = () => {
  const [data, setData] = useState<H1BCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalEmployers, setTotalEmployers] = useState(0);
  const [totalStates, setTotalStates] = useState(0);
  const [averageSalary, setAverageSalary] = useState(0);
  const [totalOccupations, setTotalOccupations] = useState(0);

  const fetchStats = async () => {
    try {
      // Get total unique employers
      const { data: employersData, error: employersError } = await supabase
        .from('healthcare_h1b_cases')
        .select('EMPLOYER_NAME')
        .not('EMPLOYER_NAME', 'is', null);

      if (employersError) throw employersError;

      const uniqueEmployers = new Set(employersData.map(item => item.EMPLOYER_NAME)).size;
      setTotalEmployers(uniqueEmployers);

      // Get total unique states
      const { data: statesData, error: statesError } = await supabase
        .from('healthcare_h1b_cases')
        .select('WORKSITE_STATE')
        .not('WORKSITE_STATE', 'is', null);

      if (statesError) throw statesError;

      const uniqueStates = new Set(statesData.map(item => item.WORKSITE_STATE)).size;
      setTotalStates(uniqueStates);

      // Get total unique occupations (using SOC_TITLE for healthcare occupations)
      const { data: occupationsData, error: occupationsError } = await supabase
        .from('healthcare_h1b_cases')
        .select('SOC_TITLE')
        .not('SOC_TITLE', 'is', null);

      if (occupationsError) throw occupationsError;

      const uniqueOccupations = new Set(occupationsData.map(item => item.SOC_TITLE)).size;
      setTotalOccupations(uniqueOccupations);

    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchData = async (filters?: SearchFilters, page: number = 1, pageSize: number = 20, sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') => {
    try {
      setLoading(true);
      console.log('Fetching data with filters:', filters);
      
      // First, test basic connection without any filters
      if (!filters || Object.keys(filters).length === 0 || !filters.searchQuery) {
        console.log('Testing basic connection - fetching first 5 records...');
        
        // Test if table exists by trying a simple query
        console.log('Testing table existence and permissions...');
        
        const testQuery = await supabase
          .from('healthcare_h1b_cases')
          .select('*', { count: 'exact' })
          .limit(5);
        
        console.log('Basic connection test result:', {
          error: testQuery.error,
          count: testQuery.count,
          dataLength: testQuery.data?.length,
          sampleRecord: testQuery.data?.[0]
        });
        
        // Let's also try a different approach - check table structure
        if (testQuery.count === 0) {
          console.log('Table appears empty, checking table structure...');
          const structureQuery = await supabase
            .from('healthcare_h1b_cases')
            .select('*')
            .limit(0); // This will return no data but show if table exists
          
          console.log('Table structure check:', {
            error: structureQuery.error,
            statusText: structureQuery.statusText,
            status: structureQuery.status
          });
        }
        
        if (testQuery.error) {
          console.error('Basic connection failed:', testQuery.error);
          throw testQuery.error;
        }
      }
      
      // Start with a basic query - select all columns
      let queryBuilder = supabase
        .from('healthcare_h1b_cases')
        .select('*', { count: 'exact' });

      // Sanitize search input: limit length, remove SQL wildcards
      const sanitizeInput = (input: string): string => {
        let sanitized = input.trim().slice(0, 100);
        sanitized = sanitized.replace(/[%_\\]/g, '');
        return sanitized;
      };

      // Apply search filters - use proper OR query syntax
      if (filters?.searchQuery && filters.searchQuery.trim()) {
        const searchTerm = sanitizeInput(filters.searchQuery);
        if (searchTerm) {
          console.log(`Applying search filter for term: "${searchTerm}"`);
          queryBuilder = queryBuilder.or(`SOC_TITLE.ilike.%${searchTerm}%,EMPLOYER_NAME.ilike.%${searchTerm}%,JOB_TITLE.ilike.%${searchTerm}%`);
        }
      }

      // Apply location filter - use proper OR query syntax
      if (filters?.location && filters.location.trim()) {
        const locationTerm = sanitizeInput(filters.location);
        if (locationTerm) {
          queryBuilder = queryBuilder.or(`WORKSITE_CITY.ilike.%${locationTerm}%,WORKSITE_STATE.ilike.%${locationTerm}%`);
        }
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
        const jobTitleTerm = sanitizeInput(filters.jobTitle);
        if (jobTitleTerm) {
          queryBuilder = queryBuilder.ilike('JOB_TITLE', `%${jobTitleTerm}%`);
        }
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

      // Apply sorting
      let sortColumn = 'WAGE_RATE_OF_PAY_FROM'; // default to salary
      if (sortBy === 'wage_rate_of_pay_from') sortColumn = 'WAGE_RATE_OF_PAY_FROM';
      else if (sortBy === 'employer_name') sortColumn = 'EMPLOYER_NAME';
      else if (sortBy === 'year') sortColumn = 'Year';
      else if (sortBy === 'case_number') sortColumn = 'CASE_NUMBER';
      
      queryBuilder = queryBuilder.order(sortColumn, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      queryBuilder = queryBuilder.range(from, to);

      // Execute query with detailed logging
      console.log('About to execute query...');
      const { data: queryResult, error: queryError, count } = await queryBuilder;

      console.log('Query executed:', { 
        resultCount: queryResult?.length, 
        totalCount: count, 
        error: queryError,
        firstRecord: queryResult?.[0]
      });

      if (queryError) {
        console.error('Supabase query error:', queryError);
        throw queryError;
      }

      // Cast the data directly since field names now match
      const mappedData: H1BCase[] = (queryResult || []) as H1BCase[];
      
      console.log('Data mapped successfully:', { 
        mappedCount: mappedData.length,
        sampleRecord: mappedData[0]
      });
      
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
    console.log('useH1BData: Initial data fetch');
    fetchData();
    fetchStats();
  }, []);

  return {
    data,
    loading,
    error,
    totalCount,
    totalEmployers,
    totalStates,
    totalOccupations,
    refetch: fetchData
  };
};
