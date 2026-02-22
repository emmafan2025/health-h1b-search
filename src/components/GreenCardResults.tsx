import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, DollarSign, Briefcase, Calendar } from "lucide-react";
import { GreenCardCase } from "@/hooks/useGreenCardData";

interface GreenCardResultsProps {
  data: GreenCardCase[];
}

const formatSalary = (amount: number | null, unit: string | null) => {
  if (!amount) return null;
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  return unit ? `${formatted}/${unit}` : formatted;
};

const statusColor = (status: string | null) => {
  if (!status) return "bg-gray-100 text-gray-700";
  const s = status.toLowerCase();
  if (s.includes("certified")) return "bg-green-100 text-green-700";
  if (s.includes("denied")) return "bg-red-100 text-red-700";
  if (s.includes("withdrawn")) return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-700";
};

const GreenCardResults = ({ data }: GreenCardResultsProps) => {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card key={item.record_id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600 shrink-0" />
                    {item.emp_business_name || "Unknown Employer"}
                  </h3>
                  {item.case_status && (
                    <Badge className={`${statusColor(item.case_status)} border-0`}>
                      {item.case_status}
                    </Badge>
                  )}
                </div>

                {item.job_title && (
                  <p className="text-base text-gray-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                    {item.job_title}
                    {item.pwd_soc_title && <span className="text-sm text-gray-500">({item.pwd_soc_title})</span>}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                  {(item.primary_worksite_city || item.primary_worksite_state) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {[item.primary_worksite_city, item.primary_worksite_state].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {item.occupation_type && (
                    <span className="text-sm text-gray-500">{item.occupation_type}</span>
                  )}
                  {item.decision_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {item.decision_date}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                {item.job_opp_wage_from && (
                  <div className="flex items-center gap-1 justify-end">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-green-700">
                      {formatSalary(item.job_opp_wage_from, item.job_opp_wage_per)}
                    </span>
                  </div>
                )}
                {item.job_opp_wage_to && item.job_opp_wage_to !== item.job_opp_wage_from && (
                  <p className="text-sm text-gray-500">
                    up to {formatSalary(item.job_opp_wage_to, item.job_opp_wage_per)}
                  </p>
                )}
                {item.case_number && (
                  <p className="text-xs text-gray-400 mt-1">{item.case_number}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GreenCardResults;
