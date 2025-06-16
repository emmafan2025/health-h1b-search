
export interface H1BCase {
  id: number;
  CASE_NUMBER?: string;
  EMPLOYER_NAME?: string;
  JOB_TITLE?: string;
  SOC_CODE?: string;
  SOC_TITLE?: string;
  FULL_TIME_POSITION?: boolean;
  BEGIN_DATE?: string;
  END_DATE?: string;
  WORKSITE_ADDRESS1?: string;
  WORKSITE_CITY?: string;
  WORKSITE_COUNTY?: string;
  WORKSITE_STATE?: string;
  WORKSITE_POSTAL_CODE?: string;
  WAGE_RATE_OF_PAY_FROM?: number;
  WAGE_RATE_OF_PAY_TO?: number;
  WAGE_UNIT_OF_PAY?: string;
  PW_WAGE_LEVEL?: string;
  Year?: number;
  Quarter?: string;
  TRADE_NAME_DBA?: string;
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
