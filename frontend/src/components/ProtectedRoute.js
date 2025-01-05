import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is logged in by verifying token in localStorage
  const email = localStorage.getItem("email");

  if (!email) {
    return <Navigate to="/login" />;
  }
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
