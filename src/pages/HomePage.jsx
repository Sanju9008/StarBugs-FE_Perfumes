import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // Auth interceptor handles redirect
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem' }}>
      <div className="auth-card" style={{ maxWidth: '100%' }}>
        <div className="auth-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Welcome to ShopNest
          </h1>
          <p>You have successfully logged in!</p>
        </div>

        {user && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Your Profile Dashboard</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Full Name</span>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginTop: '0.25rem' }}>{user.fullName}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Email Address</span>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginTop: '0.25rem' }}>{user.email}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Mobile Number</span>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginTop: '0.25rem' }}>{user.mobileNumber}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Role</span>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginTop: '0.25rem' }}>
                  <span style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem', color: '#a5b4fc' }}>
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={handleLogout} 
          className="btn-primary" 
          style={{ width: 'auto', background: 'transparent', border: '1px solid var(--error-color)', color: 'var(--error-color)', marginTop: '0' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default HomePage;
