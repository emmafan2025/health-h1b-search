-- Update get_occupation_counts function to merge similar SOC codes and standardize formatting
CREATE OR REPLACE FUNCTION public.get_occupation_counts()
RETURNS TABLE(occupation text, soc_code text, case_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    WITH normalized_occupations AS (
        SELECT 
            -- Normalize SOC code by removing trailing .00 and similar patterns
            CASE 
                WHEN healthcare_h1b_cases."SOC_CODE" ~ '\.\d+\.0+$' THEN 
                    regexp_replace(healthcare_h1b_cases."SOC_CODE", '\.0+$', '')
                WHEN healthcare_h1b_cases."SOC_CODE" ~ '\.\d+$' THEN 
                    healthcare_h1b_cases."SOC_CODE"
                ELSE 
                    COALESCE(healthcare_h1b_cases."SOC_CODE", '')
            END as normalized_soc_code,
            -- Standardize occupation title format (First Letter Uppercase, rest lowercase)
            CASE 
                WHEN healthcare_h1b_cases."SOC_TITLE" IS NOT NULL THEN
                    initcap(lower(trim(healthcare_h1b_cases."SOC_TITLE")))
                ELSE 
                    'Unknown Occupation'
            END as formatted_title,
            healthcare_h1b_cases."SOC_TITLE" as original_title,
            healthcare_h1b_cases."SOC_CODE" as original_soc_code
        FROM healthcare_h1b_cases 
        WHERE healthcare_h1b_cases."SOC_TITLE" IS NOT NULL
    ),
    grouped_occupations AS (
        SELECT 
            normalized_soc_code,
            -- Choose the most common title for each SOC code group
            mode() WITHIN GROUP (ORDER BY formatted_title) as representative_title,
            COUNT(*) as total_cases,
            -- Get a list of all original titles to help with selection
            array_agg(DISTINCT formatted_title ORDER BY formatted_title) as all_titles
        FROM normalized_occupations
        GROUP BY normalized_soc_code
    )
    SELECT 
        go.representative_title::TEXT as occupation,
        go.normalized_soc_code::TEXT as soc_code,
        go.total_cases::BIGINT as case_count
    FROM grouped_occupations go
    WHERE go.normalized_soc_code IS NOT NULL 
    AND go.normalized_soc_code != ''
    ORDER BY go.total_cases DESC;
END;
$function$;

-- Also update the employer function to work with the new normalized occupation titles
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
        -- Need to match against the standardized occupation title
        IF filter_year IS NULL THEN
            -- No year filter
            RETURN QUERY
            SELECT 
                healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name,
                COUNT(*)::BIGINT as case_count
            FROM healthcare_h1b_cases
            WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL
              AND initcap(lower(trim(healthcare_h1b_cases."SOC_TITLE"))) = occupation_title
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
              AND initcap(lower(trim(healthcare_h1b_cases."SOC_TITLE"))) = occupation_title
              AND healthcare_h1b_cases."Year" = filter_year
            GROUP BY healthcare_h1b_cases."EMPLOYER_NAME"
            ORDER BY COUNT(*) DESC;
        END IF;
    END IF;
END;
$function$;