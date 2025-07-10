-- Update get_employers_by_occupation_with_counts function to support year filtering
CREATE OR REPLACE FUNCTION public.get_employers_by_occupation_with_counts(
    occupation_title text DEFAULT NULL::text,
    filter_year integer DEFAULT NULL::integer
)
RETURNS TABLE(employer_name text, case_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    -- If occupation_title is NULL, empty, or 'all', return all employers with optional year filter
    IF occupation_title IS NULL OR occupation_title = '' OR occupation_title = 'all' THEN
        IF filter_year IS NULL THEN
            -- No year filter
            RETURN QUERY
            SELECT 
                healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name,
                COUNT(*)::BIGINT as case_count
            FROM healthcare_h1b_cases
            WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL
            GROUP BY healthcare_h1b_cases."EMPLOYER_NAME"
            ORDER BY COUNT(*) DESC;
        ELSE
            -- With year filter
            RETURN QUERY
            SELECT 
                healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name,
                COUNT(*)::BIGINT as case_count
            FROM healthcare_h1b_cases
            WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL
              AND healthcare_h1b_cases."Year" = filter_year
            GROUP BY healthcare_h1b_cases."EMPLOYER_NAME"
            ORDER BY COUNT(*) DESC;
        END IF;
    ELSE
        -- Filter by specific occupation with optional year filter
        IF filter_year IS NULL THEN
            -- No year filter
            RETURN QUERY
            SELECT 
                healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name,
                COUNT(*)::BIGINT as case_count
            FROM healthcare_h1b_cases
            WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL
              AND healthcare_h1b_cases."SOC_TITLE" = occupation_title
            GROUP BY healthcare_h1b_cases."EMPLOYER_NAME"
            ORDER BY COUNT(*) DESC;
        ELSE
            -- With year filter
            RETURN QUERY
            SELECT 
                healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name,
                COUNT(*)::BIGINT as case_count
            FROM healthcare_h1b_cases
            WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL
              AND healthcare_h1b_cases."SOC_TITLE" = occupation_title
              AND healthcare_h1b_cases."Year" = filter_year
            GROUP BY healthcare_h1b_cases."EMPLOYER_NAME"
            ORDER BY COUNT(*) DESC;
        END IF;
    END IF;
END;
$function$;

-- Create function to get all available years
CREATE OR REPLACE FUNCTION public.get_available_years()
RETURNS TABLE(year integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT DISTINCT healthcare_h1b_cases."Year"::integer as year
    FROM healthcare_h1b_cases
    WHERE healthcare_h1b_cases."Year" IS NOT NULL
    ORDER BY year DESC;
END;
$function$;