import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Download, Info, Loader2, RefreshCw, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import { useVisaBulletinData } from "@/hooks/useVisaBulletinData";
import { useToast } from "@/hooks/use-toast";

const healthcareInfo = [
  {
    category: "EB-2",
    title: "Advanced Degree Medical Professionals",
    description: "Doctors, specialists, research scientists with advanced degrees",
    examples: ["Physicians", "Medical Researchers", "Clinical Scientists", "Pharmacists with PharmD"]
  },
  {
    category: "EB-3",
    title: "Healthcare Skilled Workers",
    description: "Registered nurses, technicians, and other skilled healthcare workers",
    examples: ["Registered Nurses", "Medical Technologists", "Physical Therapists", "Radiologic Technologists"]
  }
];

const VisaBulletin = () => {
  const [selectedTable, setSelectedTable] = useState<'finalAction' | 'filing'>('finalAction');
  const { data: visaBulletinData, syncMetadata, loading, syncing, error, manualSync } = useVisaBulletinData();
  const { toast } = useToast();

  const formatDate = (dateStr: string) => {
    if (dateStr === 'C') return 'Current';
    if (dateStr === 'U') return 'Unavailable';
    
    // Handle date format from database (YYYY-MM-DD)
    if (dateStr && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      });
    }
    
    return dateStr;
  };

  const getCellStyle = (dateStr: string) => {
    if (dateStr === 'C') return 'text-green-600 font-semibold';
    if (dateStr === 'U') return 'text-red-600';
    return 'text-gray-800';
  };

  const handleManualSync = async () => {
    try {
      await manualSync();
      toast({
        title: "Sync Successful",
        description: "Visa bulletin data has been updated",
      });
    } catch (err) {
      toast({
        title: "Sync Failed",
        description: err instanceof Error ? err.message : "An error occurred during sync",
        variant: "destructive",
      });
    }
  };

  const formatLastSync = (dateStr: string | null) => {
    if (!dateStr) return 'Never synced';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'never_synced': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const currentData = selectedTable === 'finalAction' ? 
    (visaBulletinData?.finalActionDates || []) : 
    (visaBulletinData?.filingDates || []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading visa bulletin data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h1>
            <p className="text-gray-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!visaBulletinData || currentData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h1>
            <p className="text-gray-600">No visa bulletin data found in the database.</p>
            <Button 
              onClick={handleManualSync} 
              disabled={syncing}
              className="mt-4"
            >
              {syncing ? 'Syncing...' : 'Sync Data'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-blue-800">Current Visa Bulletin</h1>
                <p className="text-gray-600">Green Card Priority Dates</p>
                <p className="text-sm text-gray-500">Auto-synced from external source</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {syncMetadata && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getSyncStatusIcon(syncMetadata.sync_status)}
                <span>
                  {syncMetadata.sync_status === 'success' 
                    ? `Last updated: ${formatLastSync(syncMetadata.last_sync_at)}`
                    : syncMetadata.sync_status === 'error'
                    ? 'Sync error'
                    : 'Never synced'
                  }
                </span>
              </div>
            )}
            <Button
              onClick={handleManualSync}
              disabled={syncing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Manual Sync'}
            </Button>
          </div>
        </div>

        {/* Healthcare Professional Info */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Info className="h-5 w-5" />
              Healthcare Professionals Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {healthcareInfo.map((info) => (
                <div key={info.category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-semibold">{info.category}</Badge>
                    <h3 className="font-semibold text-gray-800">{info.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{info.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {info.examples.map((example) => (
                      <Badge key={example} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Selection */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={selectedTable === 'finalAction' ? 'default' : 'outline'}
            onClick={() => setSelectedTable('finalAction')}
            className="flex items-center gap-2"
          >
            Final Action Dates
          </Button>
          <Button
            variant={selectedTable === 'filing' ? 'default' : 'outline'}
            onClick={() => setSelectedTable('filing')}
            className="flex items-center gap-2"
          >
            Dates for Filing
          </Button>
          <Button variant="outline" className="ml-auto">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Priority Dates Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedTable === 'finalAction' ? 'Final Action Dates' : 'Dates for Filing Applications'}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {selectedTable === 'finalAction' 
                ? 'Dates when green cards can be issued'
                : 'Dates when applications can be filed'
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Category</TableHead>
                    <TableHead className="w-48">Description</TableHead>
                    <TableHead className="text-center">All Countries</TableHead>
                    <TableHead className="text-center">China</TableHead>
                    <TableHead className="text-center">India</TableHead>
                    <TableHead className="text-center">Mexico</TableHead>
                    <TableHead className="text-center">Philippines</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((row) => (
                    <TableRow key={row.category} className="hover:bg-gray-50">
                      <TableCell className="font-semibold text-blue-700">
                        {row.category}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {row.description}
                      </TableCell>
                      <TableCell className={`text-center ${getCellStyle(row.allCountries)}`}>
                        {formatDate(row.allCountries)}
                      </TableCell>
                      <TableCell className={`text-center ${getCellStyle(row.china)}`}>
                        {formatDate(row.china)}
                      </TableCell>
                      <TableCell className={`text-center ${getCellStyle(row.india)}`}>
                        {formatDate(row.india)}
                      </TableCell>
                      <TableCell className={`text-center ${getCellStyle(row.mexico)}`}>
                        {formatDate(row.mexico)}
                      </TableCell>
                      <TableCell className={`text-center ${getCellStyle(row.philippines)}`}>
                        {formatDate(row.philippines)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Understanding the Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Current (C)</h4>
                <p className="text-sm text-gray-600">All priority dates are current. Green cards available for all applicants in this category.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Specific Date</h4>
                <p className="text-sm text-gray-600">Only applicants with priority dates before this date can proceed.</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Unavailable (U)</h4>
                <p className="text-sm text-gray-600">No green cards available for this category this month.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Source Info */}
        {syncMetadata && (
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 text-sm">Data Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-700">
                <p>Data automatically synchronized from: {syncMetadata.source_url}</p>
                <p>Records updated: {syncMetadata.records_updated}</p>
                {syncMetadata.error_message && (
                  <p className="text-red-600 mt-2">Last error: {syncMetadata.error_message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VisaBulletin;