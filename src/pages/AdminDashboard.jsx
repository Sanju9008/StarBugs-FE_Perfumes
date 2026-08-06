import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopNav from '../components/admin/AdminTopNav';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import AdminProducts from '../components/admin/AdminProducts';
import AdminUsers from '../components/admin/AdminUsers';
import AdminOrders from '../components/admin/AdminOrders';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'products' | 'users' | 'analytics' | 'orders'
  const [adminUser, setAdminUser] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing admin user:', e);
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AdminAnalytics />;
      case 'products':
        return <AdminProducts />;
      case 'users':
        return <AdminUsers />;
      case 'orders':
        return <AdminOrders />;
      default:
        return <AdminAnalytics />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarCollapsed={isSidebarCollapsed}
        adminUser={adminUser}
      />
      <div className={`admin-main-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <AdminTopNav 
          activeTab={activeTab}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        <main className="admin-main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
