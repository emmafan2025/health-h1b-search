-- Fix the get_occupation_counts function with correct column names
CREATE OR REPLACE FUNCTION public.get_occupation_counts()
RETURNS TABLE(
    occupation TEXT,
    soc_code TEXT,
    case_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        healthcare_h1b_cases."SOC_TITLE"::TEXT as occupation,
        COALESCE(healthcare_h1b_cases."SOC_CODE", '')::TEXT as soc_code,
        COUNT(*)::BIGINT as case_count
    FROM healthcare_h1b_cases 
    WHERE healthcare_h1b_cases."SOC_TITLE" IS NOT NULL
    GROUP BY healthcare_h1b_cases."SOC_TITLE", healthcare_h1b_cases."SOC_CODE"
    ORDER BY COUNT(*) DESC;
END;
$$;