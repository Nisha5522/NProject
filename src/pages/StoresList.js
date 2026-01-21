import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";
import "../styles/stores.css";
import api from "../utils/api";

function StoresList() {
  const { currentUser, signout } = useAuth();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
    sortBy: "averageRating",
    sortOrder: "DESC",
  });
  const [ratingModal, setRatingModal] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/stores?${params}`);
      setStores(response.data.stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (storeId, isUpdate = false) => {
    if (selectedRating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);

      if (isUpdate) {
        const store = stores.find((s) => s.id === storeId);
        await api.put(`/stores/rating/${store.userRatingId}`, {
          rating: selectedRating,
        });
      } else {
        await api.post("/stores/rating", { storeId, rating: selectedRating });
      }

      setRatingModal(null);
      setSelectedRating(0);
      setHoverRating(0);
      fetchStores();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const openRatingModal = (store) => {
    setRatingModal(store);
    setSelectedRating(store.userRating || 0);
    setHoverRating(0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Stores...</p>
      </div>
    );
  }

  const userRatingsCount = stores.filter((s) => s.userRating).length;

  return (
    <div className="stores-page">
      <div className="stores-sidebar">
        <div className="sidebar-header">
          <div className="logo">🏪 Stores</div>
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
          <button
            className="user-nav-item"
            onClick={() => navigate("/user/dashboard")}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Dashboard</span>
          </button>
          <button className="user-nav-item active">
            <span className="nav-icon">🏪</span>
            <span className="nav-label">Browse Stores</span>
          </button>
        </nav>

        <div className="stores-stats-card">
          <h4>Your Activity</h4>
          <div className="stores-stat-item">
            <span className="stores-stat-icon">🏪</span>
            <div className="stores-stat-info">
              <p className="stores-stat-value">{stores.length}</p>
              <p className="stores-stat-label">Total Stores</p>
            </div>
          </div>
          <div className="stores-stat-item">
            <span className="stores-stat-icon">⭐</span>
            <div className="stores-stat-info">
              <p className="stores-stat-value">{userRatingsCount}</p>
              <p className="stores-stat-label">Your Ratings</p>
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
          <button
            onClick={() => {
              signout();
              navigate("/signin");
            }}
            className="sidebar-btn signout"
          >
            🚪 Sign Out
          </button>
        </div>
      </div>

      <div className="stores-main">
        <div className="stores-header">
          <div>
            <h1 className="page-title">Discover Stores</h1>
            <p className="page-subtitle">
              Find and rate your favorite stores in the community
            </p>
          </div>
          <div className="header-stats">
            <div className="header-stat">
              <span className="header-stat-value">{stores.length}</span>
              <span className="header-stat-label">Stores</span>
            </div>
            <div className="header-stat">
              <span className="header-stat-value">{userRatingsCount}</span>
              <span className="header-stat-label">Rated</span>
            </div>
          </div>
        </div>

        <div className="stores-filters-section">
          <div className="search-filters">
            <div className="search-input-group">
              <span className="search-icon-input">🔍</span>
              <input
                type="text"
                placeholder="Search by store name..."
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
                className="search-input-large"
              />
            </div>
            <div className="search-input-group">
              <span className="search-icon-input">📍</span>
              <input
                type="text"
                placeholder="Search by address..."
                value={filters.address}
                onChange={(e) =>
                  setFilters({ ...filters, address: e.target.value })
                }
                className="search-input-large"
              />
            </div>
          </div>

          <div className="sort-filters">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value })
              }
              className="sort-select"
            >
              <option value="averageRating">⭐ Rating</option>
              <option value="name">📝 Name</option>
              <option value="createdAt">📅 Date</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                setFilters({ ...filters, sortOrder: e.target.value })
              }
              className="sort-select"
            >
              <option value="DESC">⬇️ High to Low</option>
              <option value="ASC">⬆️ Low to High</option>
            </select>
          </div>
        </div>

        {stores.length === 0 ? (
          <div className="no-stores-card">
            <div className="no-stores-icon">🏪</div>
            <h3>No stores found</h3>
            <p>Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="stores-grid">
            {stores.map((store) => (
              <div key={store.id} className="store-card-modern">
                <div className="store-card-header">
                  <div className="store-icon-badge">🏪</div>
                  <div className="store-header-info">
                    <h3 className="store-name">{store.name}</h3>
                    <p className="store-address">
                      <span className="address-icon">📍</span>
                      {store.address}
                    </p>
                  </div>
                </div>

                <div className="store-rating-section">
                  <div className="overall-rating">
                    <div className="rating-display-large">
                      <span className="rating-number-large">
                        {parseFloat(store.averageRating).toFixed(1)}
                      </span>
                      <div className="rating-stars-small">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.round(store.averageRating)
                                ? "star-filled-small"
                                : "star-empty-small"
                            }
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="rating-count-text">
                      {store.totalRatings}{" "}
                      {store.totalRatings === 1 ? "review" : "reviews"}
                    </p>
                  </div>

                  {store.userRating ? (
                    <div className="user-rating-badge">
                      <div className="user-rating-info">
                        <span className="user-rating-label">Your Rating</span>
                        <div className="user-rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < store.userRating
                                  ? "star-filled-user"
                                  : "star-empty-user"
                              }
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        className="btn-modify-rating"
                        onClick={() => openRatingModal(store)}
                      >
                        ✏️ Modify
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-rate-store"
                      onClick={() => openRatingModal(store)}
                    >
                      <span>⭐</span>
                      <span>Rate This Store</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {ratingModal && (
        <div
          className="modal-overlay-modern"
          onClick={() => setRatingModal(null)}
        >
          <div
            className="modal-content-modern"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setRatingModal(null)}
            >
              ×
            </button>

            <div className="modal-header-modern">
              <div className="modal-store-icon">🏪</div>
              <h3>
                {ratingModal.userRating
                  ? "Update Your Rating"
                  : "Rate This Store"}
              </h3>
              <p className="modal-store-name">{ratingModal.name}</p>
            </div>

            <div className="rating-selector-modern">
              <p className="rating-prompt">How would you rate this store?</p>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`star-button ${(hoverRating || selectedRating) >= num ? "star-active" : ""}`}
                    onClick={() => setSelectedRating(num)}
                    onMouseEnter={() => setHoverRating(num)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <div className="rating-labels">
                <span className="rating-label-text">Poor</span>
                <span className="rating-label-text">Excellent</span>
              </div>
              {selectedRating > 0 && (
                <p className="selected-rating-text">
                  You selected:{" "}
                  <strong>
                    {selectedRating} star{selectedRating > 1 ? "s" : ""}
                  </strong>
                </p>
              )}
            </div>

            <div className="modal-actions-modern">
              <button
                className="btn-modal-cancel"
                onClick={() => setRatingModal(null)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn-modal-submit"
                onClick={() =>
                  handleRatingSubmit(ratingModal.id, !!ratingModal.userRating)
                }
                disabled={submitting || selectedRating === 0}
              >
                {submitting ? (
                  <>
                    <span className="spinner-small"></span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <span>
                      {ratingModal.userRating
                        ? "Update Rating"
                        : "Submit Rating"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoresList;
