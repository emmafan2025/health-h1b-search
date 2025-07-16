
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SearchFilters as SearchFiltersType } from "@/types/h1b";
import { useTranslation } from "@/contexts/TranslationContext";

interface SearchFiltersProps {
  onApplyFilters: (filters: SearchFiltersType) => void;
}

const SearchFilters = ({ onApplyFilters }: SearchFiltersProps) => {
  const { t } = useTranslation();
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

  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-blue-800">{t.search.filters.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>{t.search.filters.jobTitle}</Label>
            <Input
              placeholder={t.search.filters.jobTitlePlaceholder}
              value={filters.jobTitle || ""}
              onChange={(e) => setFilters({...filters, jobTitle: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.search.filters.workState}</Label>
            <Select value={filters.state || "all"} onValueChange={(value) => setFilters({...filters, state: value === "all" ? "" : value})}>
              <SelectTrigger>
                <SelectValue placeholder={t.search.filters.selectState} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.search.filters.allStates}</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.search.filters.year}</Label>
            <Select value={filters.year?.toString() || "all"} onValueChange={(value) => setFilters({...filters, year: value === "all" ? undefined : parseInt(value)})}>
              <SelectTrigger>
                <SelectValue placeholder={t.search.filters.selectYear} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.search.filters.allYears}</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.search.filters.quarter}</Label>
            <Select value={filters.quarter || "all"} onValueChange={(value) => setFilters({...filters, quarter: value === "all" ? "" : value})}>
              <SelectTrigger>
                <SelectValue placeholder={t.search.filters.selectQuarter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.search.filters.allQuarters}</SelectItem>
                {quarters.map((quarter) => (
                  <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.search.filters.location}</Label>
            <Input
              placeholder={t.search.filters.locationPlaceholder}
              value={filters.location || ""}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.search.filters.minSalary}</Label>
            <Input
              type="number"
              placeholder="60000"
              value={filters.minSalary || ""}
              onChange={(e) => setFilters({...filters, minSalary: e.target.value ? parseInt(e.target.value) : undefined})}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.search.filters.maxSalary}</Label>
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
            {t.search.filters.applyFilters}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            {t.search.filters.resetAll}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
