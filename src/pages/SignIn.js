import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";
import api from "../utils/api";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [showCredentials, setShowCredentials] = useState(false);
  const { signin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const response = await api.get("/auth/credentials");
      setCredentials(response.data.credentials || []);
    } catch (error) {
      console.error("Error fetching credentials:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const user = await signin(formData.email, formData.password);

      // Redirect based on role
      const redirectMap = {
        admin: "/admin/dashboard",
        user: "/user/dashboard",
        owner: "/owner/dashboard",
      };

      navigate(redirectMap[user.role] || "/signin");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email) => {
    setFormData((prev) => ({ ...prev, email }));
  };

  const groupedCredentials = {
    admin: credentials.filter((c) => c.role === "admin"),
    owner: credentials.filter((c) => c.role === "owner"),
    user: credentials.filter((c) => c.role === "user"),
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button disabled={loading} type="submit" className="btn-primary">
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>

        <div className="credentials-section">
          <button
            type="button"
            className="credentials-toggle"
            onClick={() => setShowCredentials(!showCredentials)}
          >
            {showCredentials ? "▼" : "▶"} View All User Accounts (
            {credentials.length})
          </button>

          {showCredentials && (
            <div className="credentials-list">
              <p className="credentials-note">
                📝 Click on any email to auto-fill. Remember to use your set
                password.
              </p>

              {groupedCredentials.admin.length > 0 && (
                <div className="credential-group">
                  <h4>👑 Administrators ({groupedCredentials.admin.length})</h4>
                  {groupedCredentials.admin.map((cred, index) => (
                    <div
                      key={index}
                      className="credential-item"
                      onClick={() => fillCredentials(cred.email)}
                    >
                      <div className="cred-info">
                        <strong>{cred.name}</strong>
                        <span className="cred-email">{cred.email}</span>
                      </div>
                      <div className="cred-password">🔑 {cred.password}</div>
                    </div>
                  ))}
                </div>
              )}

              {groupedCredentials.owner.length > 0 && (
                <div className="credential-group">
                  <h4>🏪 Store Owners ({groupedCredentials.owner.length})</h4>
                  {groupedCredentials.owner.map((cred, index) => (
                    <div
                      key={index}
                      className="credential-item"
                      onClick={() => fillCredentials(cred.email)}
                    >
                      <div className="cred-info">
                        <strong>{cred.name}</strong>
                        <span className="cred-email">{cred.email}</span>
                      </div>
                      <div className="cred-password">🔑 {cred.password}</div>
                    </div>
                  ))}
                </div>
              )}

              {groupedCredentials.user.length > 0 && (
                <div className="credential-group">
                  <h4>👤 Users ({groupedCredentials.user.length})</h4>
                  {groupedCredentials.user.map((cred, index) => (
                    <div
                      key={index}
                      className="credential-item"
                      onClick={() => fillCredentials(cred.email)}
                    >
                      <div className="cred-info">
                        <strong>{cred.name}</strong>
                        <span className="cred-email">{cred.email}</span>
                      </div>
                      <div className="cred-password">🔑 {cred.password}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
