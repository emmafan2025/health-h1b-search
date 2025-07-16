
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/contexts/TranslationContext";

const TopRankings = () => {
  const { t } = useTranslation();
  // Real data from Supabase (2025 healthcare H1B cases)
  const topSponsors = [
    "Grandison Management, Inc.",
    "Avant Healthcare Professionals, LLC.",
    "UPMC Medical Education",
    "Indiana University Health Care Associates, Inc.",
    "The University of Iowa",
    "MAYO CLINIC",
    "ARUP Laboratories",
    "Ochsner Clinic Foundation"
  ];

  const topJobTitles = [
    "Medical Technologist",
    "Physical Therapist",
    "Hospitalist",
    "Hospitalist Physician",
    "Physician",
    "Medical Laboratory Scientist",
    "Assistant Professor",
    "Dentist"
  ];

  const topCities = [
    "Boston, MA",
    "Bronx, NY",
    "New York, NY",
    "Chicago, IL",
    "Pittsburgh, PA",
    "Cleveland, OH",
    "Salt Lake City, UT",
    "Brooklyn, NY"
  ];

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top H1B Sponsors */}
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-center text-blue-800">
                {t.rankings.topSponsors}
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
                {t.rankings.topJobTitles}
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
                {t.rankings.topCities}
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
