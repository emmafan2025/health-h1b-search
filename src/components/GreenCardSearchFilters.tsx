import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GreenCardFilters } from "@/hooks/useGreenCardData";

interface Props {
  onApplyFilters: (filters: GreenCardFilters) => void;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC"
];

const CASE_STATUSES = ["Certified", "Denied", "Withdrawn"];
const EDUCATION_LEVELS = ["None", "High School", "Associate's", "Bachelor's", "Master's", "Doctorate", "Other"];

const GreenCardSearchFilters = ({ onApplyFilters }: Props) => {
  const [filters, setFilters] = useState<GreenCardFilters>({});

  const handleApply = () => onApplyFilters(filters);
  const handleReset = () => {
    const empty: GreenCardFilters = {};
    setFilters(empty);
    onApplyFilters(empty);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Employer Name</Label>
        <Input
          placeholder="e.g. Google, Amazon..."
          value={filters.employerName || ""}
          onChange={(e) => setFilters({ ...filters, employerName: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Job Title</Label>
        <Input
          placeholder="e.g. Software Engineer..."
          value={filters.jobTitle || ""}
          onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Work State</Label>
        <Select value={filters.state || "all"} onValueChange={(v) => setFilters({ ...filters, state: v === "all" ? "" : v })}>
          <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Case Status</Label>
        <Select value={filters.caseStatus || "all"} onValueChange={(v) => setFilters({ ...filters, caseStatus: v === "all" ? "" : v })}>
          <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {CASE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Min Salary ($)</Label>
        <Input
          type="number"
          placeholder="60000"
          value={filters.minSalary || ""}
          onChange={(e) => setFilters({ ...filters, minSalary: e.target.value ? parseInt(e.target.value) : undefined })}
        />
      </div>

      <div className="space-y-2">
        <Label>Max Salary ($)</Label>
        <Input
          type="number"
          placeholder="200000"
          value={filters.maxSalary || ""}
          onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value ? parseInt(e.target.value) : undefined })}
        />
      </div>

      <div className="space-y-2">
        <Label>Minimum Education</Label>
        <Select value={filters.minimumEducation || "all"} onValueChange={(v) => setFilters({ ...filters, minimumEducation: v === "all" ? "" : v })}>
          <SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {EDUCATION_LEVELS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end gap-3 lg:col-span-2">
        <Button onClick={handleApply} className="bg-purple-600 hover:bg-purple-700">Apply Filters</Button>
        <Button variant="outline" onClick={handleReset}>Reset All</Button>
      </div>
    </div>
  );
};

export default GreenCardSearchFilters;
