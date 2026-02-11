
-- Drop existing table and recreate with fewer columns
DROP TABLE IF EXISTS public.green_card_perm_cases;

CREATE TABLE public.green_card_perm_cases (
  record_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_number TEXT,
  case_status TEXT,
  received_date DATE,
  decision_date DATE,
  employer_name TEXT,
  employer_address_1 TEXT,
  employer_address_2 TEXT,
  employer_city TEXT,
  employer_state_province TEXT,
  employer_country TEXT,
  employer_postal_code TEXT,
  employer_phone TEXT,
  employer_phone_ext TEXT,
  employer_num_employees INTEGER,
  emp_year_commenced_business INTEGER,
  pw_track_number TEXT,
  pw_soc_code TEXT,
  pw_soc_title TEXT,
  pw_skill_level TEXT,
  pw_wage NUMERIC,
  pw_unit_of_pay TEXT,
  pw_wage_source TEXT,
  pw_determination_date DATE,
  pw_expiration_date DATE,
  wage_offer_from NUMERIC,
  wage_offer_to NUMERIC,
  wage_offer_unit_of_pay TEXT,
  worksite_address_1 TEXT,
  worksite_address_2 TEXT,
  worksite_city TEXT,
  worksite_state TEXT,
  worksite_postal_code TEXT,
  job_title TEXT,
  minimum_education TEXT,
  specific_skills TEXT,
  swa_job_order_start_date DATE,
  swa_job_order_end_date DATE,
  sunday_edition_newspaper TEXT,
  first_newspaper_name TEXT,
  first_advertisement_start_date DATE,
  second_newspaper_ad_name TEXT,
  second_advertisement_type TEXT,
  second_ad_start_date DATE,
  foreign_worker_ed_inst_country TEXT,
  foreign_worker_ed_inst_post_cd TEXT,
  foreign_worker_training_comp TEXT,
  foreign_worker_req_experience TEXT,
  foreign_worker_alt_ed_exp TEXT,
  foreign_worker_alt_occ_exp TEXT,
  foreign_worker_exp_with_empl TEXT,
  foreign_worker_empl_pay_for_ed TEXT,
  foreign_worker_curr_employed TEXT,
  employer_completed_application TEXT,
  preparer_name TEXT,
  preparer_title TEXT,
  preparer_email TEXT,
  emp_info_decl_name TEXT,
  emp_decl_title TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.green_card_perm_cases ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to PERM cases"
  ON public.green_card_perm_cases FOR SELECT USING (true);

-- Indexes for search
CREATE INDEX idx_perm_employer_name ON public.green_card_perm_cases USING gin (to_tsvector('english', COALESCE(employer_name, '')));
CREATE INDEX idx_perm_job_title ON public.green_card_perm_cases USING gin (to_tsvector('english', COALESCE(job_title, '')));
CREATE INDEX idx_perm_worksite_state ON public.green_card_perm_cases (worksite_state);
CREATE INDEX idx_perm_case_status ON public.green_card_perm_cases (case_status);
CREATE INDEX idx_perm_pw_soc_title ON public.green_card_perm_cases USING gin (to_tsvector('english', COALESCE(pw_soc_title, '')));
CREATE INDEX idx_perm_wage ON public.green_card_perm_cases (wage_offer_from);
