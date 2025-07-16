import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, DollarSign, Search, Info, Calculator } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

const PrevailingWages = () => {
  const { t } = useTranslation();
  const [showTips, setShowTips] = useState(false);

  const wageCategories = [
    { level: t.prevailingWages.wageLevels.level1.level, description: t.prevailingWages.wageLevels.level1.description, range: t.prevailingWages.wageLevels.level1.range },
    { level: t.prevailingWages.wageLevels.level2.level, description: t.prevailingWages.wageLevels.level2.description, range: t.prevailingWages.wageLevels.level2.range },
    { level: t.prevailingWages.wageLevels.level3.level, description: t.prevailingWages.wageLevels.level3.description, range: t.prevailingWages.wageLevels.level3.range },
    { level: t.prevailingWages.wageLevels.level4.level, description: t.prevailingWages.wageLevels.level4.description, range: t.prevailingWages.wageLevels.level4.range },
  ];

  const quickFacts = t.prevailingWages.quickFacts.facts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            {t.prevailingWages.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.prevailingWages.subtitle}
          </p>
        </div>

        {/* Official Tool Access */}
        <Card className="mb-8 bg-white shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Calculator className="h-6 w-6" />
              {t.prevailingWages.officialTool.title}
            </CardTitle>
            <CardDescription>
              {t.prevailingWages.officialTool.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {t.prevailingWages.officialTool.description}
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" 
              onClick={() => window.open('https://flag.dol.gov/wage-data/wage-search', '_blank')}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              {t.prevailingWages.officialTool.buttonText}
            </Button>
            <p className="text-sm text-gray-600">
              {t.prevailingWages.officialTool.note}
            </p>
          </CardContent>
        </Card>

        {/* Wage Level Explanation */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {t.prevailingWages.wageLevels.title}
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

          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                {t.prevailingWages.quickFacts.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {quickFacts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{fact}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Search Tips */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {t.prevailingWages.searchTips.title}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowTips(!showTips)}
              className="ml-auto"
            >
              {showTips ? t.prevailingWages.searchTips.hideTips : t.prevailingWages.searchTips.showTips}
            </Button>
          </CardHeader>
          {showTips && (
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">{t.prevailingWages.searchTips.commonCodes}</h4>
                  <ul className="space-y-2 text-sm">
                    <li><code className="bg-blue-50 px-2 py-1 rounded text-blue-800">29-1141</code> - {t.prevailingWages.searchTips.codes.nurses}</li>
                    <li><code className="bg-blue-50 px-2 py-1 rounded text-blue-800">29-1021</code> - {t.prevailingWages.searchTips.codes.dentists}</li>
                    <li><code className="bg-blue-50 px-2 py-1 rounded text-blue-800">29-1131</code> - {t.prevailingWages.searchTips.codes.veterinarians}</li>
                    <li><code className="bg-blue-50 px-2 py-1 rounded text-blue-800">29-1126</code> - {t.prevailingWages.searchTips.codes.respiratoryTherapists}</li>
                    <li><code className="bg-blue-50 px-2 py-1 rounded text-blue-800">29-1122</code> - {t.prevailingWages.searchTips.codes.occupationalTherapists}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">{t.prevailingWages.searchTips.strategy}</h4>
                  <ul className="space-y-2 text-sm">
                    {t.prevailingWages.searchTips.tips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            <strong>{t.prevailingWages.footerNote.important}</strong> {t.prevailingWages.footerNote.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrevailingWages;