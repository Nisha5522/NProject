import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

function UserDashboard() {
  const { currentUser, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signout();
    navigate("/signin");
  };

  return (
    <div className="user-dashboard">
      <div className="user-sidebar">
        <div className="sidebar-header">
          <div className="logo">⭐ User Portal</div>
          <div className="user-info-sidebar">
            <div className="user-avatar-large">
              {currentUser?.name?.charAt(0) || "U"}
            </div>
            <div className="user-details-sidebar">
              <p className="user-name-sidebar">{currentUser?.name}</p>
              <p className="user-role-sidebar">Customer</p>
            </div>
          </div>
        </div>

        <nav className="user-nav">
          <button className="user-nav-item active">
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Dashboard</span>
          </button>
          <button
            className="user-nav-item"
            onClick={() => navigate("/user/stores")}
          >
            <span className="nav-icon">🏪</span>
            <span className="nav-label">Browse Stores</span>
          </button>
        </nav>

        <div className="user-quick-stats">
          <h4>Quick Info</h4>
          <div className="quick-stat-item">
            <span className="quick-stat-icon">📧</span>
            <div className="quick-stat-info">
              <p className="quick-stat-label">Email</p>
              <p className="quick-stat-value">{currentUser?.email}</p>
            </div>
          </div>
          <div className="quick-stat-item">
            <span className="quick-stat-icon">📍</span>
            <div className="quick-stat-info">
              <p className="quick-stat-label">Location</p>
              <p className="quick-stat-value">{currentUser?.address}</p>
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <button
            onClick={() => navigate("/update-password")}
            className="sidebar-btn"
          >
            🔒 Change Password
          </button>
          <button onClick={handleSignOut} className="sidebar-btn signout">
            🚪 Sign Out
          </button>
        </div>
      </div>

      <div className="user-main">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">
              Welcome back, {currentUser?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="page-subtitle">
              Discover amazing stores and share your experiences
            </p>
          </div>
        </div>

        <div className="user-dashboard-content">
          {/* Hero Card */}
          <div className="hero-card">
            <div className="hero-content">
              <div className="hero-icon">🌟</div>
              <h2>Start Exploring</h2>
              <p>
                Browse through our collection of stores and share your valuable
                feedback with the community
              </p>
              <button
                onClick={() => navigate("/user/stores")}
                className="hero-btn"
              >
                <span>Browse All Stores</span>
                <span className="arrow">→</span>
              </button>
            </div>
            <div className="hero-illustration">
              <div className="floating-icon icon-1">⭐</div>
              <div className="floating-icon icon-2">🏪</div>
              <div className="floating-icon icon-3">💬</div>
              <div className="floating-icon icon-4">🎯</div>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="info-cards-grid">
            <div className="info-card profile-card">
              <div className="info-card-icon">👤</div>
              <h3>Your Profile</h3>
              <div className="info-card-details">
                <div className="detail-row">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{currentUser?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{currentUser?.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{currentUser?.address}</span>
                </div>
              </div>
            </div>

            <div className="info-card features-card">
              <div className="info-card-icon">✨</div>
              <h3>What You Can Do</h3>
              <ul className="features-list">
                <li>
                  <span className="feature-icon">🔍</span>
                  <span>Search and discover stores</span>
                </li>
                <li>
                  <span className="feature-icon">⭐</span>
                  <span>Rate your favorite places</span>
                </li>
                <li>
                  <span className="feature-icon">✏️</span>
                  <span>Update your ratings anytime</span>
                </li>
                <li>
                  <span className="feature-icon">📊</span>
                  <span>View store statistics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action Cards */}
          <div className="cta-cards">
            <div className="cta-card cta-primary">
              <div className="cta-content">
                <h3>🏪 Explore Stores</h3>
                <p>Browse our curated list of stores and find your favorites</p>
              </div>
              <button
                className="cta-btn"
                onClick={() => navigate("/user/stores")}
              >
                Get Started
              </button>
            </div>

            <div className="cta-card cta-secondary">
              <div className="cta-content">
                <h3>🔒 Secure Account</h3>
                <p>
                  Keep your account safe by updating your password regularly
                </p>
              </div>
              <button
                className="cta-btn"
                onClick={() => navigate("/update-password")}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
