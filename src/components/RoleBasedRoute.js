import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleBasedRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectMap = {
      admin: "/admin/dashboard",
      user: "/user/dashboard",
      owner: "/owner/dashboard",
    };
    return <Navigate to={redirectMap[currentUser.role] || "/signin"} replace />;
  }

  return children;
}

export default RoleBasedRoute;
