import React from 'react';
import { Menu } from 'lucide-react';

const AdminTopNav = ({ activeTab, isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'products': return 'Product Catalog & Inventory';
      case 'users': return 'User Account & Role Control';
      case 'orders': return 'Customer Order Transactions';
      case 'analytics': return 'Sales & Financial Analytics';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="admin-topbar" style={{ height: '64px', padding: '0 1.5rem' }}>
      <div className="admin-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="admin-mobile-toggle"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a', letterSpacing: '-0.01em' }}>
          {getTitle()}
        </h1>
      </div>
      <div className="admin-topbar-right" />
    </header>
  );
};

export default AdminTopNav;
