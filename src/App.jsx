import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminRegisterPage from './pages/AdminRegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import authService from './services/authService'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function PrivateRoute({ children }) {
  const isAuth = authService.isAuthenticated()
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AdminRoute({ children }) {
  const isAuth = authService.isAuthenticated()
  const userStr = localStorage.getItem('user')
  let isAdmin = false

  if (userStr) {
    try {
      const u = JSON.parse(userStr)
      if (u && u.role && u.role.toUpperCase().includes('ADMIN')) {
        isAdmin = true
      }
    } catch (e) {
      console.error('Error parsing admin role', e)
    }
  }

  if (!isAuth || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

function App() {
  const location = useLocation();

  useEffect(() => {
    // Handle back-forward cache or back button press after logout
    const handleAuthCheck = () => {
      const publicPaths = ['/login', '/admin', '/admin/login', '/admin/register', '/register', '/verify'];
      if (!authService.isAuthenticated() && !publicPaths.includes(window.location.pathname)) {
        if (window.location.pathname.startsWith('/admin')) {
          window.location.replace('/admin/login');
        } else {
          window.location.replace('/login');
        }
      }
    };

    window.addEventListener('pageshow', handleAuthCheck);
    window.addEventListener('popstate', handleAuthCheck);

    // Initial check on location change
    handleAuthCheck();

    return () => {
      window.removeEventListener('pageshow', handleAuthCheck);
      window.removeEventListener('popstate', handleAuthCheck);
    };
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <PrivateRoute>
              <OrderSuccessPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/admin" element={<AdminLoginPage />} />

        {/* Fallback Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  )
}

export default App
