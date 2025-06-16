
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
    jobTitle: "",
    state: "",
    year: undefined,
    quarter: "",
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters: SearchFiltersType = {
      location: "",
      minSalary: undefined,
      maxSalary: undefined,
      jobTitle: "",
      state: "",
      year: undefined,
      quarter: "",
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  // Common US states for healthcare H1B cases
  const states = [
    "CA", "NY", "TX", "FL", "IL", "PA", "OH", "MI", "NC", "NJ",
    "VA", "WA", "AZ", "MA", "GA", "IN", "TN", "MO", "MD", "WI"
  ];

  const years = [2020, 2021, 2022, 2023, 2024];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-blue-800">高级搜索筛选</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>职位名称</Label>
            <Input
              placeholder="输入职位名称"
              value={filters.jobTitle || ""}
              onChange={(e) => setFilters({...filters, jobTitle: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>工作州</Label>
            <Select value={filters.state || ""} onValueChange={(value) => setFilters({...filters, state: value})}>
              <SelectTrigger>
                <SelectValue placeholder="选择州" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部州</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>年份</Label>
            <Select value={filters.year?.toString() || ""} onValueChange={(value) => setFilters({...filters, year: value ? parseInt(value) : undefined})}>
              <SelectTrigger>
                <SelectValue placeholder="选择年份" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部年份</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>季度</Label>
            <Select value={filters.quarter || ""} onValueChange={(value) => setFilters({...filters, quarter: value})}>
              <SelectTrigger>
                <SelectValue placeholder="选择季度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部季度</SelectItem>
                {quarters.map((quarter) => (
                  <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>地点（城市/州）</Label>
            <Input
              placeholder="输入城市或州"
              value={filters.location || ""}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>最低工资 ($)</Label>
            <Input
              type="number"
              placeholder="60000"
              value={filters.minSalary || ""}
              onChange={(e) => setFilters({...filters, minSalary: e.target.value ? parseInt(e.target.value) : undefined})}
            />
          </div>

          <div className="space-y-2">
            <Label>最高工资 ($)</Label>
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
            应用筛选
          </Button>
          <Button variant="outline" onClick={handleReset}>
            重置全部
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
