import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface EmployerData {
  employer_name: string;
  case_count: number;
}

// Top healthcare occupations based on H1B case volume
const TOP_OCCUPATIONS = [
  { value: "all", label: "All Occupations", title: "Physicians and Surgeons, All Other" },
  { value: "physicians-surgeons", label: "Physicians & Surgeons", title: "Physicians and Surgeons, All Other" },
  { value: "lab-technologists", label: "Lab Technologists", title: "Medical and Clinical Laboratory Technologists" },
  { value: "physical-therapists", label: "Physical Therapists", title: "Physical Therapists" },
  { value: "physicians-all", label: "Physicians (All)", title: "Physicians, All Other" },
  { value: "registered-nurses", label: "Registered Nurses", title: "Registered Nurses" },
  { value: "dentists", label: "Dentists", title: "Dentists, General" },
  { value: "internists", label: "Internists", title: "Internists, General" },
];

const HealthcareEmployers = () => {
  const [employers, setEmployers] = useState<EmployerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [totalCases, setTotalCases] = useState(0);

  useEffect(() => {
    fetchEmployers(activeTab);
  }, [activeTab]);

  const fetchEmployers = async (occupation: string) => {
    try {
      setLoading(true);
      console.log('Fetching healthcare employers for occupation:', occupation);
      
      let query = supabase
        .from('healthcare_h1b_cases')
        .select('EMPLOYER_NAME, SOC_TITLE')
        .not('EMPLOYER_NAME', 'is', null);

      // Filter by occupation if not "all"
      if (occupation !== "all") {
        const selectedOccupation = TOP_OCCUPATIONS.find(occ => occ.value === occupation);
        if (selectedOccupation) {
          query = query.eq('SOC_TITLE', selectedOccupation.title);
        }
      }
      
      const { data: caseData, error } = await query;
      
      console.log('Query result:', { dataLength: caseData?.length, error, occupation });
      
      if (error) throw error;
      
      if (!caseData || caseData.length === 0) {
        console.log('No healthcare cases found for occupation:', occupation);
        setEmployers([]);
        setTotalCases(0);
        setError(null);
        return;
      }

      // Count cases per employer
      const employerCounts = caseData.reduce((acc, item) => {
        const employer = item.EMPLOYER_NAME;
        if (employer) {
          acc[employer] = (acc[employer] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      console.log('Employer counts:', Object.keys(employerCounts).length, 'unique employers');

      // Convert to array and sort by case count
      const sortedEmployers = Object.entries(employerCounts)
        .map(([employer_name, case_count]) => ({ employer_name, case_count }))
        .sort((a, b) => b.case_count - a.case_count);

      console.log('Top 5 employers:', sortedEmployers.slice(0, 5));
      setEmployers(sortedEmployers);
      setTotalCases(caseData.length);
      setError(null);
    } catch (err) {
      console.error('Error fetching employers:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading healthcare employers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load data: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Healthcare Employers by Occupation</h1>
              <p className="text-gray-600">Top employers ranked by H1B sponsorship volume per occupation</p>
            </div>
          </div>
        </div>

        {/* Occupation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
            {TOP_OCCUPATIONS.map((occupation) => (
              <TabsTrigger key={occupation.value} value={occupation.value} className="text-xs">
                {occupation.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TOP_OCCUPATIONS.map((occupation) => (
            <TabsContent key={occupation.value} value={occupation.value}>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-blue-800">
                  {occupation.label} - Top Employers
                </h2>
                <p className="text-gray-600">
                  {employers.length} employers found ({totalCases.toLocaleString()} total cases)
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading employers...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">Failed to load data: {error}</p>
                  <Button onClick={() => fetchEmployers(activeTab)}>Retry</Button>
                </div>
              )}

              {/* Employers List */}
              {!loading && !error && (
                <div className="grid gap-4">
                  {employers.map((employer, index) => (
                    <Card key={employer.employer_name} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                              <span className="text-blue-800 font-bold text-lg">#{index + 1}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {employer.employer_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {occupation.label === "All Occupations" ? "Healthcare Employer" : occupation.label}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-lg px-3 py-1">
                            {employer.case_count.toLocaleString()} cases
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && employers.length === 0 && (
                <Card className="text-center p-8">
                  <CardContent>
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No employers found for this occupation.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default HealthcareEmployers;