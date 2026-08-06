import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const AdminAnalytics = () => {
  const [analyticsType, setAnalyticsType] = useState('overall'); // 'daily' | 'monthly' | 'yearly' | 'overall'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [analyticsType, selectedDate, selectedMonth, selectedYear]);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      let data = null;
      if (analyticsType === 'daily') {
        data = await adminService.getDailyAnalytics(selectedDate);
      } else if (analyticsType === 'monthly') {
        data = await adminService.getMonthlyAnalytics(selectedYear, selectedMonth);
      } else if (analyticsType === 'yearly') {
        data = await adminService.getYearlyAnalytics(selectedYear);
      } else if (analyticsType === 'overall') {
        data = await adminService.getOverallAnalytics();
      }
      setAnalyticsData(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      toast.error(err.message || 'Error fetching analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  return (
    <div className="admin-tab-content">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700 }}>Dashboard Overview</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>Live data from database</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {[
            { id: 'overall', label: 'Overall' },
            { id: 'daily',   label: 'Daily'   },
            { id: 'monthly', label: 'Monthly' },
            { id: 'yearly',  label: 'Yearly'  }
          ].map(t => {
            const active = analyticsType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setAnalyticsType(t.id)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  border: active ? '1px solid #38bdf8' : '1px solid rgba(0, 0, 0, 0.1)',
                  background: active ? 'rgba(56,189,248,0.15)' : '#ffffff',
                  color: active ? '#38bdf8' : '#94a3b8',
                  whiteSpace: 'nowrap'
                }}
              >{t.label}</button>
            );
          })}

          {analyticsType === 'daily' && (
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{
                padding: '0.4rem 0.7rem',
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                color: '#0f172a',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          )}

          {analyticsType === 'monthly' && (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(parseInt(e.target.value, 10))}
                style={{ padding: '0.4rem 0.6rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                  <option key={m} value={m}>{new Date(2000, m-1, 1).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(parseInt(e.target.value, 10))}
                style={{ padding: '0.4rem 0.6rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}

          {analyticsType === 'yearly' && (
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value, 10))}
              style={{ padding: '0.4rem 0.6rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
            >
              {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          )}

          <button
            onClick={fetchAnalytics}
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.4)',
              color: '#818cf8',
              padding: '0.4rem 0.9rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >↻ Refresh</button>
        </div>
      </div>

      {analyticsLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
          <span className="spinner" style={{ width: '32px', height: '32px' }}></span>
          <p style={{ marginTop: '1rem' }}>Loading dashboard data...</p>
        </div>
      ) : analyticsData ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
            {/* Total Revenue */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(16,185,129,0.06) 100%)',
              border: '1px solid rgba(52,211,153,0.25)',
              borderRadius: '14px',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '2rem', opacity: 0.15 }}>₹</div>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#34d399', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Total Revenue
              </p>
              <p style={{ margin: '0.6rem 0 0', fontSize: '2rem', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
                ₹{analyticsData.totalRevenue ? parseFloat(analyticsData.totalRevenue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </p>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                {analyticsData.period && analyticsData.period !== 'All Time'
                  ? `Period: ${analyticsData.period}`
                  : 'All-time completed orders'}
              </p>
            </div>

            {/* Total Users */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(129,140,248,0.12) 0%, rgba(99,102,241,0.06) 100%)',
              border: '1px solid rgba(129,140,248,0.25)',
              borderRadius: '14px',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '2rem', opacity: 0.15 }}>👤</div>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#818cf8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Total Users
              </p>
              <p style={{ margin: '0.6rem 0 0', fontSize: '2rem', fontWeight: 800, color: '#818cf8', lineHeight: 1 }}>
                {analyticsData.totalUsers}
              </p>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>Registered accounts</p>
            </div>

            {/* Total Products */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.06) 100%)',
              border: '1px solid rgba(251,191,36,0.25)',
              borderRadius: '14px',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '2rem', opacity: 0.15 }}>📦</div>
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#fbbf24', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Total Products
              </p>
              <p style={{ margin: '0.6rem 0 0', fontSize: '2rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
                {analyticsData.totalProducts}
              </p>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>Products in catalog</p>
            </div>
          </div>

          {/* Low Stock Table */}
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(248,113,113,0.25)',
            borderRadius: '14px',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              background: 'rgba(248,113,113,0.07)'
            }}>
              <span style={{ fontSize: '1rem' }}>⚠️</span>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f87171' }}>
                Low Stock Alert
              </h3>
              <span style={{
                marginLeft: 'auto',
                background: 'rgba(248,113,113,0.2)',
                color: '#f87171',
                border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: '99px',
                padding: '2px 10px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {analyticsData.lowStockProducts ? analyticsData.lowStockProducts.length : 0} items
              </span>
            </div>

            {analyticsData.lowStockProducts && analyticsData.lowStockProducts.length > 0 ? (
              <div className="admin-table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                <table className="admin-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price (₹)</th>
                      <th style={{ textAlign: 'center' }}>Stock Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.lowStockProducts.map(p => (
                      <tr key={p.productId}>
                        <td style={{ color: '#818cf8', fontWeight: 600 }}>#{p.productId}</td>
                        <td style={{ fontWeight: 600 }}>{p.name}</td>
                        <td style={{ color: '#475569' }}>{p.category}</td>
                        <td>₹{parseFloat(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 12px',
                            borderRadius: '99px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            background: p.stock === 0
                              ? 'rgba(239,68,68,0.2)' : 'rgba(248,113,113,0.15)',
                            color: p.stock === 0 ? '#ef4444' : '#f87171',
                            border: `1px solid ${p.stock === 0 ? 'rgba(239,68,68,0.4)' : 'rgba(248,113,113,0.3)'}`
                          }}>
                            {p.stock === 0 ? 'OUT OF STOCK' : p.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>✅ All products have sufficient stock (no items ≤ 5)</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No data available</div>
      )}
    </div>
  );
};

export default AdminAnalytics;
