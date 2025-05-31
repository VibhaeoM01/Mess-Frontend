import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading, isAuthenticated } = useAuth();

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // If not authenticated or user role not allowed, redirect to login
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and role is allowed, show the protected content
  return children;
}