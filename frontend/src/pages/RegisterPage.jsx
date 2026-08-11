import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (status.type === 'error') setStatus({ type: '', message: '' });
  };

  const validateForm = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      return "Mobile number must be exactly 10 digits.";
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
      setStatus({ type: 'error', message: validationError });
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await authService.register(formData);
      setStatus({ type: 'success', message: response.message || 'Registration successful! Redirecting to login...' });
      toast.success('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setStatus({ type: 'error', message: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join ShopNest today">
      {status.message && (
        <div className={`alert ${status.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            placeholder=" "
            value={formData.username}
            onChange={handleChange}
            required
            minLength="2"
            maxLength="100"
          />
          <label htmlFor="username" className="form-label">Full Name</label>
        </div>

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
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            className="form-input"
            placeholder=" "
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit mobile number"
          />
          <label htmlFor="mobileNumber" className="form-label">Mobile Number (10 digits)</label>
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
          <span className="form-error" style={{ display: formData.password && formData.password.length < 8 ? 'flex' : 'none' }}>
            At least 8 characters required
          </span>
        </div>

        <div className="form-group">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-input"
            placeholder=" "
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <span className="form-error" style={{ display: formData.confirmPassword && formData.password !== formData.confirmPassword ? 'flex' : 'none' }}>
            Passwords do not match
          </span>
        </div>

        <button type="submit" className="btn-primary" disabled={loading || status.type === 'success'}>
          {loading ? <span className="spinner"></span> : 'Create Account'}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
