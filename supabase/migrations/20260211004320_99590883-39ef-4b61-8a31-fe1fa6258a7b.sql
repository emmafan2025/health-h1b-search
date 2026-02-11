
-- Fix SECURITY DEFINER functions: add SET search_path = public

CREATE OR REPLACE FUNCTION public.get_available_years()
 RETURNS TABLE(year integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    RETURN QUERY
    SELECT DISTINCT healthcare_h1b_cases."Year"::integer as year
    FROM healthcare_h1b_cases
    WHERE healthcare_h1b_cases."Year" IS NOT NULL
    ORDER BY year DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_employers_by_occupation_with_counts(occupation_title text DEFAULT NULL::text, filter_year integer DEFAULT NULL::integer)
 RETURNS TABLE(employer_name text, case_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    IF occupation_title IS NULL OR occupation_title = '' OR occupation_title = 'all' THEN
        IF filter_year IS NULL THEN
            RETURN QUERY
            SELECT healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name, COUNT(*)::BIGINT as case_count
            FROM healthcare_h1b_cases WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL
            GROUP BY healthcare_h1b_cases."EMPLOYER_NAME" ORDER BY COUNT(*) DESC;
        ELSE
            RETURN QUERY
            SELECT healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name, COUNT(*)::BIGINT as case_count
            FROM healthcare_h1b_cases WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL AND healthcare_h1b_cases."Year" = filter_year
            GROUP BY healthcare_h1b_cases."EMPLOYER_NAME" ORDER BY COUNT(*) DESC;
        END IF;
    ELSE
        IF filter_year IS NULL THEN
            RETURN QUERY
            SELECT healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name, COUNT(*)::BIGINT as case_count
            FROM healthcare_h1b_cases WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL
              AND initcap(lower(trim(healthcare_h1b_cases."SOC_TITLE"))) = occupation_title
            GROUP BY healthcare_h1b_cases."EMPLOYER_NAME" ORDER BY COUNT(*) DESC;
        ELSE
            RETURN QUERY
            SELECT healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name, COUNT(*)::BIGINT as case_count
            FROM healthcare_h1b_cases WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL
              AND initcap(lower(trim(healthcare_h1b_cases."SOC_TITLE"))) = occupation_title
              AND healthcare_h1b_cases."Year" = filter_year
            GROUP BY healthcare_h1b_cases."EMPLOYER_NAME" ORDER BY COUNT(*) DESC;
        END IF;
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_employers_by_occupation_with_counts(occupation_title text DEFAULT NULL::text)
 RETURNS TABLE(employer_name text, case_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    IF occupation_title IS NULL OR occupation_title = '' OR occupation_title = 'all' THEN
        RETURN QUERY
        SELECT healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name, COUNT(*)::BIGINT as case_count
        FROM healthcare_h1b_cases WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL
        GROUP BY healthcare_h1b_cases."EMPLOYER_NAME" ORDER BY COUNT(*) DESC;
    ELSE
        RETURN QUERY
        SELECT healthcare_h1b_cases."EMPLOYER_NAME"::TEXT as employer_name, COUNT(*)::BIGINT as case_count
        FROM healthcare_h1b_cases WHERE healthcare_h1b_cases."EMPLOYER_NAME" IS NOT NULL
          AND healthcare_h1b_cases."SOC_TITLE" = occupation_title
        GROUP BY healthcare_h1b_cases."EMPLOYER_NAME" ORDER BY COUNT(*) DESC;
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_occupation_counts()
 RETURNS TABLE(occupation text, soc_code text, case_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    RETURN QUERY
    WITH normalized_occupations AS (
        SELECT 
            CASE 
                WHEN healthcare_h1b_cases."SOC_CODE" ~ '\.0+$' THEN 
                    regexp_replace(healthcare_h1b_cases."SOC_CODE", '\.0+$', '')
                ELSE 
                    COALESCE(healthcare_h1b_cases."SOC_CODE", '')
            END as normalized_soc_code,
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
    soc_grouped_occupations AS (
        SELECT 
            normalized_soc_code,
            mode() WITHIN GROUP (ORDER BY formatted_title) as representative_title,
            COUNT(*) as soc_cases
        FROM normalized_occupations
        WHERE normalized_soc_code IS NOT NULL AND normalized_soc_code != ''
        GROUP BY normalized_soc_code
    ),
    final_grouped_occupations AS (
        SELECT 
            representative_title,
            mode() WITHIN GROUP (ORDER BY normalized_soc_code) as main_soc_code,
            SUM(soc_cases) as total_cases
        FROM soc_grouped_occupations
        GROUP BY representative_title
    )
    SELECT 
        fgo.representative_title::TEXT as occupation,
        fgo.main_soc_code::TEXT as soc_code,
        fgo.total_cases::BIGINT as case_count
    FROM final_grouped_occupations fgo
    ORDER BY fgo.total_cases DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_state_counts()
 RETURNS TABLE(state text, case_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_forum_posts_with_reply_counts()
 RETURNS TABLE(id uuid, title text, content text, author_name text, category text, views integer, created_at timestamp with time zone, updated_at timestamp with time zone, reply_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    fp.id, fp.title, fp.content, fp.author_name, fp.category, fp.views,
    fp.created_at, fp.updated_at,
    COALESCE(COUNT(fr.id), 0) as reply_count
  FROM public.forum_posts fp
  LEFT JOIN public.forum_replies fr ON fp.id = fr.post_id
  GROUP BY fp.id, fp.title, fp.content, fp.author_name, fp.category, fp.views, fp.created_at, fp.updated_at
  ORDER BY fp.updated_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id, 
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'User_' || substring(NEW.id::text from 1 for 8)
    ),
    NEW.email
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_employer_counts()
 RETURNS TABLE(employer_name text, case_count bigint)
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    EMPLOYER_NAME::TEXT as employer_name,
    COUNT(*)::BIGINT as case_count
  FROM healthcare_h1b_cases 
  WHERE EMPLOYER_NAME IS NOT NULL
  GROUP BY EMPLOYER_NAME
  ORDER BY COUNT(*) DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_change_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.change_status := (NEW.current_month - NEW.last_month) || ' days'; 
  RETURN NEW;
END;
$function$;
