import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import StoresList from "./pages/StoresList";
import UpdatePassword from "./pages/UpdatePassword";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleBasedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/user/stores"
            element={
              <RoleBasedRoute allowedRoles={["user"]}>
                <StoresList />
              </RoleBasedRoute>
            }
          />

          {/* Owner Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </RoleBasedRoute>
            }
          />

          {/* Common Routes */}
          <Route
            path="/update-password"
            element={
              <RoleBasedRoute allowedRoles={["admin", "user", "owner"]}>
                <UpdatePassword />
              </RoleBasedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
