
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
    { value: 'WAGE_RATE_OF_PAY_FROM', label: '工资' },
    { value: 'EMPLOYER_NAME', label: '雇主名称' },
    { value: 'Year', label: '年份' },
    { value: 'created_at', label: '创建时间' }
  ];

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="text-sm font-medium text-gray-700">排序方式:</span>
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
            升序
          </>
        ) : (
          <>
            <ArrowDown className="h-4 w-4 mr-1" />
            降序
          </>
        )}
      </Button>
    </div>
  );
};

export default SortControls;
