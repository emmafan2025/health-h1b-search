import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, DollarSign, Calendar, Briefcase, FileText, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { H1BCase } from "@/types/h1b";

const H1BCaseDetails = () => {
  const { caseNumber } = useParams<{ caseNumber: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<H1BCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!caseNumber) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('healthcare_h1b_cases')
          .select('*')
          .eq('CASE_NUMBER', decodeURIComponent(caseNumber))
          .single();

        if (error) throw error;
        setCaseData(data as H1BCase);
      } catch (err) {
        console.error('Error fetching case details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load case details');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseNumber]);

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
      month: 'long',
      day: 'numeric'
    });
  };

  const getFullAddress = (caseData: H1BCase) => {
    const parts = [];
    if (caseData.WORKSITE_ADDRESS1) parts.push(caseData.WORKSITE_ADDRESS1);
    if (caseData.WORKSITE_CITY) parts.push(caseData.WORKSITE_CITY);
    if (caseData.WORKSITE_STATE) parts.push(caseData.WORKSITE_STATE);
    if (caseData.WORKSITE_POSTAL_CODE) parts.push(caseData.WORKSITE_POSTAL_CODE);
    return parts.join(', ') || 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading case details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || 'Case not found'}</p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-800">{caseData.JOB_TITLE || 'H1B Case Details'}</h1>
            <p className="text-gray-600">Case Number: {caseData.CASE_NUMBER}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Case Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Job Title</p>
                    <p className="font-semibold">{caseData.JOB_TITLE || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employer</p>
                    <p className="font-semibold">{caseData.EMPLOYER_NAME || 'N/A'}</p>
                  </div>
                  {caseData.TRADE_NAME_DBA && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Trade Name (DBA)</p>
                      <p className="font-semibold">{caseData.TRADE_NAME_DBA}</p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex flex-wrap gap-2">
                  {caseData.FULL_TIME_POSITION && (
                    <Badge variant={caseData.FULL_TIME_POSITION === 'Y' ? "default" : "secondary"}>
                      {caseData.FULL_TIME_POSITION === 'Y' ? "Full-time" : "Part-time"}
                    </Badge>
                  )}
                  {caseData.Year && (
                    <Badge variant="outline">{caseData.Year}</Badge>
                  )}
                  {caseData.Quarter && (
                    <Badge variant="outline">{caseData.Quarter}</Badge>
                  )}
                  {caseData.PW_WAGE_LEVEL && (
                    <Badge variant="outline">Wage Level {caseData.PW_WAGE_LEVEL}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">SOC Code</p>
                    <p className="font-semibold">{caseData.SOC_CODE || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">SOC Title</p>
                    <p className="font-semibold">{caseData.SOC_TITLE || 'N/A'}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      Wage Rate: {caseData.WAGE_RATE_OF_PAY_FROM && caseData.WAGE_RATE_OF_PAY_TO ? 
                        `${formatSalary(caseData.WAGE_RATE_OF_PAY_FROM)} - ${formatSalary(caseData.WAGE_RATE_OF_PAY_TO)}` :
                        formatSalary(caseData.WAGE_RATE_OF_PAY_FROM)
                      }
                      {caseData.WAGE_UNIT_OF_PAY && ` per ${caseData.WAGE_UNIT_OF_PAY}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>
                      Employment Period: {formatDate(caseData.BEGIN_DATE)}
                      {caseData.END_DATE && ` - ${formatDate(caseData.END_DATE)}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Work Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Full Address</p>
                    <p className="font-semibold">{getFullAddress(caseData)}</p>
                  </div>
                  
                  {caseData.WORKSITE_COUNTY && (
                    <div>
                      <p className="text-sm text-gray-600">County</p>
                      <p className="font-semibold">{caseData.WORKSITE_COUNTY}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Position Type</span>
                  <span className="font-semibold">
                    {caseData.FULL_TIME_POSITION === 'Y' ? 'Full-time' : 'Part-time'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Filing Year</span>
                  <span className="font-semibold">{caseData.Year || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quarter</span>
                  <span className="font-semibold">{caseData.Quarter || 'N/A'}</span>
                </div>
                {caseData.PW_WAGE_LEVEL && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Wage Level</span>
                    <span className="font-semibold">{caseData.PW_WAGE_LEVEL}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                  }}
                >
                  Share Case
                </Button>
                <Link to={`/?search=${encodeURIComponent(caseData.EMPLOYER_NAME || '')}`}>
                  <Button variant="outline" className="w-full">
                    More from this Employer
                  </Button>
                </Link>
                <Link to={`/?search=${encodeURIComponent(caseData.SOC_TITLE || '')}`}>
                  <Button variant="outline" className="w-full">
                    Similar Occupations
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default H1BCaseDetails;