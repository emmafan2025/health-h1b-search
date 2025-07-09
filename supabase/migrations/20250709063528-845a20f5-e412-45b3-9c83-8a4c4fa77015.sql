-- Drop the existing function first to ensure clean recreation
DROP FUNCTION IF EXISTS public.get_employers_by_occupation_with_counts(TEXT);

-- Recreate the function with correct column references
CREATE OR REPLACE FUNCTION public.get_employers_by_occupation_with_counts(
    occupation_title TEXT DEFAULT NULL
)
RETURNS TABLE(
    employer_name TEXT,
    case_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- If occupation_title is NULL, empty, or 'all', return all employers
    IF occupation_title IS NULL OR occupation_title = '' OR occupation_title = 'all' THEN
        RETURN QUERY
        SELECT 
            healthcare_h1b_cases.EMPLOYER_NAME::TEXT as employer_name,
            COUNT(*)::BIGINT as case_count
        FROM healthcare_h1b_cases
        WHERE healthcare_h1b_cases.EMPLOYER_NAME IS NOT NULL
        GROUP BY healthcare_h1b_cases.EMPLOYER_NAME
        ORDER BY COUNT(*) DESC;
    ELSE
        -- Filter by specific occupation
        RETURN QUERY
        SELECT 
            healthcare_h1b_cases.EMPLOYER_NAME::TEXT as employer_name,
            COUNT(*)::BIGINT as case_count
        FROM healthcare_h1b_cases
        WHERE healthcare_h1b_cases.EMPLOYER_NAME IS NOT NULL
          AND healthcare_h1b_cases.SOC_TITLE = occupation_title
        GROUP BY healthcare_h1b_cases.EMPLOYER_NAME
        ORDER BY COUNT(*) DESC;
    END IF;
END;
$$;