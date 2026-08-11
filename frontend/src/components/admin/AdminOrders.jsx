import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, X, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const AdminOrders = () => {
  const [orderSearch, setOrderSearch] = useState('');
  const [adminOrderPage, setAdminOrderPage] = useState(1);
  const adminOrdersPerPage = 6;

  const [analyticsType, setAnalyticsType] = useState('overall');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('ORDER_PLACED');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [analyticsType, selectedDate, selectedMonth, selectedYear]);

  useEffect(() => {
    setAdminOrderPage(1);
  }, [orderSearch, analyticsType, selectedDate, selectedMonth, selectedYear]);

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
      console.error('Failed to fetch orders:', err);
      toast.error(err.message || 'Error fetching orders');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrderForStatus(order);
    const validStatuses = ['ORDER_PLACED', 'PACKING', 'SHIPPED', 'DELIVERED', 'FAILED'];
    const currentStatus = order.status && validStatuses.includes(order.status) ? order.status : 'ORDER_PLACED';
    setNewOrderStatus(currentStatus);
    setShowStatusModal(true);
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrderForStatus) return;
    try {
      setUpdatingStatus(true);
      await adminService.updateOrderStatus(selectedOrderForStatus.orderId, newOrderStatus);
      toast.success(`Order #${selectedOrderForStatus.orderId} updated to ${formatOrderStatus(newOrderStatus)}`);

      if (analyticsData && analyticsData.orderSummaries) {
        const updatedSummaries = analyticsData.orderSummaries.map(ord =>
          ord.orderId === selectedOrderForStatus.orderId ? { ...ord, status: newOrderStatus } : ord
        );
        setAnalyticsData({
          ...analyticsData,
          orderSummaries: updatedSummaries
        });
      }
      setShowStatusModal(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatOrderStatus = (status) => {
    if (!status || status === 'PENDING' || status === 'SUCCESS') return 'DELIVERED';
    return status.replace(/_/g, ' ');
  };

  const getOrderStatusStyle = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'SUCCESS':
      case 'PENDING':
        return { background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)' };
      case 'SHIPPED':
        return { background: 'rgba(129, 140, 248, 0.2)', color: '#818cf8', border: '1px solid rgba(129, 140, 248, 0.3)' };
      case 'PACKING':
        return { background: 'rgba(192, 132, 252, 0.2)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.3)' };
      case 'ORDER_PLACED':
        return { background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' };
      case 'FAILED':
        return { background: 'rgba(248, 113, 113, 0.2)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.3)' };
      default:
        return { background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)' };
    }
  };

  const allOrdersList = analyticsData?.orderSummaries || [];
  const filteredOrders = allOrdersList.filter(ord => {
    if (!orderSearch.trim()) return true;
    const query = orderSearch.toLowerCase();
    return (
      String(ord.orderId).includes(query) ||
      (ord.userName && ord.userName.toLowerCase().includes(query)) ||
      (ord.userEmail && ord.userEmail.toLowerCase().includes(query)) ||
      (ord.status && ord.status.toLowerCase().includes(query))
    );
  });

  const totalAdminOrderPages = Math.max(1, Math.ceil(filteredOrders.length / adminOrdersPerPage));
  const adminIndexOfLastOrder = adminOrderPage * adminOrdersPerPage;
  const adminIndexOfFirstOrder = adminIndexOfLastOrder - adminOrdersPerPage;
  const paginatedAdminOrders = filteredOrders.slice(adminIndexOfFirstOrder, adminIndexOfLastOrder);

  return (
    <div className="admin-tab-content">
      <div className="admin-toolbar" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div className="admin-search-box" style={{ position: 'relative', width: '320px', flex: '1 1 260px', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search orders by ID, customer name, email, or status..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.85rem 0.5rem 2.3rem',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              color: '#0f172a',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="analytics-subtabs" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'overall', label: 'Overall' },
              { id: 'daily', label: 'Daily' },
              { id: 'monthly', label: 'Monthly' },
              { id: 'yearly', label: 'Yearly' }
            ].map(tab => {
              const active = analyticsType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAnalyticsType(tab.id)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: active ? '1px solid #38bdf8' : '1px solid rgba(0, 0, 0, 0.1)',
                    background: active ? 'rgba(56, 189, 248, 0.15)' : '#ffffff',
                    color: active ? '#38bdf8' : '#94a3b8',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {analyticsType === 'daily' && (
            <input
              type="date"
              className="analytics-date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
            />
          )}

          {analyticsType === 'monthly' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                className="analytics-date-picker"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                style={{ padding: '0.5rem 0.75rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                  <option key={m} value={m}>{new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
              <select
                className="analytics-date-picker"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                style={{ padding: '0.5rem 0.75rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
              >
                {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}

          {analyticsType === 'yearly' && (
            <select
              className="analytics-date-picker"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              style={{ padding: '0.5rem 0.75rem', background: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a', fontSize: '0.8rem', outline: 'none' }}
            >
              {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          )}
        </div>
      </div>

      {analyticsLoading ? (
        <div className="admin-loading" style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>Loading order transactions...</div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Order Transactions ({filteredOrders.length})
              </h3>
              <button
                onClick={fetchAnalytics}
                title="Refresh Orders"
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#818cf8',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                ↻ Refresh
              </button>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#475569' }}>
              Period: <strong style={{ color: '#0f172a' }}>{analyticsData?.period || 'Overall'}</strong>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {!paginatedAdminOrders || paginatedAdminOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedAdminOrders.map((ord) => (
                    <tr key={ord.orderId}>
                      <td 
                        onClick={() => handleOpenStatusModal(ord)} 
                        title="Click to update order status"
                        style={{ fontWeight: 600, color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        #{ord.orderId}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{ord.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.userEmail}</div>
                      </td>
                      <td>{ord.date}</td>
                      <td style={{ fontWeight: 700, color: '#34d399' }}>
                        ${parseFloat(ord.totalAmount).toFixed(2)}
                      </td>
                      <td>
                        <button
                          onClick={() => handleOpenStatusModal(ord)}
                          title="Click to change order status"
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            ...getOrderStatusStyle(ord.status)
                          }}
                        >
                          {formatOrderStatus(ord.status)}
                          <Edit size={12} style={{ opacity: 0.8 }} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredOrders.length > 0 && (
            <div className="admin-pagination" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1rem',
              padding: '0.85rem 1rem',
              background: 'rgba(241, 245, 249, 1)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '10px',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                Showing <strong style={{ color: '#0f172a' }}>{adminIndexOfFirstOrder + 1}</strong> to{' '}
                <strong style={{ color: '#0f172a' }}>{Math.min(adminIndexOfLastOrder, filteredOrders.length)}</strong> of{' '}
                <strong style={{ color: '#0f172a' }}>{filteredOrders.length}</strong> orders
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  className="admin-page-btn"
                  disabled={adminOrderPage === 1}
                  onClick={() => setAdminOrderPage(prev => Math.max(1, prev - 1))}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    background: adminOrderPage === 1 ? '#e2e8f0' : '#f1f5f9',
                    color: adminOrderPage === 1 ? '#94a3b8' : '#0f172a',
                    cursor: adminOrderPage === 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <span className="admin-page-info" style={{ padding: '0 0.5rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                  Page {adminOrderPage} of {totalAdminOrderPages}
                </span>

                <button
                  className="admin-page-btn"
                  disabled={adminOrderPage === totalAdminOrderPages}
                  onClick={() => setAdminOrderPage(prev => Math.min(totalAdminOrderPages, prev + 1))}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    background: adminOrderPage === totalAdminOrderPages ? '#e2e8f0' : '#f1f5f9',
                    color: adminOrderPage === totalAdminOrderPages ? '#94a3b8' : '#0f172a',
                    cursor: adminOrderPage === totalAdminOrderPages ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Update Order Status Modal */}
      {showStatusModal && selectedOrderForStatus && (
        <div className="modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Update Order Status
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#475569' }}>Order ID:</span>
                <span style={{ fontWeight: 700, color: '#818cf8' }}>#{selectedOrderForStatus.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#475569' }}>Customer:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedOrderForStatus.userName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#475569' }}>Amount:</span>
                <span style={{ fontWeight: 700, color: '#34d399' }}>${parseFloat(selectedOrderForStatus.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                Select New Status
              </label>
              <select
                value={newOrderStatus}
                onChange={(e) => setNewOrderStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: '#f1f5f9',
                  border: '1px solid rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontSize: '0.95rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ORDER_PLACED">Order Placed</option>
                <option value="PACKING">Packing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowStatusModal(false)}
                style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid rgba(0, 0, 0, 0.2)', color: '#0f172a', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                disabled={updatingStatus}
                onClick={handleUpdateOrderStatus}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#3b82f6',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  borderRadius: '8px',
                  cursor: updatingStatus ? 'not-allowed' : 'pointer',
                  opacity: updatingStatus ? 0.7 : 1
                }}
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
