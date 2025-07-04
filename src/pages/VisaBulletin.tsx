import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Download, Info } from "lucide-react";
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

// Current visa bulletin data (January 2025)
const currentBulletinData = {
  bulletinDate: "January 2025",
  lastUpdated: "January 9, 2025",
  finalActionDates: [
    {
      category: "EB-1",
      description: "Priority Workers",
      allCountries: "C",
      china: "C",
      india: "C",
      mexico: "C",
      philippines: "C"
    },
    {
      category: "EB-2",
      description: "Advanced Degree Professionals",
      allCountries: "C",
      china: "01APR19",
      india: "01SEP12",
      mexico: "C",
      philippines: "C"
    },
    {
      category: "EB-3",
      description: "Skilled Workers",
      allCountries: "C",
      china: "01APR19",
      india: "01JAN12",
      mexico: "C",
      philippines: "C"
    },
    {
      category: "EB-4",
      description: "Special Immigrants",
      allCountries: "C",
      china: "C",
      india: "C",
      mexico: "C",
      philippines: "C"
    },
    {
      category: "EB-5",
      description: "Investors",
      allCountries: "C",
      china: "22NOV15",
      india: "C",
      mexico: "C",
      philippines: "C"
    }
  ],
  filingDates: [
    {
      category: "EB-1",
      description: "Priority Workers",
      allCountries: "C",
      china: "C",
      india: "C",
      mexico: "C",
      philippines: "C"
    },
    {
      category: "EB-2",
      description: "Advanced Degree Professionals",
      allCountries: "C",
      china: "01MAY19",
      india: "01JUL13",
      mexico: "C",
      philippines: "C"
    },
    {
      category: "EB-3",
      description: "Skilled Workers",
      allCountries: "C",
      china: "01MAY19",
      india: "01FEB12",
      mexico: "C",
      philippines: "C"
    },
    {
      category: "EB-4",
      description: "Special Immigrants",
      allCountries: "C",
      china: "C",
      india: "C",
      mexico: "C",
      philippines: "C"
    },
    {
      category: "EB-5",
      description: "Investors",
      allCountries: "C",
      china: "22DEC15",
      india: "C",
      mexico: "C",
      philippines: "C"
    }
  ]
};

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

  const formatDate = (dateStr: string) => {
    if (dateStr === 'C') return 'Current';
    if (dateStr === 'U') return 'Unavailable';
    return dateStr;
  };

  const getCellStyle = (dateStr: string) => {
    if (dateStr === 'C') return 'text-green-600 font-semibold';
    if (dateStr === 'U') return 'text-red-600';
    return 'text-gray-800';
  };

  const currentData = selectedTable === 'finalAction' ? currentBulletinData.finalActionDates : currentBulletinData.filingDates;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
              <p className="text-gray-600">Green Card Priority Dates - {currentBulletinData.bulletinDate}</p>
              <p className="text-sm text-gray-500">Last updated: {currentBulletinData.lastUpdated}</p>
            </div>
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
      </div>
    </div>
  );
};

export default VisaBulletin;