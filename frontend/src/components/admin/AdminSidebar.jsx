import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, Package, Users, BarChart3, ShoppingBag, User } from 'lucide-react';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

const AdminSidebar = ({ activeTab, setActiveTab, isSidebarCollapsed, adminUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    toast.info('Logged out from Admin Portal');
    navigate('/admin/login');
  };

  const sidebarMenuItems = [
    {
      id: 'analytics',
      label: 'Business Analytics',
      icon: BarChart3,
      description: 'Sales & Metrics'
    },
    {
      id: 'products',
      label: 'Product Management',
      icon: Package,
      description: 'Catalog & Inventory'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Accounts & Roles'
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: ShoppingBag,
      description: 'Order Transactions'
    }
  ];

  return (
    <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-brand-group">
          <div className="admin-logo-icon">
            <ShieldCheck size={24} />
          </div>
          {!isSidebarCollapsed && (
            <div className="admin-brand-text">
              <h2 className="admin-title">ShopNest Admin</h2>
              <span className="admin-subtitle-badge">SALESSAVVY PORTAL</span>
            </div>
          )}
        </div>
      </div>

      <div className="admin-sidebar-nav">
        {!isSidebarCollapsed && (
          <div className="admin-sidebar-section-title">
            MAIN FEATURES
          </div>
        )}
        <div className="admin-sidebar-menu">
          {sidebarMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <div className="admin-sidebar-link-left">
                  <div className="admin-sidebar-icon-box">
                    <IconComponent size={20} />
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="admin-sidebar-link-text">
                      <span className="admin-sidebar-link-title">{item.label}</span>
                      <span className="admin-sidebar-link-desc">{item.description}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user-card">
          <div className="admin-sidebar-avatar">
            <User size={18} />
          </div>
          {!isSidebarCollapsed && (
            <div className="admin-sidebar-user-info">
              <span className="admin-user-name">{adminUser?.username || 'Admin'}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          )}
          <button
            className="admin-sidebar-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={16} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
