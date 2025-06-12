
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import * as XLSX from 'xlsx';

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

interface DataImportProps {
  onDataImport: (data: H1BCase[]) => void;
  onClose: () => void;
}

const DataImport = ({ onDataImport, onClose }: DataImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const parseExcelData = (data: any[]): H1BCase[] => {
    return data.map((row, index) => ({
      id: (index + 1).toString(),
      employerName: row['Employer Name'] || row['employerName'] || '',
      jobTitle: row['Job Title'] || row['jobTitle'] || '',
      location: row['Location'] || row['location'] || '',
      salary: parseInt(row['Salary'] || row['salary'] || '0'),
      caseStatus: row['Case Status'] || row['caseStatus'] || 'Pending',
      submissionDate: row['Submission Date'] || row['submissionDate'] || new Date().toISOString().split('T')[0],
      employerType: row['Employer Type'] || row['employerType'] || 'Other'
    })).filter(item => item.employerName && item.jobTitle);
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to import");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const fileBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("Parsed Excel data:", jsonData);

      if (jsonData.length === 0) {
        setError("The Excel file appears to be empty or has no valid data");
        return;
      }

      const parsedData = parseExcelData(jsonData);
      
      if (parsedData.length === 0) {
        setError("No valid H1B data found. Please ensure your Excel file has columns like 'Employer Name', 'Job Title', 'Location', 'Salary', etc.");
        return;
      }

      console.log("Imported data:", parsedData);
      onDataImport(parsedData);
      onClose();
    } catch (err) {
      console.error("Error importing data:", err);
      setError("Failed to import data. Please ensure the file is a valid Excel format (.xlsx, .xls)");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <FileSpreadsheet className="h-5 w-5" />
          Import H1B Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Select Excel File</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <p className="text-sm text-gray-600">
            Supported formats: .xlsx, .xls
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800 font-medium mb-2">Expected Excel Columns:</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Employer Name</li>
            <li>• Job Title</li>
            <li>• Location</li>
            <li>• Salary</li>
            <li>• Case Status</li>
            <li>• Submission Date</li>
            <li>• Employer Type</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleImport} 
            disabled={!file || isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              "Importing..."
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImport;
