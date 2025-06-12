
import { useState } from "react";
import { Search, Filter, Building2, MapPin, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchFilters from "@/components/SearchFilters";
import SearchResults from "@/components/SearchResults";
import { h1bHealthcareData, dataStats, popularEmployers, type H1BCase } from "@/data/h1bData";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredData, setFilteredData] = useState<H1BCase[]>(h1bHealthcareData);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filtered = h1bHealthcareData.filter(item =>
        item.employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
      setShowResults(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const applyFilters = (filters: any) => {
    let filtered = h1bHealthcareData;
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.employerType && filters.employerType !== "all") {
      filtered = filtered.filter(item => item.employerType === filters.employerType);
    }

    if (filters.location) {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minSalary) {
      filtered = filtered.filter(item => item.salary >= filters.minSalary);
    }

    if (filters.maxSalary) {
      filtered = filtered.filter(item => item.salary <= filters.maxSalary);
    }

    setFilteredData(filtered);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-6">
          {/* Header with Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold text-blue-800">H1B Healthcare Search</h1>
              <Button
                variant="outline"
                onClick={() => setShowResults(false)}
                className="ml-auto"
              >
                New Search
              </Button>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for employers, job titles, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <SearchFilters onApplyFilters={applyFilters} />
          )}

          {/* Results */}
          <SearchResults data={filteredData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-800 mb-4">
            H1B Healthcare Search
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover H1B case data and employer information in the healthcare industry
          </p>
        </div>

        {/* Search Box */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-8">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for employers, job titles, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4 mt-4 justify-center">
              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Search H1B Data
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        {showFilters && (
          <SearchFilters onApplyFilters={applyFilters} />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">{dataStats.totalEmployers.toLocaleString()}+</h3>
            <p className="text-sm text-gray-600">Healthcare Employers</p>
          </Card>
          
          <Card className="text-center p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">{dataStats.totalCases.toLocaleString()}+</h3>
            <p className="text-sm text-gray-600">H1B Cases</p>
          </Card>
          
          <Card className="text-center p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">{dataStats.statesCovered}</h3>
            <p className="text-sm text-gray-600">States Covered</p>
          </Card>
          
          <Card className="text-center p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">${(dataStats.averageSalary / 1000).toFixed(0)}K</h3>
            <p className="text-sm text-gray-600">Average Salary</p>
          </Card>
        </div>

        {/* Popular Searches */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-gray-800">Popular Healthcare Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3">
              {popularEmployers.map((employer) => (
                <Badge 
                  key={employer}
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-50 text-blue-700 border-blue-200"
                  onClick={() => {
                    setSearchQuery(employer);
                    handleSearch();
                  }}
                >
                  {employer}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
