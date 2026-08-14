import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import authService from '../services/authService';
import AuthLayout from '../components/AuthLayout';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState({ type: 'loading', message: 'Verifying your email address...' });

  useEffect(() => {
    if (!token) {
      setStatus({ type: 'error', message: 'No verification token provided in the URL.' });
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus({ type: 'success', message: response.message || 'Email verified successfully!' });
      } catch (err) {
        setStatus({ type: 'error', message: err.message || 'Verification failed. The link may have expired or is invalid.' });
      }
    };

    verifyToken();
  }, [token]);

  return (
    <AuthLayout title="Email Verification" subtitle="Verify your ShopNest account">
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        {status.type === 'loading' && (
          <div>
            <span className="spinner" style={{ borderTopColor: '#007bff', width: '40px', height: '40px', borderWidth: '4px' }}></span>
            <p style={{ marginTop: '1rem' }}>{status.message}</p>
          </div>
        )}

        {status.type === 'success' && (
          <div className="alert alert-success">
            <h3>Success!</h3>
            <p>{status.message}</p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
              Proceed to Login
            </Link>
          </div>
        )}

        {status.type === 'error' && (
          <div className="alert alert-error">
            <h3>Verification Failed</h3>
            <p>{status.message}</p>
            <Link to="/register" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
              Back to Registration
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
