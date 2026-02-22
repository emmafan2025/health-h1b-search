
-- Drop existing table and recreate with new columns
DROP TABLE IF EXISTS green_card_perm_cases;

CREATE TABLE green_card_perm_cases (
    record_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    case_number TEXT,
    case_status TEXT,
    received_date DATE,
    decision_date DATE,
    occupation_type TEXT,
    emp_business_name TEXT,
    emp_addr1 TEXT,
    emp_addr2 TEXT,
    emp_city TEXT,
    emp_state TEXT,
    emp_postcode TEXT,
    emp_country TEXT,
    pwd_soc_code TEXT,
    pwd_soc_title TEXT,
    job_title TEXT,
    job_opp_wage_from NUMERIC,
    job_opp_wage_to NUMERIC,
    job_opp_wage_per TEXT,
    job_opp_wage_conditions TEXT,
    primary_worksite_type TEXT,
    primary_worksite_addr1 TEXT,
    primary_worksite_city TEXT,
    primary_worksite_state TEXT,
    primary_worksite_postal_code TEXT,
    primary_worksite_bls_area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE green_card_perm_cases ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to PERM cases"
ON green_card_perm_cases FOR SELECT
USING (true);

-- Indexes for search performance
CREATE INDEX idx_gc_emp_name ON green_card_perm_cases USING GIN (to_tsvector('english', emp_business_name));
CREATE INDEX idx_gc_job_title ON green_card_perm_cases USING GIN (to_tsvector('english', job_title));
CREATE INDEX idx_gc_state ON green_card_perm_cases (primary_worksite_state);
CREATE INDEX idx_gc_case_status ON green_card_perm_cases (case_status);
CREATE INDEX idx_gc_wage ON green_card_perm_cases (job_opp_wage_from);
