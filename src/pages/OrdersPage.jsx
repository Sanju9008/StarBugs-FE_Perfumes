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
                      <span className="meta-value">{product.order_id}</span>
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
