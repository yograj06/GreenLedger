import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DemoStoreProvider } from "@/state/demoStore";
import Index from "./pages/Index";
import Farmer from "./pages/Farmer";
import Transporter from "./pages/Transporter";
import Retailer from "./pages/Retailer";
import Admin from "./pages/Admin";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import ManageInventory from "./components/retailer/ManageInventory";
import TrackDeliveries from "./components/retailer/TrackDeliveries";
import VerificationHistory from "./components/retailer/VerificationHistory";
import ManualEntry from "./components/retailer/ManualEntry";
import ManageUsers from "./components/admin/ManageUsers";
import GenerateReport from "./components/admin/GenerateReport";
import ViewAllAlerts from "./components/admin/ViewAllAlerts";
import PaymentDashboard from "./pages/PaymentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <DemoStoreProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/farmer" element={<Farmer />} />
              <Route path="/transporter" element={<Transporter />} />
              <Route path="/retailer" element={<Retailer />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/verify/:code?" element={<Verify />} />
              <Route path="/manage-inventory" element={<ManageInventory />} />
              <Route path="/track-deliveries" element={<TrackDeliveries />} />
              <Route path="/verification-history" element={<VerificationHistory />} />
              <Route path="/manual-entry" element={<ManualEntry />} />
              <Route path="/manage-users" element={<ManageUsers />} />
              <Route path="/generate-report" element={<GenerateReport />} />
              <Route path="/view-alerts" element={<ViewAllAlerts />} />
              <Route path="/payments" element={<PaymentDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </DemoStoreProvider>
    </TooltipProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App;
