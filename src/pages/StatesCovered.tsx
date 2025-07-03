import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface StateData {
  state: string;
  case_count: number;
}

const StatesCovered = () => {
  const [states, setStates] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // US State names mapping
  const stateNames: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia', 'PR': 'Puerto Rico'
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('healthcare_h1b_cases')
          .select('WORKSITE_STATE')
          .not('WORKSITE_STATE', 'is', null);

        if (error) throw error;

        // Count cases per state
        const stateCounts = data.reduce((acc, item) => {
          const state = item.WORKSITE_STATE?.trim();
          if (state) {
            acc[state] = (acc[state] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        // Convert to array and sort by case count
        const sortedStates = Object.entries(stateCounts)
          .map(([state, case_count]) => ({ state, case_count }))
          .sort((a, b) => b.case_count - a.case_count);

        setStates(sortedStates);
        setError(null);
      } catch (err) {
        console.error('Error fetching states:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading states data...</p>
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
            <MapPin className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-blue-800">States Covered</h1>
              <p className="text-gray-600">Ranked by number of H1B cases ({states.length} states/territories)</p>
            </div>
          </div>
        </div>

        {/* States Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {states.map((stateData, index) => (
            <Card key={stateData.state} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                      <span className="text-purple-800 font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {stateNames[stateData.state] || stateData.state}
                      </h3>
                      <p className="text-sm text-gray-600 font-mono">{stateData.state}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {stateData.case_count.toLocaleString()} cases
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {states.length === 0 && (
          <Card className="text-center p-8">
            <CardContent>
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No states data found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StatesCovered;