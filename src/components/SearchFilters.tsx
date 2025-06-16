
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SearchFilters as SearchFiltersType } from "@/types/h1b";

interface SearchFiltersProps {
  onApplyFilters: (filters: SearchFiltersType) => void;
}

const SearchFilters = ({ onApplyFilters }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFiltersType>({
    location: "",
    minSalary: undefined,
    maxSalary: undefined,
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters: SearchFiltersType = {
      location: "",
      minSalary: undefined,
      maxSalary: undefined,
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-blue-800">Advanced Search Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="City, State"
              value={filters.location || ""}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Min Salary ($)</Label>
            <Input
              type="number"
              placeholder="80000"
              value={filters.minSalary || ""}
              onChange={(e) => setFilters({...filters, minSalary: e.target.value ? parseInt(e.target.value) : undefined})}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Salary ($)</Label>
            <Input
              type="number"
              placeholder="150000"
              value={filters.maxSalary || ""}
              onChange={(e) => setFilters({...filters, maxSalary: e.target.value ? parseInt(e.target.value) : undefined})}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
