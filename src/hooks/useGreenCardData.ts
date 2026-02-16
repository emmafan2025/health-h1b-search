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
  minimumEducation?: string;
}

export interface GreenCardCase {
  record_id: string;
  case_number: string | null;
  case_status: string | null;
  employer_name: string | null;
  employer_city: string | null;
  employer_state_province: string | null;
  job_title: string | null;
  pw_soc_title: string | null;
  pw_wage: number | null;
  pw_unit_of_pay: string | null;
  wage_offer_from: number | null;
  wage_offer_to: number | null;
  wage_offer_unit_of_pay: string | null;
  worksite_city: string | null;
  worksite_state: string | null;
  minimum_education: string | null;
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
        .select("record_id, case_number, case_status, employer_name, employer_city, employer_state_province, job_title, pw_soc_title, pw_wage, pw_unit_of_pay, wage_offer_from, wage_offer_to, wage_offer_unit_of_pay, worksite_city, worksite_state, minimum_education, decision_date, received_date", { count: "exact" });

      // Apply filters
      const sq = filters.searchQuery?.trim();
      if (sq) {
        query = query.or(`employer_name.ilike.%${sq}%,job_title.ilike.%${sq}%,pw_soc_title.ilike.%${sq}%`);
      }

      if (filters.employerName?.trim()) {
        query = query.ilike("employer_name", `%${filters.employerName.trim()}%`);
      }

      if (filters.jobTitle?.trim()) {
        query = query.ilike("job_title", `%${filters.jobTitle.trim()}%`);
      }

      if (filters.state) {
        query = query.eq("worksite_state", filters.state);
      }

      if (filters.caseStatus) {
        query = query.eq("case_status", filters.caseStatus);
      }

      if (filters.minSalary) {
        query = query.gte("wage_offer_from", filters.minSalary);
      }

      if (filters.maxSalary) {
        query = query.lte("wage_offer_from", filters.maxSalary);
      }

      if (filters.minimumEducation) {
        query = query.eq("minimum_education", filters.minimumEducation);
      }

      // Sorting
      const sortColumn = sortBy === 'wage' ? 'wage_offer_from' : sortBy === 'employer' ? 'employer_name' : sortBy === 'date' ? 'decision_date' : 'wage_offer_from';
      query = query.order(sortColumn, { ascending: sortOrder === 'asc', nullsFirst: false });

      // Pagination
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
