import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import authService from '../services/authService';

import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.role && user.role.toUpperCase().includes('ADMIN')) {
            navigate('/admin/dashboard', { replace: true });
            return;
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      navigate('/products', { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData);
      toast.success('Successfully logged in!');
      navigate('/products', { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid email or password. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your ShopNest account">
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email" className="form-label">Email Address</label>
        </div>

        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password" className="form-label">Password</label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link to="#" className="auth-link" style={{ fontSize: '0.875rem' }}>Forgot password?</Link>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Sign In'}
        </button>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
