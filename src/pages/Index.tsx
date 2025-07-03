import { useState } from "react";
import { Search, Filter, Building2, MapPin, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchFilters from "@/components/SearchFilters";
import SearchResults from "@/components/SearchResults";
import PaginationControls from "@/components/PaginationControls";
import SortControls from "@/components/SortControls";
import Navigation from "@/components/Navigation";
import TopRankings from "@/components/TopRankings";
import EmailSubscription from "@/components/EmailSubscription";
import { useH1BData } from "@/hooks/useH1BData";
import { SearchFilters as SearchFiltersType, PaginationInfo } from "@/types/h1b";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('wage_rate_of_pay_from');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const { data: h1bData, loading, error, totalCount, totalEmployers, totalStates, averageSalary, refetch } = useH1BData();

  // Pagination info
  const paginationInfo: PaginationInfo = {
    currentPage,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize)
  };

  // Stats based on accurate data from the entire database
  const dataStats = {
    totalEmployers,
    totalCases: totalCount,
    statesCovered: totalStates,
    averageSalary
  };

  // Popular employers from actual data - updated to use uppercase field names
  const employerCounts = h1bData.reduce((acc, item) => {
    if (item.EMPLOYER_NAME) {
      acc[item.EMPLOYER_NAME] = (acc[item.EMPLOYER_NAME] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const popularEmployers = Object.entries(employerCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([name]) => name);

  const performSearch = (filters: SearchFiltersType, page: number = 1) => {
    const combinedFilters = {
      ...filters,
      searchQuery: searchQuery.trim()
    };
    setCurrentFilters(filters);
    setCurrentPage(page);
    refetch(combinedFilters, page, pageSize, sortBy, sortOrder);
    setShowResults(true);
  };

  const handleSearch = () => {
    performSearch(currentFilters, 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const applyFilters = (filters: SearchFiltersType) => {
    performSearch(filters, 1);
  };

  const handlePageChange = (page: number) => {
    performSearch(currentFilters, page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    performSearch(currentFilters, 1);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    refetch(currentFilters, currentPage, pageSize, newSortBy, newSortOrder);
  };

  if (loading && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading H1B data...</p>
        </div>
      </div>
    );
  }

  if (error && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load data: {error}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          {/* Header with Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold text-blue-800">US Healthcare H1B Search</h1>
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
                  placeholder="Search employer name or job category..."
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
                Filter
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <SearchFilters onApplyFilters={applyFilters} />
          )}

          {/* Sort Controls */}
          <SortControls 
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          {/* Results */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-blue-800">
                  Search Results ({totalCount} records found)
                </h2>
              </div>
              <SearchResults data={h1bData} />
              {totalCount > 0 && (
                <PaginationControls
                  pagination={paginationInfo}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          )}
        </div>
        
        <TopRankings />
        <EmailSubscription />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="flex items-center justify-center pt-16">
        <div className="w-full max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-blue-800 mb-4">
              US Healthcare H1B Search
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explore H1B case data and employer information in the healthcare industry
            </p>
          </div>

          {/* Search Box */}
          <Card className="mb-8 shadow-lg border-0">
            <CardContent className="p-8">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search employer name or job category..."
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
          {popularEmployers.length > 0 && (
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
          )}
        </div>
      </div>
      
      <TopRankings />
      <EmailSubscription />
    </div>
  );
};

export default Index;
