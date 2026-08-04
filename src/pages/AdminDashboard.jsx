import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Package, Users, ShoppingBag, BarChart3, Settings } from 'lucide-react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setAdminUser(u);
      } catch (e) {
        console.error('Failed to parse admin user', e);
      }
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.info('Logged out from Admin Portal');
    navigate('/admin/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Admin Navbar */}
      <header style={{
        background: 'rgba(30, 41, 59, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>ShopNest Admin</h2>
            <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>CONTROL CENTER</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Logged in as: <strong style={{ color: '#ffffff' }}>{adminUser?.username || 'Administrator'}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Admin Control Center</h1>
          <p style={{ color: '#94a3b8' }}>Manage products, categories, orders, and view system metrics.</p>
        </div>

        {/* Dashboard Quick Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>Total Products</span>
              <Package size={20} color="#818cf8" />
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff' }}>120+</div>
          </div>

          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>Total Orders</span>
              <ShoppingBag size={20} color="#34d399" />
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff' }}>45</div>
          </div>

          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>Registered Users</span>
              <Users size={20} color="#f472b6" />
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#fff' }}>88</div>
          </div>

          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600 }}>System Status</span>
              <BarChart3 size={20} color="#fbbf24" />
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>Active & Ready</div>
          </div>
        </div>

        {/* Ready for Admin Flow Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.05) 100%)',
          border: '1px border rgba(99, 102, 241, 0.3)',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <ShieldCheck size={48} color="#818cf8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Admin Portal Ready</h3>
          <p style={{ color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            The separate Admin Login and Admin Authentication routing are active. Ready to build the full Admin features!
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
