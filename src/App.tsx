import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmpresaDashboard from "./pages/EmpresaDashboard";
import EntregadorDashboard from "./pages/EntregadorDashboard";
import NewDelivery from "./pages/NewDelivery";
import DeliveryDetail from "./pages/DeliveryDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (user && profile) {
    return <Navigate to={profile.user_type === "motoboy" ? "/motoboy" : "/restaurant"} replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/restaurant" element={<ProtectedRoute requiredType="restaurant"><EmpresaDashboard /></ProtectedRoute>} />
            <Route path="/restaurant/new-delivery" element={<ProtectedRoute requiredType="restaurant"><NewDelivery /></ProtectedRoute>} />
            <Route path="/motoboy" element={<ProtectedRoute requiredType="motoboy"><EntregadorDashboard /></ProtectedRoute>} />
            <Route path="/delivery/:id" element={<ProtectedRoute><DeliveryDetail /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
