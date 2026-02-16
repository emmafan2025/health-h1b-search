import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, DollarSign, Briefcase, GraduationCap, Calendar } from "lucide-react";
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
                {/* Employer & Status */}
                <div className="flex items-start gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600 shrink-0" />
                    {item.employer_name || "Unknown Employer"}
                  </h3>
                  {item.case_status && (
                    <Badge className={`${statusColor(item.case_status)} border-0`}>
                      {item.case_status}
                    </Badge>
                  )}
                </div>

                {/* Job Title */}
                {item.job_title && (
                  <p className="text-base text-gray-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                    {item.job_title}
                    {item.pw_soc_title && <span className="text-sm text-gray-500">({item.pw_soc_title})</span>}
                  </p>
                )}

                {/* Location */}
                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                  {(item.worksite_city || item.worksite_state) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {[item.worksite_city, item.worksite_state].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {item.minimum_education && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4 text-orange-500" />
                      {item.minimum_education}
                    </span>
                  )}
                  {item.decision_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {item.decision_date}
                    </span>
                  )}
                </div>
              </div>

              {/* Salary */}
              <div className="text-right shrink-0">
                {item.wage_offer_from && (
                  <div className="flex items-center gap-1 justify-end">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-green-700">
                      {formatSalary(item.wage_offer_from, item.wage_offer_unit_of_pay)}
                    </span>
                  </div>
                )}
                {item.wage_offer_to && item.wage_offer_to !== item.wage_offer_from && (
                  <p className="text-sm text-gray-500">
                    up to {formatSalary(item.wage_offer_to, item.wage_offer_unit_of_pay)}
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
