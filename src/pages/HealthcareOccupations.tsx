import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface OccupationData {
  occupation: string;
  soc_code: string;
  case_count: number;
}

const HealthcareOccupations = () => {
  const [occupations, setOccupations] = useState<OccupationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOccupations = async () => {
      try {
        setLoading(true);
        console.log("Fetching healthcare occupations data...");
        
        // Use the fixed get_occupation_counts function to get all occupation data
        const { data, error } = await supabase
          .rpc("get_occupation_counts");

        console.log("Occupations RPC result:", { dataLength: data?.length, error });

        if (error) {
          console.error("Error from get_occupation_counts:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log("No occupations data found");
          setOccupations([]);
          setError(null);
          return;
        }

        // Data is already sorted by case count in descending order
        const occupationsData = data.map(item => ({
          occupation: item.occupation,
          soc_code: item.soc_code || "",
          case_count: Number(item.case_count)
        }));

        console.log("Top 5 occupations:", occupationsData.slice(0, 5));
        console.log("Total unique occupations:", occupationsData.length);
        
        setOccupations(occupationsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching occupations:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOccupations();
  }, []);

  const formatOccupationName = (occupation: string) => {
    // Capitalize first letter of each word
    return occupation
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading healthcare occupations...</p>
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
            <Briefcase className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-blue-800">Healthcare Occupations</h1>
              <p className="text-gray-600">Ranked by number of H1B cases ({occupations.length} unique occupations)</p>
            </div>
          </div>
        </div>

        {/* Occupations List */}
        <div className="grid gap-4">
          {occupations.map((occupation, index) => (
            <Card key={`${occupation.occupation}-${occupation.soc_code}`} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                      <span className="text-orange-800 font-bold text-lg">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {formatOccupationName(occupation.occupation)}
                      </h3>
                      {occupation.soc_code && (
                        <p className="text-sm text-gray-600 font-mono">SOC Code: {occupation.soc_code}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {occupation.case_count.toLocaleString()} cases
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {occupations.length === 0 && (
          <Card className="text-center p-8">
            <CardContent>
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No healthcare occupations found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthcareOccupations;