
-- Add employer_type column (nullable, won't break CSV imports)
ALTER TABLE public.healthcare_h1b_cases 
ADD COLUMN IF NOT EXISTS employer_type TEXT;

-- Create classification function
CREATE OR REPLACE FUNCTION public.classify_employer_type()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.employer_type := CASE
    WHEN NEW."EMPLOYER_NAME" ILIKE '%university%' OR NEW."EMPLOYER_NAME" ILIKE '%college%' THEN 'University/Academic'
    WHEN NEW."EMPLOYER_NAME" ILIKE '%veteran%' OR NEW."EMPLOYER_NAME" ILIKE '%v.a.%' THEN 'Government/VA'
    WHEN NEW."EMPLOYER_NAME" ILIKE '%county%' OR NEW."EMPLOYER_NAME" ILIKE '%state of%' OR NEW."EMPLOYER_NAME" ILIKE '%government%' THEN 'Government'
    WHEN NEW."EMPLOYER_NAME" ILIKE '%hospital%' OR NEW."EMPLOYER_NAME" ILIKE '%medical center%' THEN 'Hospital/Medical Center'
    WHEN NEW."EMPLOYER_NAME" ILIKE '%health system%' OR NEW."EMPLOYER_NAME" ILIKE '%healthcare system%' THEN 'Health System'
    WHEN NEW."EMPLOYER_NAME" ILIKE '%clinic%' AND NEW."EMPLOYER_NAME" NOT ILIKE '%clinical%' THEN 'Clinic'
    WHEN NEW."EMPLOYER_NAME" ILIKE '%staffing%' OR NEW."EMPLOYER_NAME" ILIKE '%consulting%' THEN 'Staffing/Consulting'
    WHEN NEW."EMPLOYER_NAME" ILIKE '% inc%' OR NEW."EMPLOYER_NAME" ILIKE '% llc%' OR NEW."EMPLOYER_NAME" ILIKE '% corp%' OR NEW."EMPLOYER_NAME" ILIKE '% ltd%' THEN 'For-Profit'
    WHEN NEW."EMPLOYER_NAME" ILIKE '%foundation%' OR NEW."EMPLOYER_NAME" ILIKE '%association%' THEN 'Non-Profit'
    ELSE 'Other'
  END;
  RETURN NEW;
END;
$$;

-- Create trigger for new inserts
CREATE TRIGGER classify_employer_on_insert
BEFORE INSERT ON public.healthcare_h1b_cases
FOR EACH ROW
EXECUTE FUNCTION public.classify_employer_type();

-- Also trigger on update of EMPLOYER_NAME
CREATE TRIGGER classify_employer_on_update
BEFORE UPDATE OF "EMPLOYER_NAME" ON public.healthcare_h1b_cases
FOR EACH ROW
EXECUTE FUNCTION public.classify_employer_type();

-- Backfill existing records
UPDATE public.healthcare_h1b_cases SET employer_type = CASE
  WHEN "EMPLOYER_NAME" ILIKE '%university%' OR "EMPLOYER_NAME" ILIKE '%college%' THEN 'University/Academic'
  WHEN "EMPLOYER_NAME" ILIKE '%veteran%' OR "EMPLOYER_NAME" ILIKE '%v.a.%' THEN 'Government/VA'
  WHEN "EMPLOYER_NAME" ILIKE '%county%' OR "EMPLOYER_NAME" ILIKE '%state of%' OR "EMPLOYER_NAME" ILIKE '%government%' THEN 'Government'
  WHEN "EMPLOYER_NAME" ILIKE '%hospital%' OR "EMPLOYER_NAME" ILIKE '%medical center%' THEN 'Hospital/Medical Center'
  WHEN "EMPLOYER_NAME" ILIKE '%health system%' OR "EMPLOYER_NAME" ILIKE '%healthcare system%' THEN 'Health System'
  WHEN "EMPLOYER_NAME" ILIKE '%clinic%' AND "EMPLOYER_NAME" NOT ILIKE '%clinical%' THEN 'Clinic'
  WHEN "EMPLOYER_NAME" ILIKE '%staffing%' OR "EMPLOYER_NAME" ILIKE '%consulting%' THEN 'Staffing/Consulting'
  WHEN "EMPLOYER_NAME" ILIKE '% inc%' OR "EMPLOYER_NAME" ILIKE '% llc%' OR "EMPLOYER_NAME" ILIKE '% corp%' OR "EMPLOYER_NAME" ILIKE '% ltd%' THEN 'For-Profit'
  WHEN "EMPLOYER_NAME" ILIKE '%foundation%' OR "EMPLOYER_NAME" ILIKE '%association%' THEN 'Non-Profit'
  ELSE 'Other'
END;
