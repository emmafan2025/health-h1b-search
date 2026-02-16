import { useState, useCallback } from "react";
import { Search, Filter, Sparkles, Building2, MapPin, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import GreenCardSearchFilters from "@/components/GreenCardSearchFilters";
import GreenCardResults from "@/components/GreenCardResults";
import PaginationControls from "@/components/PaginationControls";
import { PaginationInfo } from "@/types/h1b";
import { useGreenCardData, GreenCardFilters } from "@/hooks/useGreenCardData";
import { useTranslation } from "@/contexts/TranslationContext";

const GreenCardSearch = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<GreenCardFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('wage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: greenCardData, loading, error, totalCount, search } = useGreenCardData();

  const paginationInfo: PaginationInfo = {
    currentPage,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize)
  };

  const performSearch = useCallback((filters: GreenCardFilters, page: number = 1, size: number = pageSize) => {
    const combined: GreenCardFilters = { ...filters, searchQuery: searchQuery.trim() };
    setCurrentFilters(filters);
    setCurrentPage(page);
    setShowResults(true);
    search(combined, page, size, sortBy, sortOrder);
  }, [searchQuery, pageSize, sortBy, sortOrder, search]);

  const handleSearch = () => performSearch(currentFilters, 1);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const stats = [
    { icon: Building2, label: "Active Sponsors", value: "12,450+", color: "text-purple-600" },
    { icon: MapPin, label: "States Covered", value: "50", color: "text-blue-600" },
    { icon: Calendar, label: "Applications Tracked", value: "45,230+", color: "text-green-600" },
    { icon: TrendingUp, label: "Success Rate", value: "89%", color: "text-orange-600" }
  ];

  const popularTags = [
    "Software Engineer", "Data Scientist", "Product Manager",
    "Healthcare", "Finance", "New York", "California"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Latest PERM Green Card Data
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              {t.greenCard.title}
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover green card sponsoring employers, track PERM cases, and find your path to permanent residency
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Input
                type="text"
                placeholder={t.greenCard.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="h-16 text-lg pl-6 pr-32 border-2 border-purple-200 focus:border-purple-400 rounded-2xl shadow-lg"
              />
              <div className="absolute right-2 top-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Button
                  size="sm"
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <span className="text-sm text-gray-500 mr-4">Popular searches:</span>
              {popularTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-purple-100 transition-colors"
                  onClick={() => {
                    setSearchQuery(tag);
                    const combined: GreenCardFilters = { ...currentFilters, searchQuery: tag };
                    setCurrentPage(1);
                    setShowResults(true);
                    search(combined, 1, pageSize, sortBy, sortOrder);
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 -mt-8 mb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
              <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {t.greenCard.advancedFilters}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <GreenCardSearchFilters onApplyFilters={(filters) => performSearch(filters, 1)} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
              <p className="mt-4 text-gray-600">{t.common.loading}</p>
            </div>
          )}

          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {showResults && !loading && greenCardData.length === 0 && !error && (
            <Card className="bg-gray-50">
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{t.greenCard.noResults}</h3>
                <p className="text-gray-500">Try adjusting your search terms or filters</p>
              </CardContent>
            </Card>
          )}

          {showResults && greenCardData.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found <span className="font-semibold text-gray-900">{totalCount.toLocaleString()}</span> results
                </p>
              </div>

              <GreenCardResults data={greenCardData} />

              <PaginationControls
                pagination={paginationInfo}
                onPageChange={(page) => performSearch(currentFilters, page)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  performSearch(currentFilters, 1, newSize);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GreenCardSearch;
