import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import authService from '../services/authService';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    adminSecret: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    if (formData.isAdmin && (!formData.adminSecret || formData.adminSecret.trim() === '')) {
      return "Please enter the Admin Passcode to register as an Administrator.";
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
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.isAdmin ? 'ADMIN' : 'USER',
        adminSecret: formData.isAdmin ? formData.adminSecret : ''
      };

      const response = await authService.register(payload);
      const targetPage = formData.isAdmin ? '/admin/login' : '/login';
      const msg = formData.isAdmin
        ? 'Admin account created successfully! Redirecting to Admin Login...'
        : 'Registration successful! Redirecting to login...';

      setStatus({ type: 'success', message: response.message || msg });
      toast.success(formData.isAdmin ? 'Admin account created!' : 'Registration successful!');
      setTimeout(() => navigate(targetPage), 2000);
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setStatus({ type: 'error', message: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join ShopNest as a User or Administrator">
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
        </div>

        {/* Optional Admin Registration Checkbox */}
        <div style={{ margin: '1rem 0', padding: '0.85rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#4f46e5' }}>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }}
            />
            <ShieldCheck size={18} />
            <span>Register as an Administrator</span>
          </label>

          {formData.isAdmin && (
            <div style={{ marginTop: '0.75rem' }}>
              <input
                type="password"
                name="adminSecret"
                className="form-input"
                placeholder="Enter Admin Passcode (e.g. ADMIN123)"
                value={formData.adminSecret}
                onChange={handleChange}
                required={formData.isAdmin}
                style={{ background: '#fff' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                Passcode required for Admin account registration.
              </span>
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={loading || status.type === 'success'}>
          {loading ? <span className="spinner"></span> : (formData.isAdmin ? 'Register Admin Account' : 'Create Account')}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
