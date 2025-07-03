import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import SearchResults from "@/components/SearchResults";
import PaginationControls from "@/components/PaginationControls";
import SortControls from "@/components/SortControls";
import { useH1BData } from "@/hooks/useH1BData";
import { SearchFilters, PaginationInfo } from "@/types/h1b";

const H1BCases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50); // Show more cases per page
  const [sortBy, setSortBy] = useState('wage_rate_of_pay_from');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: h1bData, loading, error, totalCount, refetch } = useH1BData();

  // Pagination info
  const paginationInfo: PaginationInfo = {
    currentPage,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize)
  };

  useEffect(() => {
    // Initial load with current settings
    refetch(currentFilters, currentPage, pageSize, sortBy, sortOrder);
  }, []);

  const performSearch = (filters: SearchFilters, page: number = 1) => {
    const combinedFilters = {
      ...filters,
      searchQuery: searchQuery.trim()
    };
    setCurrentFilters(filters);
    setCurrentPage(page);
    refetch(combinedFilters, page, pageSize, sortBy, sortOrder);
  };

  const handleSearch = () => {
    performSearch(currentFilters, 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-blue-800">All H1B Cases</h1>
              <p className="text-gray-600">Browse all healthcare H1B cases ({totalCount.toLocaleString()} total cases)</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search by employer, job title, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </div>

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
            <p className="text-gray-600">Loading cases...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Failed to load data: {error}</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-blue-800">
                H1B Cases ({totalCount.toLocaleString()} records found)
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
    </div>
  );
};

export default H1BCases;