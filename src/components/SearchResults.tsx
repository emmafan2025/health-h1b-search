
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, DollarSign, Calendar, Briefcase } from "lucide-react";
import { H1BCase } from "@/types/h1b";

interface SearchResultsProps {
  data: H1BCase[];
}

const SearchResults = ({ data }: SearchResultsProps) => {
  const formatSalary = (salary?: number) => {
    if (!salary) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLocation = (case_item: H1BCase) => {
    const parts = [];
    if (case_item.WORKSITE_CITY) parts.push(case_item.WORKSITE_CITY);
    if (case_item.WORKSITE_STATE) parts.push(case_item.WORKSITE_STATE);
    return parts.join(', ') || 'N/A';
  };

  if (data.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {data.map((item) => (
          <Card key={item.CASE_NUMBER} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    {item.JOB_TITLE || 'N/A'}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{item.EMPLOYER_NAME || 'N/A'}</span>
                  </div>
                  {item.SOC_TITLE && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm">{item.SOC_TITLE}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.FULL_TIME_POSITION && (
                    <Badge variant={item.FULL_TIME_POSITION === 'Y' ? "default" : "secondary"}>
                      {item.FULL_TIME_POSITION === 'Y' ? "Full-time" : "Part-time"}
                    </Badge>
                  )}
                  {item.Year && (
                    <Badge variant="outline">
                      {item.Year}
                    </Badge>
                  )}
                  {item.Quarter && (
                    <Badge variant="outline">
                      {item.Quarter}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{getLocation(item)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold text-green-600">
                    {item.WAGE_RATE_OF_PAY_FROM && item.WAGE_RATE_OF_PAY_TO ? 
                      `${formatSalary(item.WAGE_RATE_OF_PAY_FROM)} - ${formatSalary(item.WAGE_RATE_OF_PAY_TO)}` :
                      formatSalary(item.WAGE_RATE_OF_PAY_FROM)
                    }
                  </span>
                  {item.WAGE_UNIT_OF_PAY && (
                    <span className="text-sm text-gray-500">/{item.WAGE_UNIT_OF_PAY}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(item.BEGIN_DATE)}</span>
                  {item.END_DATE && (
                    <span> - {formatDate(item.END_DATE)}</span>
                  )}
                </div>
              </div>

              {item.CASE_NUMBER && (
                <div className="text-sm text-gray-500 mb-4">
                  Case Number: {item.CASE_NUMBER}
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
