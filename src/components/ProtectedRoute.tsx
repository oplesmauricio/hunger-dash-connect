import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredType?: "restaurant" | "motoboy";
}

const ProtectedRoute = ({ children, requiredType }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredType && profile && profile.user_type !== requiredType) {
    return <Navigate to={profile.user_type === "motoboy" ? "/motoboy" : "/restaurant"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
