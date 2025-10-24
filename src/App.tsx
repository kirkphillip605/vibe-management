import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CustomersPage from "./pages/dashboard/Customers";
import VenuesPage from "./pages/dashboard/Venues";
import GigsPage from "./pages/dashboard/Gigs";
import DJsPage from "./pages/dashboard/DJs";
import BillingPage from "./pages/dashboard/Billing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/customers" element={<CustomersPage />} />
          <Route path="/dashboard/venues" element={<VenuesPage />} />
          <Route path="/dashboard/gigs" element={<GigsPage />} />
          <Route path="/dashboard/djs" element={<DJsPage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
