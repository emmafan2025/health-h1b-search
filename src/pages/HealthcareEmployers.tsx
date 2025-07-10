import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";

interface EmployerData {
  employer_name: string;
  case_count: number;
}

interface OccupationData {
  occupation: string;
  soc_code: string;
  case_count: number;
}

const HealthcareEmployers = () => {
  const [employers, setEmployers] = useState<EmployerData[]>([]);
  const [occupations, setOccupations] = useState<OccupationData[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOccupation, setSelectedOccupation] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [totalCases, setTotalCases] = useState(0);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load all occupations
        const { data: occupationData, error: occupationError } = await supabase
          .rpc('get_occupation_counts');
        
        if (occupationError) throw occupationError;
        
        // Load available years
        const { data: yearData, error: yearError } = await supabase
          .rpc('get_available_years');
        
        if (yearError) throw yearError;
        
        setOccupations(occupationData || []);
        setAvailableYears(yearData?.map(y => y.year) || []);
        
        // Load employers with default filters
        await fetchEmployers("all", "all");
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Fetch employers when filters change
  useEffect(() => {
    if (occupations.length > 0) {
      fetchEmployers(selectedOccupation, selectedYear);
    }
  }, [selectedOccupation, selectedYear, occupations.length]);

  const fetchEmployers = async (occupation: string, year: string) => {
    try {
      setLoading(true);
      console.log('Fetching healthcare employers for occupation:', occupation, 'year:', year);
      
      // Get the occupation title for filtering
      let occupationTitle = null;
      if (occupation !== "all") {
        const selectedOcc = occupations.find(occ => occ.occupation === occupation);
        occupationTitle = selectedOcc?.occupation || null;
      }
      
      // Get year for filtering
      let filterYear = null;
      if (year !== "all") {
        filterYear = parseInt(year);
      }
      
      // Use RPC function to get employer counts with both filters
      const { data: employerData, error } = await supabase
        .rpc('get_employers_by_occupation_with_counts', {
          occupation_title: occupationTitle,
          filter_year: filterYear
        });
      
      console.log('RPC result:', { dataLength: employerData?.length, error, occupation, year });
      
      if (error) throw error;
      
      if (!employerData || employerData.length === 0) {
        console.log('No employers found for filters:', { occupation, year });
        setEmployers([]);
        setTotalCases(0);
        setError(null);
        return;
      }

      // Data is already aggregated by the database function
      const sortedEmployers = employerData.map(item => ({
        employer_name: item.employer_name,
        case_count: Number(item.case_count)
      }));

      console.log('Top 5 employers:', sortedEmployers.slice(0, 5));
      
      // Calculate total cases from employer counts
      const totalCasesCount = sortedEmployers.reduce((sum, emp) => sum + emp.case_count, 0);
      
      setEmployers(sortedEmployers);
      setTotalCases(totalCasesCount);
      setError(null);
    } catch (err) {
      console.error('Error fetching employers:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedOccupationLabel = () => {
    if (selectedOccupation === "all") return "All Occupations";
    return selectedOccupation;
  };

  const getSelectedYearLabel = () => {
    if (selectedYear === "all") return "All Years";
    return selectedYear;
  };

  if (loading && occupations.length === 0) {
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

  if (error && occupations.length === 0) {
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
              <p className="text-gray-600">Top employers ranked by H1B sponsorship volume</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Occupation Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Occupation</label>
                <Select value={selectedOccupation} onValueChange={setSelectedOccupation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occupation" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="all">All Occupations</SelectItem>
                    {occupations
                      .sort((a, b) => {
                        // Sort by SOC code first, then by occupation name
                        if (a.soc_code && b.soc_code) {
                          return a.soc_code.localeCompare(b.soc_code);
                        }
                        if (a.soc_code && !b.soc_code) return -1;
                        if (!a.soc_code && b.soc_code) return 1;
                        return a.occupation.localeCompare(b.occupation);
                      })
                      .map((occupation, index) => (
                      <SelectItem key={`${occupation.soc_code}-${occupation.occupation}-${index}`} value={occupation.occupation}>
                        {occupation.soc_code ? `${occupation.soc_code} - ` : ''}{occupation.occupation} ({occupation.case_count.toLocaleString()} cases)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">
            {getSelectedOccupationLabel()} - {getSelectedYearLabel()}
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
            <Button onClick={() => fetchEmployers(selectedOccupation, selectedYear)}>Retry</Button>
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
                          Healthcare Employer
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
              <p className="text-gray-600">No employers found for the selected filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HealthcareEmployers;