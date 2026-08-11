import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, ArrowRight, LogIn } from 'lucide-react';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import './AdminLoginPage.css';

const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.username.trim().length < 2) {
      return "Full Name must be at least 2 characters long.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      return "Password must contain uppercase, lowercase, number, and special character.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      await authService.registerAdmin(payload);
      toast.success('Administrator account created successfully! Please sign in.');
      navigate('/admin/login', { replace: true });
    } catch (err) {
      const msg = err.message || 'Admin registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card" style={{ maxWidth: '480px' }}>
        <div className="admin-badge-header">
          <div className="admin-shield-icon">
            <ShieldCheck size={36} />
          </div>
          <h1 className="admin-login-title">Register Administrator</h1>
          <p className="admin-login-subtitle">Create a dedicated Admin account to manage ShopNest</p>
        </div>

        {error && <div className="admin-alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-name" className="admin-form-label">Full Name</label>
            <div className="admin-input-wrapper">
              <User className="admin-input-icon" size={18} />
              <input
                type="text"
                id="admin-name"
                name="username"
                className="admin-form-input"
                placeholder="Admin Officer Name"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-email" className="admin-form-label">Admin Email Address</label>
            <div className="admin-input-wrapper">
              <Mail className="admin-input-icon" size={18} />
              <input
                type="email"
                id="admin-email"
                name="email"
                className="admin-form-input"
                placeholder="admin@shopnest.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password" className="admin-form-label">Password</label>
            <div className="admin-input-wrapper">
              <Lock className="admin-input-icon" size={18} />
              <input
                type="password"
                id="admin-password"
                name="password"
                className="admin-form-input"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-confirm-password" className="admin-form-label">Confirm Password</label>
            <div className="admin-input-wrapper">
              <Lock className="admin-input-icon" size={18} />
              <input
                type="password"
                id="admin-confirm-password"
                name="confirmPassword"
                className="admin-form-input"
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>Register Administrator Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <div>
            Already registered as Administrator?{' '}
            <Link to="/admin/login" className="admin-link">
              <LogIn size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Admin Portal Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
