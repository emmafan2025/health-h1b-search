
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SearchFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const SearchFilters = ({ onApplyFilters }: SearchFiltersProps) => {
  const [filters, setFilters] = useState({
    employerType: "all",
    location: "",
    minSalary: "",
    maxSalary: "",
    caseStatus: "all"
  });

  const handleApplyFilters = () => {
    onApplyFilters({
      ...filters,
      minSalary: filters.minSalary ? parseInt(filters.minSalary) : null,
      maxSalary: filters.maxSalary ? parseInt(filters.maxSalary) : null
    });
  };

  const handleReset = () => {
    const resetFilters = {
      employerType: "all",
      location: "",
      minSalary: "",
      maxSalary: "",
      caseStatus: "all"
    };
    setFilters(resetFilters);
    onApplyFilters({
      ...resetFilters,
      minSalary: null,
      maxSalary: null
    });
  };

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-blue-800">Advanced Search Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label>Employer Type</Label>
            <Select 
              value={filters.employerType} 
              onValueChange={(value) => setFilters({...filters, employerType: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Hospital">Hospital</SelectItem>
                <SelectItem value="Pharmaceutical">Pharmaceutical</SelectItem>
                <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                <SelectItem value="Medical Device">Medical Device</SelectItem>
                <SelectItem value="Biotech">Biotechnology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="City, State"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Min Salary ($)</Label>
            <Input
              type="number"
              placeholder="80000"
              value={filters.minSalary}
              onChange={(e) => setFilters({...filters, minSalary: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Salary ($)</Label>
            <Input
              type="number"
              placeholder="150000"
              value={filters.maxSalary}
              onChange={(e) => setFilters({...filters, maxSalary: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Case Status</Label>
            <Select 
              value={filters.caseStatus} 
              onValueChange={(value) => setFilters({...filters, caseStatus: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Denied">Denied</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
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
