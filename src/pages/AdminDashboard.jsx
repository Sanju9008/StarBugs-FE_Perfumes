import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, LogOut, Package, Users, BarChart3, Plus, Trash2, Edit,
  Search, Calendar, DollarSign, ShoppingBag, TrendingUp, CheckCircle, AlertTriangle, X
} from 'lucide-react';
import authService from '../services/authService';
import productService from '../services/productService';
import adminService from '../services/adminService';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'users' | 'analytics'
  const [adminUser, setAdminUser] = useState(null);

  // ─── Product Management States ─────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [deleteProductCandidate, setDeleteProductCandidate] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: ''
  });

  // ─── User Management States ────────────────────────────────────────────────
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [editUserCandidate, setEditUserCandidate] = useState(null);
  const [deleteUserCandidate, setDeleteUserCandidate] = useState(null);
  const [editUserData, setEditUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER'
  });

  // ─── Business Analytics States ─────────────────────────────────────────────
  const [analyticsType, setAnalyticsType] = useState('daily'); // 'daily' | 'monthly' | 'yearly' | 'overall'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // ─── Initial Load ──────────────────────────────────────────────────────────
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing admin user:', e);
      }
    }
    fetchProducts();
    fetchCategories();
    fetchUsers();
  }, []);

  // Fetch Analytics when tab or parameters change
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab, analyticsType, selectedDate, selectedMonth, selectedYear]);

  // ─── Fetch Methods ─────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productService.getAllCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsersList(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

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

  const handleLogout = () => {
    authService.logout();
    toast.info('Logged out from Admin Portal');
    navigate('/admin/login');
  };

  // ─── Product Handlers ──────────────────────────────────────────────────────
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.categoryId) {
      toast.error('Please select a valid product category.');
      return;
    }

    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        categoryId: parseInt(newProduct.categoryId, 10),
        imageUrl: newProduct.imageUrl
      };

      await adminService.addProduct(payload);
      toast.success(`Product '${newProduct.name}' created successfully!`);
      setIsAddProductModalOpen(false);
      setNewProduct({ name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' });
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to add product');
    }
  };

  const handleDeleteProductConfirm = async () => {
    if (!deleteProductCandidate) return;
    try {
      await adminService.deleteProduct(deleteProductCandidate.productId);
      toast.success(`Product '${deleteProductCandidate.name}' removed from inventory.`);
      setDeleteProductCandidate(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  // ─── User Handlers ─────────────────────────────────────────────────────────
  const openEditUserModal = (user) => {
    setEditUserCandidate(user);
    setEditUserData({
      username: user.username || '',
      email: user.email || '',
      password: '',
      role: user.role || 'USER'
    });
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!editUserCandidate) return;

    try {
      const payload = {
        username: editUserData.username,
        email: editUserData.email,
        role: editUserData.role
      };
      if (editUserData.password && editUserData.password.trim() !== '') {
        payload.password = editUserData.password;
      }

      await adminService.updateUser(editUserCandidate.id, payload);
      toast.success(`User '${editUserData.username}' updated successfully!`);
      setEditUserCandidate(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!deleteUserCandidate) return;
    try {
      await adminService.deleteUser(deleteUserCandidate.id);
      toast.success(`User '${deleteUserCandidate.username}' deleted.`);
      setDeleteUserCandidate(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  // Filtered lists
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.category && p.category.categoryName.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const filteredUsers = usersList.filter(u =>
    (u.username && u.username.toLowerCase().includes(userSearch.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="admin-dashboard-container">
      {/* Admin Navbar */}
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-logo-icon">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="admin-title">ShopNest Admin</h2>
            <span className="admin-subtitle-badge">SALESSAVVY PORTAL</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            <span>Product Management</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} />
            <span>User Management</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={18} />
            <span>Business Analytics</span>
          </button>
        </div>

        {/* User Info & Logout */}
        <div className="admin-user-info">
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Admin: <strong style={{ color: '#fff' }}>{adminUser?.username || 'Admin'}</strong>
          </span>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* ────────────────── 1. PRODUCT MANAGEMENT TAB ────────────────── */}
        {activeTab === 'products' && (
          <div>
            <div className="admin-section-header">
              <div>
                <h1 className="admin-section-title">Product Catalog & Inventory</h1>
                <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>Add new items, update stock, or remove discontinued products.</p>
              </div>
              <button className="admin-action-btn" onClick={() => setIsAddProductModalOpen(true)}>
                <Plus size={18} />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '360px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.6rem',
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Products Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No products found in inventory.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const img = p.images && p.images.length > 0 ? p.images[0].imageUrl : 'https://via.placeholder.com/60';
                      return (
                        <tr key={p.productId}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                              <img src={img} alt={p.name} className="product-img-thumb" onError={(e) => e.target.src = 'https://via.placeholder.com/60'} />
                              <div>
                                <div style={{ fontWeight: 600, color: '#fff' }}>{p.name}</div>
                                <div style={{ fontSize: '0.775rem', color: '#64748b', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {p.description || 'No description'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.825rem' }}>
                              {p.category ? p.category.categoryName : 'Uncategorized'}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, color: '#34d399' }}>
                            ${parseFloat(p.price).toFixed(2)}
                          </td>
                          <td>
                            <span style={{
                              color: p.stock > 10 ? '#34d399' : p.stock > 0 ? '#fbbf24' : '#ef4444',
                              fontWeight: 600
                            }}>
                              {p.stock} units
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn-icon-danger"
                              title="Delete Product"
                              onClick={() => setDeleteProductCandidate(p)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ────────────────── 2. USER MANAGEMENT TAB ────────────────── */}
        {activeTab === 'users' && (
          <div>
            <div className="admin-section-header">
              <div>
                <h1 className="admin-section-title">User Account & Role Control</h1>
                <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>View user accounts, modify permissions, or assign Administrator roles.</p>
              </div>
            </div>

            {/* User Search */}
            <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '360px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.6rem',
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Users Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No registered users found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600, color: '#64748b' }}>#{u.id}</td>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{u.username}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role && u.role.toUpperCase().includes('ADMIN') ? 'admin' : 'user'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-icon-edit"
                            title="Edit User & Roles"
                            onClick={() => openEditUserModal(u)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-icon-danger"
                            title="Delete User"
                            onClick={() => setDeleteUserCandidate(u)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ────────────────── 3. BUSINESS ANALYTICS TAB ────────────────── */}
        {activeTab === 'analytics' && (
          <div>
            <div className="admin-section-header">
              <div>
                <h1 className="admin-section-title">Sales & Financial Analytics</h1>
                <p style={{ color: '#94a3b8', margin: '4px 0 0 0' }}>Track daily revenue, monthly sales trends, and lifetime business growth.</p>
              </div>
            </div>

            {/* Analytics Type Selector & Controls */}
            <div className="analytics-selector-bar">
              <div className="analytics-subtab-group">
                <button
                  className={`analytics-subtab-btn ${analyticsType === 'daily' ? 'active' : ''}`}
                  onClick={() => setAnalyticsType('daily')}
                >
                  Daily Analysis
                </button>
                <button
                  className={`analytics-subtab-btn ${analyticsType === 'monthly' ? 'active' : ''}`}
                  onClick={() => setAnalyticsType('monthly')}
                >
                  Monthly Analysis
                </button>
                <button
                  className={`analytics-subtab-btn ${analyticsType === 'yearly' ? 'active' : ''}`}
                  onClick={() => setAnalyticsType('yearly')}
                >
                  Yearly Analysis
                </button>
                <button
                  className={`analytics-subtab-btn ${analyticsType === 'overall' ? 'active' : ''}`}
                  onClick={() => setAnalyticsType('overall')}
                >
                  Overall Business
                </button>
              </div>

              {/* Dynamic Period Selectors */}
              <div>
                {analyticsType === 'daily' && (
                  <input
                    type="date"
                    className="analytics-date-picker"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                )}

                {analyticsType === 'monthly' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      className="analytics-date-picker"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                        <option key={m} value={m}>
                          {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                    <select
                      className="analytics-date-picker"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                    >
                      {[2024, 2025, 2026, 2027].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                )}

                {analyticsType === 'yearly' && (
                  <select
                    className="analytics-date-picker"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  >
                    {[2024, 2025, 2026, 2027].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Metric Summary Cards */}
            {analyticsLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                <span className="spinner" style={{ width: '32px', height: '32px' }}></span>
                <p style={{ marginTop: '1rem' }}>Calculating financial revenue report...</p>
              </div>
            ) : analyticsData ? (
              <>
                <div className="analytics-grid">
                  <div className="metric-card">
                    <div className="metric-header">
                      <span className="metric-title">Total Revenue ({analyticsData.period})</span>
                      <DollarSign size={20} color="#34d399" />
                    </div>
                    <div className="metric-value" style={{ color: '#34d399' }}>
                      ${analyticsData.totalRevenue ? parseFloat(analyticsData.totalRevenue).toFixed(2) : '0.00'}
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <span className="metric-title">Orders Completed</span>
                      <ShoppingBag size={20} color="#818cf8" />
                    </div>
                    <div className="metric-value">{analyticsData.totalOrders}</div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <span className="metric-title">Avg. Order Value</span>
                      <TrendingUp size={20} color="#fbbf24" />
                    </div>
                    <div className="metric-value">
                      ${analyticsData.averageOrderValue ? parseFloat(analyticsData.averageOrderValue).toFixed(2) : '0.00'}
                    </div>
                  </div>

                  <div className="metric-card">
                    <div className="metric-header">
                      <span className="metric-title">Catalog & User Base</span>
                      <Users size={20} color="#f472b6" />
                    </div>
                    <div style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '4px' }}>
                      Products: <strong style={{ color: '#fff' }}>{analyticsData.totalProducts}</strong> | Users: <strong style={{ color: '#fff' }}>{analyticsData.totalUsers}</strong>
                    </div>
                  </div>
                </div>

                {/* Detailed Transactions List */}
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Order Transactions ({analyticsData.orderSummaries ? analyticsData.orderSummaries.length : 0})
                  </h3>
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
                        {!analyticsData.orderSummaries || analyticsData.orderSummaries.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                              No orders found for the selected period ({analyticsData.period}).
                            </td>
                          </tr>
                        ) : (
                          analyticsData.orderSummaries.map((ord) => (
                            <tr key={ord.orderId}>
                              <td style={{ fontWeight: 600, color: '#818cf8' }}>#{ord.orderId}</td>
                              <td>
                                <div style={{ fontWeight: 600, color: '#fff' }}>{ord.userName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.userEmail}</div>
                              </td>
                              <td>{ord.date}</td>
                              <td style={{ fontWeight: 700, color: '#34d399' }}>
                                ${parseFloat(ord.totalAmount).toFixed(2)}
                              </td>
                              <td>
                                <span style={{
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: ord.status === 'SUCCESS' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                  color: ord.status === 'SUCCESS' ? '#34d399' : '#fbbf24'
                                }}>
                                  {ord.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
      </main>

      {/* ────────────────── MODAL: ADD PRODUCT ────────────────── */}
      {isAddProductModalOpen && (
        <div className="modal-overlay">
          <div className="admin-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="admin-modal-title" style={{ margin: 0 }}>Add New Product</h2>
              <X size={20} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsAddProductModalOpen(false)} />
            </div>

            <form onSubmit={handleAddProductSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Amber EDP"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="99.99"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Stock Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Product Category</label>
                <select
                  required
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows="3"
                  placeholder="Enter product features, notes, fragrance details..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.75rem 1.5rem', background: '#6366f1', border: 'none', color: '#fff', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────── MODAL: DELETE PRODUCT CONFIRMATION ────────────────── */}
      {deleteProductCandidate && (
        <div className="modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Delete Product?</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong style={{ color: '#fff' }}>"{deleteProductCandidate.name}"</strong>? This will remove it permanently from customer browsing.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteProductCandidate(null)}
                style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProductConfirm}
                style={{ padding: '0.75rem 1.5rem', background: '#ef4444', border: 'none', color: '#fff', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── MODAL: EDIT USER & ROLE ────────────────── */}
      {editUserCandidate && (
        <div className="modal-overlay">
          <div className="admin-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="admin-modal-title" style={{ margin: 0 }}>Edit User Details & Role</h2>
              <X size={20} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setEditUserCandidate(null)} />
            </div>

            <form onSubmit={handleEditUserSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Username</label>
                <input
                  type="text"
                  required
                  value={editUserData.username}
                  onChange={(e) => setEditUserData({ ...editUserData, username: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Assign User Role</label>
                <select
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="USER">USER (Standard Customer)</option>
                  <option value="ADMIN">ADMIN (System Administrator)</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>New Password (Leave blank to keep unchanged)</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditUserCandidate(null)}
                  style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.75rem 1.5rem', background: '#6366f1', border: 'none', color: '#fff', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────── MODAL: DELETE USER CONFIRMATION ────────────────── */}
      {deleteUserCandidate && (
        <div className="modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Delete User Account?</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete user <strong style={{ color: '#fff' }}>"{deleteUserCandidate.username}"</strong> ({deleteUserCandidate.email})?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteUserCandidate(null)}
                style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUserConfirm}
                style={{ padding: '0.75rem 1.5rem', background: '#ef4444', border: 'none', color: '#fff', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
