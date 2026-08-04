import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
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

function App() {
  const location = useLocation();

  useEffect(() => {
    // Handle back-forward cache or back button press after logout
    const handleAuthCheck = () => {
      const publicPaths = ['/login', '/register', '/verify'];
      if (!authService.isAuthenticated() && !publicPaths.includes(window.location.pathname)) {
        window.location.replace('/login');
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  )
}

export default App
