import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DisasterReportProvider } from "@/contexts/DisasterReportContext";

// Public Pages
import HomePage from "@/pages/HomePage";
import ReportDisaster from "@/pages/ReportDisaster";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFound from "@/pages/NotFound";

// Admin Pages 
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminReportDetails from "@/pages/admin/ReportDetails";

// Volunteer Pages
import VolunteerDashboard from "@/pages/volunteer/Dashboard";
import VolunteerReportDetails from "@/pages/volunteer/ReportDetails";

// NDRF Pages
import NDRFDashboard from "@/pages/ndrf/Dashboard";
import NDRFReportDetails from "@/pages/ndrf/ReportDetails";

// Protected Route Component
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DisasterReportProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/report" element={<ReportDisaster />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/report/:id" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminReportDetails />
                  </ProtectedRoute>
                } 
              />
              
              {/* Volunteer Routes */}
              <Route 
                path="/volunteer" 
                element={
                  <ProtectedRoute allowedRoles={["volunteer"]}>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/volunteer/report/:id" 
                element={
                  <ProtectedRoute allowedRoles={["volunteer"]}>
                    <VolunteerReportDetails />
                  </ProtectedRoute>
                } 
              />
              
              {/* NDRF Routes */}
              <Route 
                path="/ndrf" 
                element={
                  <ProtectedRoute allowedRoles={["ndrf"]}>
                    <NDRFDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ndrf/report/:id" 
                element={
                  <ProtectedRoute allowedRoles={["ndrf"]}>
                    <NDRFReportDetails />
                  </ProtectedRoute>
                } 
              />
              
              {/* Route Redirects */}
              <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
              <Route path="/volunteer/*" element={<Navigate to="/volunteer" replace />} />
              <Route path="/ndrf/*" element={<Navigate to="/ndrf" replace />} />
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DisasterReportProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
