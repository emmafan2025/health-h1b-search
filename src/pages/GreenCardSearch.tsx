import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-800 mb-6">
            {t.greenCard.title}
          </h1>

          <div className="flex space-x-2 mb-4">
            <div className="relative flex-grow">
              <Input 
                type="text" 
                placeholder={t.greenCard.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pr-10"
              />
              <Search 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500" 
              />
            </div>
            <Button 
              variant="outline" 
              className="text-purple-700 border-purple-300 hover:bg-purple-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" /> {t.greenCard.filters}
            </Button>
          </div>

          {showFilters && (
            <Card className="mb-4 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{t.greenCard.advancedFilters}</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchFilters onApplyFilters={(filters) => performSearch(filters, 1)} />
              </CardContent>
            </Card>
          )}

          {loading && <div>{t.common.loading}</div>}
          {error && <div>{t.common.error}</div>}

          {showResults && greenCardData.length === 0 && (
            <div className="text-center text-purple-600">
              {t.greenCard.noResults}
            </div>
          )}

          {showResults && greenCardData.length > 0 && (
            <>
              <SortControls 
                sortBy={sortBy} 
                sortOrder={sortOrder} 
                onSortChange={(newSortBy: string, newSortOrder: 'asc' | 'desc') => {
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              />
              {/* TODO: 创建专门的绿卡搜索结果组件 */}
              <div className="mt-4">
                {/* 搜索结果列表 */}
              </div>
              <PaginationControls
                pagination={paginationInfo}
                onPageChange={(page: number) => performSearch(currentFilters, page)}
                onPageSizeChange={(newPageSize: number) => {
                  setPageSize(newPageSize);
                  performSearch(currentFilters, 1);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GreenCardSearch;