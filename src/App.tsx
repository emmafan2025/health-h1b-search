import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HealthcareEmployers from "./pages/HealthcareEmployers";
import H1BCases from "./pages/H1BCases";
import StatesCovered from "./pages/StatesCovered";
import HealthcareOccupations from "./pages/HealthcareOccupations";
import VisaBulletin from "./pages/VisaBulletin";
import H1BCaseDetails from "./pages/H1BCaseDetails";
import PrevailingWages from "./pages/PrevailingWages";
import Forum from "./pages/Forum";
import Auth from "./pages/Auth";
import GreenCardSearch from "./pages/GreenCardSearch";
import H1BFaq from "./pages/H1BFaq";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
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
            <Route path="/prevailing-wages" element={<PrevailingWages />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/green-card-search" element={<GreenCardSearch />} />
            <Route path="/faq/h1b" element={<H1BFaq />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/h1b-case/:caseNumber" element={<H1BCaseDetails />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
