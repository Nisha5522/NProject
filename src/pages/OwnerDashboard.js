import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";
import api from "../utils/api";

function OwnerDashboard() {
  const { currentUser, signout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await api.get("/stores/owner/ratings");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signout();
    navigate("/signin");
  };

  const getFilteredRatings = () => {
    if (!data || !data.ratings) return [];

    return data.ratings.filter((rating) => {
      const matchesSearch =
        rating.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rating.user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterRating === "all" || rating.rating === parseInt(filterRating);
      return matchesSearch && matchesFilter;
    });
  };

  const getRatingDistribution = () => {
    if (!data || !data.ratings) return {};

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.ratings.forEach((rating) => {
      distribution[rating.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  const filteredRatings = getFilteredRatings();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="owner-dashboard">
      <div className="owner-sidebar">
        <div className="sidebar-header">
          <div className="logo">🏪 Store Owner</div>
          <div className="owner-info">
            <div className="owner-avatar">
              {currentUser?.name?.charAt(0) || "O"}
            </div>
            <div className="owner-details">
              <p className="owner-name">{currentUser?.name}</p>
              <p className="owner-role">Store Owner</p>
            </div>
          </div>
        </div>

        <div className="store-info-card">
          <div className="store-info-header">
            <span className="store-icon-large">🏪</span>
            <h3>{data?.store?.name}</h3>
          </div>
          <div className="store-info-details">
            <div className="store-info-item">
              <span className="info-icon">📍</span>
              <span className="info-text">{data?.store?.address}</span>
            </div>
            <div className="store-info-item">
              <span className="info-icon">📧</span>
              <span className="info-text">{data?.store?.email}</span>
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

      <div className="owner-main">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Store Performance</h1>
            <p className="page-subtitle">
              Monitor your store ratings and customer feedback
            </p>
          </div>
        </div>

        {data && (
          <div className="dashboard-content">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card rating-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <p className="stat-label">Average Rating</p>
                  <p className="stat-value">
                    {parseFloat(data.store.averageRating).toFixed(2)}
                  </p>
                  <p className="stat-change">Out of 5.0</p>
                </div>
              </div>
              <div className="stat-card reviews-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <p className="stat-label">Total Reviews</p>
                  <p className="stat-value">{data.store.totalRatings}</p>
                  <p className="stat-change">Customer ratings</p>
                </div>
              </div>
              <div className="stat-card customers-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <p className="stat-label">Unique Customers</p>
                  <p className="stat-value">{data.ratings.length}</p>
                  <p className="stat-change">Who rated</p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="rating-distribution-card">
              <h3>📈 Rating Distribution</h3>
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingDistribution[star] || 0;
                  const percentage =
                    data.ratings.length > 0
                      ? (count / data.ratings.length) * 100
                      : 0;
                  return (
                    <div key={star} className="rating-bar-item">
                      <span className="rating-bar-label">{star} ⭐</span>
                      <div className="rating-bar-container">
                        <div
                          className="rating-bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="rating-bar-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ratings Table */}
            <div className="ratings-section">
              <div className="section-header">
                <h3>💬 Customer Reviews</h3>
                <div className="section-filters">
                  <div className="search-box-inline">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input-inline"
                    />
                  </div>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>

              {filteredRatings.length === 0 ? (
                <div className="no-ratings-card">
                  <div className="no-ratings-icon">📭</div>
                  <h4>No reviews found</h4>
                  <p>No ratings match your current filters</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>👤 Customer</th>
                        <th>📧 Email</th>
                        <th>⭐ Rating</th>
                        <th>📅 Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRatings.map((rating) => (
                        <tr key={rating.id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar-sm">
                                {rating.user.name.charAt(0)}
                              </div>
                              <span className="user-name">
                                {rating.user.name}
                              </span>
                            </div>
                          </td>
                          <td className="email-cell">{rating.user.email}</td>
                          <td>
                            <div className="rating-stars-display">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < rating.rating
                                      ? "star-filled"
                                      : "star-empty"
                                  }
                                >
                                  ⭐
                                </span>
                              ))}
                              <span className="rating-number">
                                ({rating.rating})
                              </span>
                            </div>
                          </td>
                          <td className="date-cell">
                            {new Date(rating.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
