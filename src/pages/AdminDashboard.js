import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";
import api from "../utils/api";

function AdminDashboard() {
  const { currentUser, signout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
    storeId: "",
  });
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, storesRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/stores"),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setStores(storesRes.data.stores);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signout();
    navigate("/signin");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Validation
    if (newUser.name.length < 20 || newUser.name.length > 60) {
      alert("Name must be between 20 and 60 characters");
      return;
    }
    if (newUser.password.length < 8 || newUser.password.length > 16) {
      alert("Password must be between 8 and 16 characters");
      return;
    }
    if (!/[A-Z]/.test(newUser.password)) {
      alert("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newUser.password)) {
      alert("Password must contain at least one special character");
      return;
    }
    if (newUser.address.length > 400) {
      alert("Address must be max 400 characters");
      return;
    }

    if (newUser.role === "owner" && !newUser.storeId) {
      alert("Please select a store for the owner");
      return;
    }

    try {
      setSubmitting(true);
      const userData = { ...newUser };
      if (newUser.role !== "owner") {
        delete userData.storeId;
      }
      await api.post("/admin/users", userData);
      alert("User created successfully!");
      setShowUserModal(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
        storeId: "",
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();

    // Validation
    if (newStore.name.length < 3 || newStore.name.length > 60) {
      alert("Store name must be between 3 and 60 characters");
      return;
    }
    if (newStore.address.length > 400) {
      alert("Address must be max 400 characters");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/admin/stores", newStore);
      alert("Store created successfully!");
      setShowStoreModal(false);
      setNewStore({
        name: "",
        email: "",
        address: "",
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create store");
    } finally {
      setSubmitting(false);
    }
  };
  const handleEditUser = (user) => {
    setEditMode(true);
    setEditingId(user.id);
    setNewUser({
      name: user.name,
      email: user.email,
      password: "", // Don't pre-fill password
      address: user.address,
      role: user.role,
      storeId: user.storeId || "",
    });
    setShowUserModal(true);
  };

  const handleEditStore = (store) => {
    setEditMode(true);
    setEditingId(store.id);
    setNewStore({
      name: store.name,
      email: store.email,
      address: store.address,
    });
    setShowStoreModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    // Validation
    if (newUser.name.length < 20 || newUser.name.length > 60) {
      alert("Name must be between 20 and 60 characters");
      return;
    }
    if (newUser.address.length > 400) {
      alert("Address must be max 400 characters");
      return;
    }
    if (newUser.role === "owner" && !newUser.storeId) {
      alert("Please select a store for the owner");
      return;
    }

    try {
      setSubmitting(true);
      const userData = {
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
        storeId: newUser.role === "owner" ? newUser.storeId : null,
      };

      await api.put(`/admin/users/${editingId}`, userData);
      alert("User updated successfully!");
      handleCloseUserModal();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();

    // Validation
    if (newStore.name.length < 20 || newStore.name.length > 60) {
      alert("Store name must be between 20 and 60 characters");
      return;
    }
    if (newStore.address.length > 400) {
      alert("Address must be max 400 characters");
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/admin/stores/${editingId}`, newStore);
      alert("Store updated successfully!");
      handleCloseStoreModal();
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update store");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setEditMode(false);
    setEditingId(null);
    setNewUser({
      name: "",
      email: "",
      password: "",
      address: "",
      role: "user",
      storeId: "",
    });
  };

  const handleCloseStoreModal = () => {
    setShowStoreModal(false);
    setEditMode(false);
    setEditingId(null);
    setNewStore({
      name: "",
      email: "",
      address: "",
    });
  };
  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admin/stores?${params}`);
      setStores(response.data.stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "stores") fetchStores();
  }, [filters, activeTab]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">📊 Admin</div>
          <div className="admin-info">
            <div className="admin-avatar">
              {currentUser?.name?.charAt(0) || "A"}
            </div>
            <div className="admin-details">
              <p className="admin-name">{currentUser?.name}</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === "stats" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("stats")}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Overview</span>
          </button>
          <button
            className={activeTab === "users" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("users")}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-label">Users</span>
            <span className="nav-count">{stats?.totalUsers}</span>
          </button>
          <button
            className={activeTab === "stores" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("stores")}
          >
            <span className="nav-icon">🏪</span>
            <span className="nav-label">Stores</span>
            <span className="nav-count">{stats?.totalStores}</span>
          </button>
        </nav>

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

      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">
              {activeTab === "stats" && "Dashboard Overview"}
              {activeTab === "users" && "User Management"}
              {activeTab === "stores" && "Store Management"}
            </h1>
            <p className="page-subtitle">
              {activeTab === "stats" &&
                "View your platform statistics and metrics"}
              {activeTab === "users" &&
                "Manage and monitor all registered users"}
              {activeTab === "stores" && "Manage and monitor all stores"}
            </p>
          </div>
        </div>

        {activeTab === "stats" && stats && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card users-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <p className="stat-label">Total Users</p>
                  <p className="stat-value">{stats.totalUsers}</p>
                  <p className="stat-change">Registered accounts</p>
                </div>
              </div>
              <div className="stat-card stores-card">
                <div className="stat-icon">🏪</div>
                <div className="stat-info">
                  <p className="stat-label">Total Stores</p>
                  <p className="stat-value">{stats.totalStores}</p>
                  <p className="stat-change">Active stores</p>
                </div>
              </div>
              <div className="stat-card ratings-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <p className="stat-label">Total Ratings</p>
                  <p className="stat-value">{stats.totalRatings}</p>
                  <p className="stat-change">Submitted reviews</p>
                </div>
              </div>
            </div>

            <div className="overview-cards">
              <div className="overview-card">
                <h3>📊 Platform Activity</h3>
                <div className="activity-items">
                  <div className="activity-item">
                    <span className="activity-label">Average Rating</span>
                    <span className="activity-value">
                      {stats.totalRatings > 0
                        ? (stats.totalRatings / stats.totalStores).toFixed(2)
                        : "0.00"}{" "}
                      ⭐
                    </span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-label">Stores per User</span>
                    <span className="activity-value">
                      {(stats.totalStores / stats.totalUsers).toFixed(2)}
                    </span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-label">Ratings per Store</span>
                    <span className="activity-value">
                      {(stats.totalRatings / stats.totalStores).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>🎯 Quick Actions</h3>
                <div className="quick-actions">
                  <button
                    className="action-btn"
                    onClick={() => setActiveTab("users")}
                  >
                    <span className="action-icon">👥</span>
                    <span className="action-text">Manage Users</span>
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setActiveTab("stores")}
                  >
                    <span className="action-icon">🏪</span>
                    <span className="action-text">Manage Stores</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="dashboard-content">
            <div className="content-header">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button
                className="btn-add-new"
                onClick={() => setShowUserModal(true)}
              >
                <span>➕</span>
                <span>Add New User</span>
              </button>
            </div>
            <div className="filters">
              <input
                type="text"
                placeholder="Filter by name"
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Filter by email"
                value={filters.email}
                onChange={(e) =>
                  setFilters({ ...filters, email: e.target.value })
                }
              />
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value })
                }
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
              >
                <option value="createdAt">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters({ ...filters, sortOrder: e.target.value })
                }
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>

            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>👤 Name</th>
                    <th>📧 Email</th>
                    <th>📍 Address</th>
                    <th>🏷️ Role</th>
                    <th>⭐ Store Rating</th>
                    <th>⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(
                      (user) =>
                        user.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        user.email
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                    )
                    .map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-sm">
                              {user.name.charAt(0)}
                            </div>
                            <span className="user-name">{user.name}</span>
                          </div>
                        </td>
                        <td className="email-cell">{user.email}</td>
                        <td className="address-cell">{user.address}</td>
                        <td>
                          <span className={`badge badge-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="rating-cell">
                          {user.ownedStore ? (
                            <span className="rating-badge">
                              {user.ownedStore.averageRating} ⭐
                            </span>
                          ) : (
                            <span className="no-data-badge">-</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-edit-small"
                            onClick={() => handleEditUser(user)}
                            title="Edit User"
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "stores" && (
          <div className="dashboard-content">
            <div className="content-header">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button
                className="btn-add-new"
                onClick={() => setShowStoreModal(true)}
              >
                <span>➕</span>
                <span>Add New Store</span>
              </button>
            </div>
            <div className="filters">
              <input
                type="text"
                placeholder="Filter by name"
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Filter by address"
                value={filters.address}
                onChange={(e) =>
                  setFilters({ ...filters, address: e.target.value })
                }
              />
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
              >
                <option value="createdAt">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="averageRating">Sort by Rating</option>
              </select>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters({ ...filters, sortOrder: e.target.value })
                }
              >
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>

            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>🏪 Store Name</th>
                    <th>📧 Email</th>
                    <th>📍 Address</th>
                    <th>⭐ Rating</th>
                    <th>📊 Total Ratings</th>
                    <th>⚙️ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores
                    .filter(
                      (store) =>
                        store.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        store.address
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                    )
                    .map((store) => (
                      <tr key={store.id}>
                        <td>
                          <div className="store-cell">
                            <div className="store-icon">🏪</div>
                            <span className="store-name">{store.name}</span>
                          </div>
                        </td>
                        <td className="email-cell">{store.email}</td>
                        <td className="address-cell">{store.address}</td>
                        <td>
                          <div className="rating-display">
                            <span className="rating-value">
                              {parseFloat(store.averageRating).toFixed(1)}
                            </span>
                            <span className="rating-stars">⭐</span>
                          </div>
                        </td>
                        <td>
                          <span className="count-badge">
                            {store.totalRatings}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-edit-small"
                            onClick={() => handleEditStore(store)}
                            title="Edit Store"
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showUserModal && (
        <div className="modal-overlay-modern" onClick={handleCloseUserModal}>
          <div
            className="modal-content-form"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={handleCloseUserModal}>
              ×
            </button>

            <div className="modal-header-form">
              <div className="modal-icon-form">👤</div>
              <h3>{editMode ? "Edit User" : "Create New User"}</h3>
              <p className="modal-subtitle">
                {editMode
                  ? "Update user information"
                  : "Add a new user to the system"}
              </p>
            </div>

            <form
              onSubmit={editMode ? handleUpdateUser : handleCreateUser}
              className="admin-form"
            >
              <div className="form-group-modern">
                <label htmlFor="userName">Full Name *</label>
                <input
                  type="text"
                  id="userName"
                  placeholder="Enter full name (20-60 characters)"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                  minLength={20}
                  maxLength={60}
                  className="form-input-modern"
                />
                <span className="form-hint">
                  Minimum 20 characters required
                </span>
              </div>

              <div className="form-group-modern">
                <label htmlFor="userEmail">Email Address *</label>
                <input
                  type="email"
                  id="userEmail"
                  placeholder="user@example.com"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                  className="form-input-modern"
                />
              </div>

              <div className="form-group-modern">
                <label htmlFor="userPassword">
                  Password {!editMode && "*"}
                </label>
                <input
                  type="password"
                  id="userPassword"
                  placeholder={
                    editMode
                      ? "Leave blank to keep current password"
                      : "Enter password (8-16 characters)"
                  }
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required={!editMode}
                  minLength={8}
                  maxLength={16}
                  className="form-input-modern"
                />
                <span className="form-hint">
                  {editMode
                    ? "Leave blank to keep current password"
                    : "Must include uppercase letter and special character"}
                </span>
              </div>

              <div className="form-group-modern">
                <label htmlFor="userAddress">Address *</label>
                <textarea
                  id="userAddress"
                  placeholder="Enter full address (max 400 characters)"
                  value={newUser.address}
                  onChange={(e) =>
                    setNewUser({ ...newUser, address: e.target.value })
                  }
                  required
                  maxLength={400}
                  rows={3}
                  className="form-input-modern"
                />
              </div>

              <div className="form-group-modern">
                <label htmlFor="userRole">User Role *</label>
                <select
                  id="userRole"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value,
                      storeId: "",
                    })
                  }
                  className="form-input-modern"
                >
                  <option value="user">Normal User</option>
                  <option value="owner">Store Owner</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {newUser.role === "owner" && (
                <div className="form-group-modern">
                  <label htmlFor="userStore">Assign Store *</label>
                  <select
                    id="userStore"
                    value={newUser.storeId}
                    onChange={(e) =>
                      setNewUser({ ...newUser, storeId: e.target.value })
                    }
                    className="form-input-modern"
                    required
                  >
                    <option value="">-- Select a Store --</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name} ({store.email})
                      </option>
                    ))}
                  </select>
                  <small
                    style={{
                      color: "#6c757d",
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    Store owners must be linked to a store to access their
                    dashboard
                  </small>
                </div>
              )}

              <div className="modal-actions-form">
                <button
                  type="button"
                  className="btn-form-cancel"
                  onClick={() => setShowUserModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-form-submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-small"></span>
                      <span>{editMode ? "Updating..." : "Creating..."}</span>
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>{editMode ? "Update User" : "Create User"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Store Modal */}
      {showStoreModal && (
        <div className="modal-overlay-modern" onClick={handleCloseStoreModal}>
          <div
            className="modal-content-form"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={handleCloseStoreModal}>
              ×
            </button>

            <div className="modal-header-form">
              <div className="modal-icon-form">🏪</div>
              <h3>{editMode ? "Edit Store" : "Create New Store"}</h3>
              <p className="modal-subtitle">
                {editMode
                  ? "Update store information"
                  : "Add a new store to the platform"}
              </p>
            </div>

            <form
              onSubmit={editMode ? handleUpdateStore : handleCreateStore}
              className="admin-form"
            >
              <div className="form-group-modern">
                <label htmlFor="storeName">Store Name *</label>
                <input
                  type="text"
                  id="storeName"
                  placeholder="Enter store name (3-60 characters)"
                  value={newStore.name}
                  onChange={(e) =>
                    setNewStore({ ...newStore, name: e.target.value })
                  }
                  required
                  minLength={3}
                  maxLength={60}
                  className="form-input-modern"
                />
              </div>

              <div className="form-group-modern">
                <label htmlFor="storeEmail">Email Address *</label>
                <input
                  type="email"
                  id="storeEmail"
                  placeholder="store@example.com"
                  value={newStore.email}
                  onChange={(e) =>
                    setNewStore({ ...newStore, email: e.target.value })
                  }
                  required
                  className="form-input-modern"
                />
              </div>

              <div className="form-group-modern">
                <label htmlFor="storeAddress">Store Address *</label>
                <textarea
                  id="storeAddress"
                  placeholder="Enter store address (max 400 characters)"
                  value={newStore.address}
                  onChange={(e) =>
                    setNewStore({ ...newStore, address: e.target.value })
                  }
                  required
                  maxLength={400}
                  rows={3}
                  className="form-input-modern"
                />
              </div>

              <div className="modal-actions-form">
                <button
                  type="button"
                  className="btn-form-cancel"
                  onClick={() => setShowStoreModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-form-submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-small"></span>
                      <span>{editMode ? "Updating..." : "Creating..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{editMode ? "💾" : "✓"}</span>
                      <span>{editMode ? "Update Store" : "Create Store"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
