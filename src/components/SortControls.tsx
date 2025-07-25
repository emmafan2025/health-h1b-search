
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface SortControlsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const SortControls = ({ sortBy, sortOrder, onSortChange }: SortControlsProps) => {
  const { t } = useTranslation();
  
  const sortOptions = [
    { value: 'wage_rate_of_pay_from', label: t.search.sort.salary },
    { value: 'employer_name', label: t.search.sort.employerName },
    { value: 'year', label: t.search.sort.year },
    { value: 'created_at', label: t.search.sort.createdDate }
  ];

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="text-sm font-medium text-gray-700">{t.search.sort.sortBy}</span>
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
            {t.search.sort.ascending}
          </>
        ) : (
          <>
            <ArrowDown className="h-4 w-4 mr-1" />
            {t.search.sort.descending}
          </>
        )}
      </Button>
    </div>
  );
};

export default SortControls;
