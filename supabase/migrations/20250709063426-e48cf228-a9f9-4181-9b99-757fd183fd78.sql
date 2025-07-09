-- Fix the column name case mismatch in the function
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
            h.EMPLOYER_NAME::TEXT as employer_name,
            COUNT(*)::BIGINT as case_count
        FROM healthcare_h1b_cases h
        WHERE h.EMPLOYER_NAME IS NOT NULL
        GROUP BY h.EMPLOYER_NAME
        ORDER BY COUNT(*) DESC;
    ELSE
        -- Filter by specific occupation
        RETURN QUERY
        SELECT 
            h.EMPLOYER_NAME::TEXT as employer_name,
            COUNT(*)::BIGINT as case_count
        FROM healthcare_h1b_cases h
        WHERE h.EMPLOYER_NAME IS NOT NULL
          AND h.SOC_TITLE = occupation_title
        GROUP BY h.EMPLOYER_NAME
        ORDER BY COUNT(*) DESC;
    END IF;
END;
$$;