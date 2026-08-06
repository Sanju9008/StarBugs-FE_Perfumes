import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, ShoppingBag } from 'lucide-react';
import orderService from '../services/orderService';
import Navbar from '../components/Navbar';
import './OrdersPage.css';

const OrdersPage = () => {
  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getOrders();
        setOrdersData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Use a hardcoded cart count for now since we don't have the context in this standalone page
  // In a real app this would come from a global state/context
  const cartCount = 0; 

  const goHome = () => navigate('/products');

  const getStatusBadgeStyle = (status) => {
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

  const formatStatus = (status) => {
    if (!status || status === 'PENDING' || status === 'SUCCESS') return 'DELIVERED';
    return status.replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="orders-page-container">
        <Navbar cartCount={cartCount} />
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Loading your order history...</p>
        </div>
      </div>
    );
  }

  const products = ordersData?.orders?.products || [];

  return (
    <div className="orders-page-container">
      <Navbar cartCount={cartCount} />
      
      <div className="orders-main-content">
        <div className="orders-header">
          <button className="btn-back" onClick={goHome}>
            <ArrowLeft size={20} />
            Back to Shop
          </button>
          <h1>Your Orders</h1>
          {ordersData?.username && (
            <p className="orders-subtitle">Purchase history for {ordersData.username}</p>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!error && products.length === 0 ? (
          <div className="empty-orders-state">
            <Package size={64} className="empty-orders-icon" />
            <h2>No Orders Yet</h2>
            <p>Looks like you haven't made any purchases yet.</p>
            <button className="btn-shop-now" onClick={goHome}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {products.map((product, index) => (
              <div key={`${product.order_id}-${product.product_id}-${index}`} className="order-item-card">
                <div className="order-item-image">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} />
                  ) : (
                    <div className="placeholder-image">
                      <ShoppingBag size={32} />
                    </div>
                  )}
                </div>
                
                <div className="order-item-details">
                  <div className="order-item-header">
                    <h3>{product.name}</h3>
                    <span className="order-item-price">₹{product.price_per_unit.toFixed(2)}</span>
                  </div>
                  
                  <p className="order-item-desc">{product.description}</p>
                  
                  <div className="order-item-meta">
                    <div className="meta-info">
                      <span className="meta-label">Order ID:</span>
                      <span className="meta-value" style={{ color: '#818cf8', fontWeight: 600 }}>#{product.order_id}</span>
                    </div>
                    {product.date && product.date !== 'N/A' && (
                      <div className="meta-info">
                        <span className="meta-label">Date:</span>
                        <span className="meta-value">{product.date}</span>
                      </div>
                    )}
                    <div className="meta-info">
                      <span className="meta-label">Status:</span>
                      <span
                        style={{
                          padding: '0.2rem 0.65rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-block',
                          ...getStatusBadgeStyle(product.status)
                        }}
                      >
                        {formatStatus(product.status)}
                      </span>
                    </div>
                    <div className="meta-info">
                      <span className="meta-label">Qty:</span>
                      <span className="meta-value">{product.quantity}</span>
                    </div>
                    <div className="meta-info total">
                      <span className="meta-label">Total:</span>
                      <span className="meta-value">₹{product.total_price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
