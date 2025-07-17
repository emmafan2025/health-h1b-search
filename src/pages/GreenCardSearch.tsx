import { useState } from "react";
import { Search, Filter, Sparkles, Building2, MapPin, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import SearchFilters from "@/components/SearchFilters";
import PaginationControls from "@/components/PaginationControls";
import SortControls from "@/components/SortControls";
import { SearchFilters as SearchFiltersType, PaginationInfo } from "@/types/h1b";
import { useTranslation } from "@/contexts/TranslationContext";

// 创建一个专门用于绿卡搜索的自定义数据钩子 (TODO: 实现这个钩子)
const useGreenCardData = () => {
  // 临时实现，后续需要替换为真实的数据获取逻辑
  return {
    data: [],
    loading: false,
    error: null,
    totalCount: 0,
    totalEmployers: 0,
    totalStates: 0,
    totalOccupations: 0,
    refetch: () => {}
  };
};

const GreenCardSearch = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState('PRIORITY_DATE');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { 
    data: greenCardData, 
    loading, 
    error, 
    totalCount, 
    totalEmployers, 
    totalStates, 
    totalOccupations, 
    refetch 
  } = useGreenCardData();

  const paginationInfo: PaginationInfo = {
    currentPage,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize)
  };

  const performSearch = (filters: SearchFiltersType, page: number = 1) => {
    const combinedFilters = {
      ...filters,
      searchQuery: searchQuery.trim()
    };
    setCurrentFilters(filters);
    setCurrentPage(page);
    refetch(); // TODO: 实现真实的搜索逻辑
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

  // 模拟统计数据
  const stats = [
    { icon: Building2, label: "Active Sponsors", value: "12,450+", color: "text-purple-600" },
    { icon: MapPin, label: "States Covered", value: "50", color: "text-blue-600" },
    { icon: Calendar, label: "Applications Tracked", value: "45,230+", color: "text-green-600" },
    { icon: TrendingUp, label: "Success Rate", value: "89%", color: "text-orange-600" }
  ];

  // 热门搜索标签
  const popularTags = [
    "Software Engineer", "Data Scientist", "Product Manager", 
    "Healthcare", "Finance", "Tech Companies", "New York", "California"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Latest Green Card Data 2025
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              {t.greenCard.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover green card sponsoring employers, track priority dates, and find your path to permanent residency
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
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
                    handleSearch();
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
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
                <SearchFilters onApplyFilters={(filters) => performSearch(filters, 1)} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Results Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">{t.common.loading}</p>
            </div>
          )}
          
          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <p className="text-red-600">{t.common.error}</p>
              </CardContent>
            </Card>
          )}

          {showResults && greenCardData.length === 0 && !loading && (
            <Card className="bg-gray-50">
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {t.greenCard.noResults}
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or filters
                </p>
              </CardContent>
            </Card>
          )}

          {showResults && greenCardData.length > 0 && (
            <div className="space-y-6">
              <SortControls 
                sortBy={sortBy} 
                sortOrder={sortOrder} 
                onSortChange={(newSortBy: string, newSortOrder: 'asc' | 'desc') => {
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              />
              
              {/* TODO: 创建专门的绿卡搜索结果组件 */}
              <div className="space-y-4">
                {/* 搜索结果列表将在这里显示 */}
              </div>
              
              <PaginationControls
                pagination={paginationInfo}
                onPageChange={(page: number) => performSearch(currentFilters, page)}
                onPageSizeChange={(newPageSize: number) => {
                  setPageSize(newPageSize);
                  performSearch(currentFilters, 1);
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