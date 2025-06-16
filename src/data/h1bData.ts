
setData((queryResult as any[])?.map(item => ({
  id: item.id,
  employerName: item.employer_name,
  jobTitle: item.job_title,
  location: `${item.worksite_city}, ${item.worksite_state}`,
  salary: item.wage_rate_of_pay_from,
  caseStatus: 'Approved', // 如果你数据库没有这个字段，可以写死
  submissionDate: item.begin_date,
  employerType: item.trade_name_dba || 'Unknown'
})) || []);

// Replace this with your actual H1B healthcare data
export interface H1BCase {
  id: string;
  employerName: string;
  jobTitle: string;
  location: string;
  salary: number;
  caseStatus: string;
  submissionDate: string;
  employerType: string;
}

// TODO: Replace this mock data with your actual H1B healthcare data
// You can copy your Excel data here in this format
export const h1bHealthcareData: H1BCase[] = [
  {
    id: "1",
    employerName: "Mayo Clinic",
    jobTitle: "Clinical Research Scientist",
    location: "Rochester, MN",
    salary: 95000,
    caseStatus: "Approved",
    submissionDate: "2024-03-15",
    employerType: "Hospital"
  },
  {
    id: "2", 
    employerName: "Kaiser Permanente",
    jobTitle: "Data Analyst - Healthcare",
    location: "Oakland, CA",
    salary: 87000,
    caseStatus: "Approved",
    submissionDate: "2024-02-20",
    employerType: "Health Insurance"
  },
  {
    id: "3",
    employerName: "Johns Hopkins Hospital", 
    jobTitle: "Biomedical Engineer",
    location: "Baltimore, MD",
    salary: 102000,
    caseStatus: "Approved",
    submissionDate: "2024-01-10",
    employerType: "Hospital"
  },
  {
    id: "4",
    employerName: "Pfizer Inc",
    jobTitle: "Clinical Trial Manager",
    location: "New York, NY", 
    salary: 115000,
    caseStatus: "Approved",
    submissionDate: "2024-04-05",
    employerType: "Pharmaceutical"
  }
  // Add more of your actual data records here...
];

// Statistics calculated from your data - update these when you add your real data
export const dataStats = {
  totalEmployers: 1250,
  totalCases: 15600,
  statesCovered: 50,
  averageSalary: 95000
};

// Popular employers for the homepage badges - update with your most common employers
export const popularEmployers = [
  "Mayo Clinic",
  "Kaiser Permanente", 
  "Johns Hopkins",
  "Cleveland Clinic",
  "Pfizer",
  "Johnson & Johnson"
];
