
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortControlsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const SortControls = ({ sortBy, sortOrder, onSortChange }: SortControlsProps) => {
  const sortOptions = [
    { value: 'WAGE_RATE_OF_PAY_FROM', label: 'Salary' },
    { value: 'EMPLOYER_NAME', label: 'Employer Name' },
    { value: 'Year', label: 'Year' },
    { value: 'created_at', label: 'Created Date' }
  ];

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <Select value={sortBy} onValueChange={(value) => onSortChange(value, sortOrder)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button variant="outline" size="sm" onClick={toggleSortOrder}>
        {sortOrder === 'asc' ? (
          <>
            <ArrowUp className="h-4 w-4 mr-1" />
            Ascending
          </>
        ) : (
          <>
            <ArrowDown className="h-4 w-4 mr-1" />
            Descending
          </>
        )}
      </Button>
    </div>
  );
};

export default SortControls;
