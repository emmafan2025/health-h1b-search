
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TopRankings = () => {
  const topSponsors = [
    "Mayo Clinic",
    "Kaiser Permanente", 
    "Johns Hopkins Hospital",
    "Cleveland Clinic",
    "Pfizer Inc",
    "Johnson & Johnson",
    "Merck & Co",
    "Abbott Laboratories"
  ];

  const topJobTitles = [
    "Clinical Research Scientist",
    "Data Analyst - Healthcare",
    "Biomedical Engineer", 
    "Clinical Trial Manager",
    "Healthcare Data Analyst",
    "Medical Device Engineer",
    "Pharmaceutical Scientist",
    "Healthcare IT Specialist"
  ];

  const topCities = [
    "New York, NY",
    "Boston, MA",
    "San Francisco, CA",
    "Chicago, IL", 
    "Philadelphia, PA",
    "Los Angeles, CA",
    "Houston, TX",
    "Seattle, WA"
  ];

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top H1B Sponsors */}
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-center text-blue-800">
                Top H1B Sponsors in Healthcare 2025
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {topSponsors.map((sponsor, index) => (
                  <div key={sponsor} className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">
                      {index + 1}
                    </Badge>
                    <span className="text-gray-700 text-sm truncate">{sponsor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Job Titles */}
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-center text-blue-800">
                Top H1B Job Titles in Healthcare 2025
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {topJobTitles.map((title, index) => (
                  <div key={title} className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">
                      {index + 1}
                    </Badge>
                    <span className="text-gray-700 text-sm truncate">{title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Cities */}
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-center text-blue-800">
                Top H1B Cities in Healthcare 2025
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {topCities.map((city, index) => (
                  <div key={city} className="flex items-center gap-2">
                    <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">
                      {index + 1}
                    </Badge>
                    <span className="text-gray-700 text-sm truncate">{city}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TopRankings;
