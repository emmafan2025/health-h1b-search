import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, DollarSign, Search, Info, Calculator } from "lucide-react";

const PrevailingWages = () => {
  const [showTips, setShowTips] = useState(false);

  const wageCategories = [
    { level: "Level I", description: "Entry Level", range: "10th - 25th percentile" },
    { level: "Level II", description: "Qualified", range: "25th - 50th percentile" },
    { level: "Level III", description: "Experienced", range: "50th - 75th percentile" },
    { level: "Level IV", description: "Fully Competent", range: "75th - 90th percentile" },
  ];

  const quickFacts = [
    "Prevailing wages are determined by the Department of Labor (DOL)",
    "Wages vary by geographic area, occupation, and skill level",
    "H1B petitions must meet or exceed the prevailing wage",
    "Healthcare occupations often have higher prevailing wages",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Prevailing Wages for Healthcare H1B
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find the official prevailing wage rates for healthcare positions across the United States. 
            Essential information for H1B visa applications and salary negotiations.
          </p>
        </div>

        {/* Official Tool Access - Embedded */}
        <Card className="mb-8 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Calculator className="h-6 w-6" />
              Official DOL Wage Search Tool
            </CardTitle>
            <CardDescription>
              Interactive access to the Department of Labor's official prevailing wage database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <iframe
                src="https://flag.dol.gov/wage-data/wage-search"
                className="w-full h-[800px] border border-border rounded-lg"
                title="DOL Wage Search Tool"
                loading="lazy"
                allow="same-origin"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
              <div className="absolute top-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://flag.dol.gov/wage-data/wage-search', '_blank')}
                  className="bg-background/80 backdrop-blur-sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              If the tool doesn't load properly, click "Open in New Tab" to access it directly.
            </p>
          </CardContent>
        </Card>

        {/* Wage Level Explanation */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Wage Levels Explained
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wageCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <Badge variant="outline" className="mb-1">
                        {category.level}
                      </Badge>
                      <p className="font-medium">{category.description}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {category.range}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Quick Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {quickFacts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{fact}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Search Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Tips for Healthcare Professionals
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowTips(!showTips)}
              className="ml-auto"
            >
              {showTips ? 'Hide' : 'Show'} Tips
            </Button>
          </CardHeader>
          {showTips && (
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Common Healthcare SOC Codes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li><code className="bg-muted px-2 py-1 rounded">29-1141</code> - Registered Nurses</li>
                    <li><code className="bg-muted px-2 py-1 rounded">29-1021</code> - Dentists</li>
                    <li><code className="bg-muted px-2 py-1 rounded">29-1131</code> - Veterinarians</li>
                    <li><code className="bg-muted px-2 py-1 rounded">29-1126</code> - Respiratory Therapists</li>
                    <li><code className="bg-muted px-2 py-1 rounded">29-1122</code> - Occupational Therapists</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Search Strategy:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Use specific job titles from your offer letter</li>
                    <li>• Select the correct geographic area (MSA/County)</li>
                    <li>• Choose appropriate wage level based on experience</li>
                    <li>• Verify the survey source and date</li>
                    <li>• Consider both OES and alternative wage sources</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> Prevailing wage determinations are legally binding for H1B applications. 
            Always verify the latest data from the official DOL sources. This tool provides quick access to 
            official government data but does not constitute legal advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrevailingWages;