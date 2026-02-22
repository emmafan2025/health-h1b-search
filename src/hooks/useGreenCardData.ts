import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GreenCardFilters {
  searchQuery?: string;
  employerName?: string;
  jobTitle?: string;
  state?: string;
  caseStatus?: string;
  minSalary?: number;
  maxSalary?: number;
}

export interface GreenCardCase {
  record_id: string;
  case_number: string | null;
  case_status: string | null;
  emp_business_name: string | null;
  emp_city: string | null;
  emp_state: string | null;
  job_title: string | null;
  pwd_soc_title: string | null;
  job_opp_wage_from: number | null;
  job_opp_wage_to: number | null;
  job_opp_wage_per: string | null;
  primary_worksite_city: string | null;
  primary_worksite_state: string | null;
  occupation_type: string | null;
  decision_date: string | null;
  received_date: string | null;
}

interface UseGreenCardDataReturn {
  data: GreenCardCase[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  search: (filters: GreenCardFilters, page: number, pageSize: number, sortBy: string, sortOrder: 'asc' | 'desc') => Promise<void>;
}

export const useGreenCardData = (): UseGreenCardDataReturn => {
  const [data, setData] = useState<GreenCardCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const search = useCallback(async (
    filters: GreenCardFilters,
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("green_card_perm_cases")
        .select("record_id, case_number, case_status, emp_business_name, emp_city, emp_state, job_title, pwd_soc_title, job_opp_wage_from, job_opp_wage_to, job_opp_wage_per, primary_worksite_city, primary_worksite_state, occupation_type, decision_date, received_date", { count: "exact" });

      const sq = filters.searchQuery?.trim();
      if (sq) {
        query = query.or(`emp_business_name.ilike.%${sq}%,job_title.ilike.%${sq}%,pwd_soc_title.ilike.%${sq}%`);
      }

      if (filters.employerName?.trim()) {
        query = query.ilike("emp_business_name", `%${filters.employerName.trim()}%`);
      }

      if (filters.jobTitle?.trim()) {
        query = query.ilike("job_title", `%${filters.jobTitle.trim()}%`);
      }

      if (filters.state) {
        query = query.eq("primary_worksite_state", filters.state);
      }

      if (filters.caseStatus) {
        query = query.eq("case_status", filters.caseStatus);
      }

      if (filters.minSalary) {
        query = query.gte("job_opp_wage_from", filters.minSalary);
      }

      if (filters.maxSalary) {
        query = query.lte("job_opp_wage_from", filters.maxSalary);
      }

      const sortColumn = sortBy === 'wage' ? 'job_opp_wage_from' : sortBy === 'employer' ? 'emp_business_name' : sortBy === 'date' ? 'decision_date' : 'job_opp_wage_from';
      query = query.order(sortColumn, { ascending: sortOrder === 'asc', nullsFirst: false });

      const from = (page - 1) * pageSize;
      query = query.range(from, from + pageSize - 1);

      const { data: results, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setData((results as GreenCardCase[]) || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, totalCount, search };
};
