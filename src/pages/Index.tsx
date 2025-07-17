import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Building2, MapPin, Briefcase, Users, Sparkles, TrendingUp, Star, ChevronRight } from "lucide-react";
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
import { useTranslation } from "@/contexts/TranslationContext";

const Index = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('wage_rate_of_pay_from');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const { data: h1bData, loading, error, totalCount, totalEmployers, totalStates, totalOccupations, refetch } = useH1BData();

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
    totalOccupations
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">{t.search.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <Card className="bg-red-50 border-red-200 max-w-md">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">{t.search.failedToLoad}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                {t.search.retry}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Search Header */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowResults(false)}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  ← {t.search.newSearch}
                </Button>
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder={t.search.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 px-6">
                  {t.search.filter}
                </Button>
              </div>
              
              {showFilters && (
                <div className="border-t border-gray-100 pt-6">
                  <SearchFilters onApplyFilters={applyFilters} />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {t.search.searchResults} ({totalCount.toLocaleString()} {t.search.recordsFound})
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                {t.search.advancedSearch}
              </Button>
            </div>

            <SortControls 
              sortBy={sortBy} 
              sortOrder={sortOrder} 
              onSortChange={handleSortChange}
            />
            
            <SearchResults data={h1bData} />
            
            <PaginationControls
              pagination={paginationInfo}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
        
        <TopRankings />
        <EmailSubscription />
      </div>
    );
  }

  // Enhanced Stats Data
  const enhancedStats = [
    { 
      icon: Building2, 
      label: t.search.stats.healthcareEmployers, 
      value: `${dataStats.totalEmployers.toLocaleString()}+`, 
      color: "from-blue-500 to-blue-600",
      link: "/healthcare-employers",
      trend: "+12%" 
    },
    { 
      icon: Users, 
      label: t.search.stats.h1bCases, 
      value: `${dataStats.totalCases.toLocaleString()}+`, 
      color: "from-green-500 to-green-600",
      link: "/h1b-cases",
      trend: "+8%" 
    },
    { 
      icon: MapPin, 
      label: t.search.stats.statesCovered, 
      value: dataStats.statesCovered.toString(), 
      color: "from-purple-500 to-purple-600",
      link: "/states-covered",
      trend: "50" 
    },
    { 
      icon: Briefcase, 
      label: t.search.stats.occupations, 
      value: dataStats.totalOccupations.toString(), 
      color: "from-orange-500 to-orange-600",
      link: "/healthcare-occupations",
      trend: "+15%" 
    }
  ];

  // Quick Action Cards
  const quickActions = [
    {
      title: "H1B Data",
      description: "Search comprehensive H1B case database",
      icon: Search,
      color: "from-blue-500 to-blue-600",
      action: () => setShowResults(true)
    },
    {
      title: "Green Card Search",
      description: "Find green card sponsoring employers",
      icon: Star,
      color: "from-purple-500 to-purple-600",
      link: "/green-card-search"
    },
    {
      title: "Prevailing Wages",
      description: "Check official wage requirements",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      link: "/prevailing-wages"
    },
    {
      title: "Forum",
      description: "Connect with healthcare professionals",
      icon: Users,
      color: "from-orange-500 to-orange-600",
      link: "/forum"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Latest H1B Healthcare Data 2025
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              {t.search.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.search.subtitle}
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-3xl mx-auto mb-16">
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <Search className="absolute left-6 top-6 h-6 w-6 text-gray-400" />
                    <Input
                      placeholder={t.search.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-16 h-16 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    />
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={handleSearch}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 text-lg"
                    >
                      <Search className="mr-2 h-5 w-5" />
                      {t.search.searchH1BData}
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg"
                      onClick={() => setShowFilters(!showFilters)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 text-lg"
                    >
                      <Filter className="h-5 w-5 mr-2" />
                      {t.search.advancedSearch}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Moved closer to search bar */}
      {showFilters && (
        <div className="container mx-auto px-4 mb-8 -mt-8">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="border-b border-gray-100 py-4">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {t.search.advancedSearch}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <SearchFilters onApplyFilters={applyFilters} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Stats Section - Made more compact */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {enhancedStats.map((stat, index) => (
              <Link key={index} to={stat.link}>
                <Card className="group relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  <CardContent className="p-4 text-center relative">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mb-2`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
                    <div className="text-xs text-green-600 font-medium">+{stat.trend}</div>
                    <ChevronRight className="absolute top-3 right-3 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions - Made more compact */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white"
                onClick={action.action}
              >
                {action.link ? (
                  <Link to={action.link}>
                    <CardContent className="p-4 text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mb-3`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">{action.title}</h3>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </CardContent>
                  </Link>
                ) : (
                  <CardContent className="p-4 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} mb-3`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-gray-600">{action.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Employers - More compact */}
      {popularEmployers.length > 0 && (
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="text-center border-b border-gray-100 py-4">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {t.search.stats.popularHealthcareEmployers}
                </CardTitle>
                <p className="text-sm text-gray-600">Click on any employer to search their H1B cases</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {popularEmployers.map((employer) => (
                    <Badge 
                      key={employer}
                      variant="outline" 
                      className="cursor-pointer hover:bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-sm transition-all hover:shadow-sm"
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
      )}
      
      <TopRankings />
      <EmailSubscription />
    </div>
  );
};

export default Index;