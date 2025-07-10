import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Search, MapPin, Building2, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";

interface Employer {
  employer_name: string;
  case_count: number;
}

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");

  // Fetch employers data
  const { data: employers, isLoading } = useQuery({
    queryKey: ["employers"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_employer_counts");
      if (error) throw error;
      return data as Employer[];
    },
  });

  // Fetch states for filter
  const { data: states } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_state_counts");
      if (error) throw error;
      return data;
    },
  });

  // Filter employers based on search and state
  const filteredEmployers = employers?.filter((employer) => {
    const matchesSearch = employer.employer_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const handleLinkedInSearch = (employerName: string) => {
    const searchQuery = encodeURIComponent(`${employerName} jobs`);
    window.open(`https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`, '_blank');
  };

  const handleIndeedSearch = (employerName: string) => {
    const searchQuery = encodeURIComponent(employerName);
    window.open(`https://www.indeed.com/jobs?q=${searchQuery}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Healthcare Jobs from H1B Sponsors
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find job opportunities at companies that have previously sponsored H1B visas for healthcare professionals.
            Search for current openings on LinkedIn and Indeed.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Employers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by employer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:w-48">
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states?.slice(0, 20).map((state) => (
                      <SelectItem key={state.state} value={state.state}>
                        {state.state} ({state.case_count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{employers?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">H1B Sponsor Employers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {employers?.reduce((sum, emp) => sum + emp.case_count, 0) || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Total H1B Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{filteredEmployers.length}</p>
                  <p className="text-sm text-muted-foreground">Filtered Results</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employers Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading employers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployers.slice(0, 50).map((employer) => (
              <Card key={employer.employer_name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2 min-h-[3.5rem]">
                    {employer.employer_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {employer.case_count} H1B Cases
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    This employer has sponsored {employer.case_count} H1B applications for healthcare professionals.
                  </p>
                  
                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => handleLinkedInSearch(employer.employer_name)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Search Jobs on LinkedIn
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleIndeedSearch(employer.employer_name)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Search Jobs on Indeed
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredEmployers.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No employers found matching your search criteria.</p>
          </div>
        )}

        {filteredEmployers.length > 50 && (
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Showing first 50 results. Use search to narrow down your results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;