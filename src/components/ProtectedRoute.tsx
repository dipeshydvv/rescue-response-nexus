
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ("admin" | "volunteer" | "ndrf")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (!allowedRoles.includes(userProfile.role)) {
    // Redirect to appropriate dashboard based on role
    switch (userProfile.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "volunteer":
        return <Navigate to="/volunteer" replace />;
      case "ndrf":
        return <Navigate to="/ndrf" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
