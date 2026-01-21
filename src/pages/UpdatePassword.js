import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";
import { validatePassword } from "../utils/validation";

function UpdatePassword() {
  const { currentUser, updatePassword, signout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) newErrors.newPassword = passwordError;

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await updatePassword(formData.currentPassword, formData.newPassword);

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update password";
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const roleMap = {
      admin: "/admin/dashboard",
      user: "/user/dashboard",
      owner: "/owner/dashboard",
    };
    navigate(roleMap[currentUser?.role] || "/signin");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Update Password</h2>

        {success && (
          <div className="success-message">Password updated successfully!</div>
        )}

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password *</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />
            {errors.currentPassword && (
              <span className="error-text">{errors.currentPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label>New Password *</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="8-16 chars, uppercase & special char required"
            />
            {errors.newPassword && (
              <span className="error-text">{errors.newPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label>Confirm New Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button disabled={loading} type="submit" className="btn-primary">
            {loading ? "Updating..." : "Update Password"}
          </button>

          <button type="button" onClick={handleBack} className="btn-secondary">
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;
