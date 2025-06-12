
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, DollarSign, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface H1BCase {
  id: string;
  employerName: string;
  jobTitle: string;
  location: string;
  salary: number;
  caseStatus: string;
  submissionDate: string;
  employerType: string;
}

interface SearchResultsProps {
  data: H1BCase[];
}

const SearchResults = ({ data }: SearchResultsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "denied":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "denied":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (data.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-800">
          Search Results ({data.length} found)
        </h2>
      </div>

      <div className="grid gap-4">
        {data.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    {item.jobTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{item.employerName}</span>
                    <Badge variant="outline" className="ml-2">
                      {item.employerType}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.caseStatus)}
                  <Badge className={getStatusColor(item.caseStatus)}>
                    {item.caseStatus}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold text-green-600">
                    {formatSalary(item.salary)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(item.submissionDate)}</span>
                </div>
              </div>

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
