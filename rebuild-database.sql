-- Drop existing table if it exists
DROP TABLE IF EXISTS healthcare_h1b_cases;

-- Create optimized table structure based on the CSV data
CREATE TABLE healthcare_h1b_cases (
    id BIGSERIAL PRIMARY KEY,
    case_number TEXT,
    job_title TEXT,
    soc_code TEXT,
    soc_title TEXT,
    full_time_position BOOLEAN,
    begin_date DATE,
    end_date DATE,
    employer_name TEXT,
    trade_name_dba TEXT,
    worksite_address1 TEXT,
    worksite_city TEXT,
    worksite_county TEXT,
    worksite_state TEXT,
    worksite_postal_code TEXT,
    wage_rate_of_pay_from DECIMAL(12,2),
    wage_rate_of_pay_to DECIMAL(12,2),
    wage_unit_of_pay TEXT,
    pw_wage_level TEXT,
    year INTEGER,
    quarter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX idx_employer_name ON healthcare_h1b_cases USING GIN (to_tsvector('english', employer_name));
CREATE INDEX idx_job_title ON healthcare_h1b_cases USING GIN (to_tsvector('english', job_title));
CREATE INDEX idx_soc_title ON healthcare_h1b_cases USING GIN (to_tsvector('english', soc_title));
CREATE INDEX idx_worksite_city ON healthcare_h1b_cases (worksite_city);
CREATE INDEX idx_worksite_state ON healthcare_h1b_cases (worksite_state);
CREATE INDEX idx_wage_from ON healthcare_h1b_cases (wage_rate_of_pay_from);
CREATE INDEX idx_year ON healthcare_h1b_cases (year);
CREATE INDEX idx_quarter ON healthcare_h1b_cases (quarter);

-- Create composite index for common searches
CREATE INDEX idx_location_search ON healthcare_h1b_cases (worksite_state, worksite_city);
CREATE INDEX idx_wage_range ON healthcare_h1b_cases (wage_rate_of_pay_from, wage_rate_of_pay_to);

-- Enable Row Level Security (we'll disable it for now to allow full access)
ALTER TABLE healthcare_h1b_cases ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can restrict this later)
CREATE POLICY "Allow all access" ON healthcare_h1b_cases
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true); 