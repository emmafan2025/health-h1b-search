-- Remove the dangerous temporary insert policy that allows anonymous users to insert data
DROP POLICY IF EXISTS "Temp allow insert for data import" ON public.healthcare_h1b_cases;