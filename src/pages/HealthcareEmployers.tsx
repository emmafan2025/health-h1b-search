import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface EmployerData {
  employer_name: string;
  case_count: number;
}

const HealthcareEmployers = () => {
  const [employers, setEmployers] = useState<EmployerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setLoading(true);
        
        // Use SQL aggregation to get accurate counts
        const { data, error } = await supabase
          .rpc('get_employer_counts');

        if (error) {
          // Fallback to manual SQL query if RPC doesn't exist
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('healthcare_h1b_cases')
            .select('EMPLOYER_NAME')
            .not('EMPLOYER_NAME', 'is', null);
          
          if (fallbackError) throw fallbackError;
          
          // Count manually as fallback
          const employerCounts = fallbackData.reduce((acc, item) => {
            const employer = item.EMPLOYER_NAME;
            acc[employer] = (acc[employer] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const sortedEmployers = Object.entries(employerCounts)
            .map(([employer_name, case_count]) => ({ employer_name, case_count }))
            .sort((a, b) => b.case_count - a.case_count);

          setEmployers(sortedEmployers);
        } else {
          setEmployers(data || []);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching employers:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, []);

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
              <h1 className="text-3xl font-bold text-blue-800">Healthcare Employers</h1>
              <p className="text-gray-600">Ranked by number of H1B cases ({employers.length} total employers)</p>
            </div>
          </div>
        </div>

        {/* Employers List */}
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
                      <p className="text-sm text-gray-600">Healthcare Employer</p>
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

        {employers.length === 0 && (
          <Card className="text-center p-8">
            <CardContent>
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No healthcare employers found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthcareEmployers;