import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HealthcareEmployers from "./pages/HealthcareEmployers";
import H1BCases from "./pages/H1BCases";
import StatesCovered from "./pages/StatesCovered";
import HealthcareOccupations from "./pages/HealthcareOccupations";
import VisaBulletin from "./pages/VisaBulletin";
import H1BCaseDetails from "./pages/H1BCaseDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/healthcare-employers" element={<HealthcareEmployers />} />
          <Route path="/h1b-cases" element={<H1BCases />} />
          <Route path="/states-covered" element={<StatesCovered />} />
          <Route path="/healthcare-occupations" element={<HealthcareOccupations />} />
          <Route path="/current-visa-bulletin" element={<VisaBulletin />} />
          <Route path="/h1b-case/:caseNumber" element={<H1BCaseDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
