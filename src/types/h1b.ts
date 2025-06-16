
export interface H1BCase {
  id: number;
  case_number?: string;
  employer_name?: string;
  job_title?: string;
  soc_code?: string;
  soc_title?: string;
  full_time_position?: boolean;
  begin_date?: string;
  end_date?: string;
  worksite_address1?: string;
  worksite_city?: string;
  worksite_county?: string;
  worksite_state?: string;
  worksite_postal_code?: string;
  wage_rate_of_pay_from?: number;
  wage_rate_of_pay_to?: number;
  wage_unit_of_pay?: string;
  pw_wage_level?: string;
  year?: number;
  quarter?: string;
  trade_name_dba?: string;
  created_at: string;
}

export interface SearchFilters {
  employerType?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  caseStatus?: string;
  searchQuery?: string;
  jobTitle?: string;
  state?: string;
  year?: number;
  quarter?: string;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
