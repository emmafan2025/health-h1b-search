
// 类型：一条 H1B case 记录（简化版，避免 TS 类型深度错误）
export type H1BCase = {
  id?: number;
  case_number: string;
  employer_name: string;
  job_title: string;
  soc_code: string;
  soc_title: string;
  full_time_position: boolean | string; // 可为 'Y'/'N' 或 true/false
  begin_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  worksite_address1: string;
  worksite_city: string;
  worksite_county: string;
  worksite_state: string;
  worksite_postal_code: string;
  wage_rate_of_pay_from: number;
  wage_rate_of_pay_to?: number | null;
  wage_unit_of_pay: string;
  pw_wage_level: string;
  year: number;
  quarter: string;
  trade_name_dba?: string;
  created_at?: string; // ISO 格式时间戳，可用于排序
};

// 类型：用户在搜索引擎中使用的过滤器
export type SearchFilters = {
  searchQuery?: string;     // 用户输入的关键词（查 employer_name / soc_title）
  jobTitle?: string;        // 精确或模糊匹配的 job title
  location?: string;        // 城市或州
  state?: string;           // 州缩写
  year?: number;            // 年份（如 2023）
  quarter?: string;         // 季度（如 Q1/Q2/Q3/Q4）
  minSalary?: number;       // 最低工资
  maxSalary?: number;       // 最高工资
};

