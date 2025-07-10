-- Fix get_occupation_counts function to properly merge SOC codes like 29-1011 and 29-1011.00
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
                WHEN healthcare_h1b_cases."SOC_CODE" ~ '\.0+$' THEN 
                    regexp_replace(healthcare_h1b_cases."SOC_CODE", '\.0+$', '')
                ELSE 
                    COALESCE(healthcare_h1b_cases."SOC_CODE", '')
            END as normalized_soc_code,
            -- Standardize occupation title format (First Letter Uppercase, rest lowercase)
            CASE 
                WHEN healthcare_h1b_cases."SOC_TITLE" IS NOT NULL THEN
                    initcap(lower(trim(healthcare_h1b_cases."SOC_TITLE")))
                ELSE 
                    'Unknown Occupation'
            END as formatted_title
        FROM healthcare_h1b_cases 
        WHERE healthcare_h1b_cases."SOC_TITLE" IS NOT NULL
          AND healthcare_h1b_cases."SOC_CODE" IS NOT NULL
    ),
    grouped_occupations AS (
        SELECT 
            normalized_soc_code,
            -- Choose the most common title for each SOC code group
            mode() WITHIN GROUP (ORDER BY formatted_title) as representative_title,
            COUNT(*) as total_cases
        FROM normalized_occupations
        WHERE normalized_soc_code IS NOT NULL 
        AND normalized_soc_code != ''
        GROUP BY normalized_soc_code
    )
    SELECT 
        go.representative_title::TEXT as occupation,
        go.normalized_soc_code::TEXT as soc_code,
        go.total_cases::BIGINT as case_count
    FROM grouped_occupations go
    ORDER BY go.total_cases DESC;
END;
$function$;