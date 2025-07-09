-- Fix the get_state_counts function with correct column names
CREATE OR REPLACE FUNCTION public.get_state_counts()
RETURNS TABLE(
    state TEXT,
    case_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        healthcare_h1b_cases."WORKSITE_STATE"::TEXT as state,
        COUNT(*)::BIGINT as case_count
    FROM healthcare_h1b_cases 
    WHERE healthcare_h1b_cases."WORKSITE_STATE" IS NOT NULL
    GROUP BY healthcare_h1b_cases."WORKSITE_STATE"
    ORDER BY COUNT(*) DESC;
END;
$$;