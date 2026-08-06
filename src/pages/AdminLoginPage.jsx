import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, UserPlus, User } from 'lucide-react';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect based on role
    const userStr = localStorage.getItem('user');
    if (authService.isAuthenticated() && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.role && user.role.toUpperCase().includes('ADMIN')) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/products', { replace: true });
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      const user = response.user;
      const userRole = user?.role ? user.role.toUpperCase() : '';

      if (userRole.includes('ADMIN')) {
        toast.success(`Welcome to Admin Control Center, ${user.username || 'Admin'}!`);
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Not an admin account
        await authService.logout();
        const accessError = 'Access Denied: This portal is reserved for Administrators only.';
        setError(accessError);
        toast.error(accessError);
      }
    } catch (err) {
      const msg = err.message || 'Invalid admin credentials. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-badge-header">
          <div className="admin-shield-icon">
            <ShieldCheck size={36} />
          </div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">Sign in to manage store catalog, users & orders</p>
        </div>

        {error && <div className="admin-alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>Access Admin Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <div>
            Need an Administrator account?{' '}
            <Link to="/admin/register" className="admin-link">
              <UserPlus size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Register Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
