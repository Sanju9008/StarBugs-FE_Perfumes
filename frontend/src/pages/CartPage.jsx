import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import cartService from '../services/cartService';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import './CartPage.css';

const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCartData(data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      const data = await cartService.removeFromCart(cartItemId);
      setCartData(data);
      toast.info("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item", error);
      toast.error("Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      const data = await cartService.updateQuantity(cartItemId, newQuantity);
      setCartData(data);
    } catch (error) {
      console.error("Failed to update quantity", error);
      toast.error("Failed to update quantity");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calculate inclusive GST based on Approach 1 (Item-level)
  const GST_RATE = 18;
  const totalGSTAmount = cartData?.items?.reduce((total, item) => {
    const itemGST = item.subTotal - (item.subTotal / (1 + (GST_RATE / 100)));
    return total + itemGST;
  }, 0) || 0;

  return (
    <div className="cart-page-container">
      <Navbar cartCount={cartData?.cartTotalItems || 0} />
      
      <main className="cart-main">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate('/products')}>
            <ArrowLeft size={20} /> Continue Shopping
          </button>
          <h1>Your Shopping Cart</h1>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your cart...</p>
          </div>
        ) : !cartData || !cartData.items || cartData.items.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={64} className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any premium fragrances yet.</p>
            <button className="shop-now-btn" onClick={() => navigate('/products')}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              {cartData.items.map((item) => (
                <div key={item.cartItemId} className="cart-item-card">
                  <div className="cart-item-image">
                    <img src={item.productImage} alt={item.productName} />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.productName}</h3>
                    <p className="item-price">{formatPrice(item.price)}</p>
                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => {
                          if(item.quantity > 1) {
                            handleUpdateQuantity(item.cartItemId, item.quantity - 1);
                          } else {
                            handleRemove(item.cartItemId);
                          }
                        }}
                      >-</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                      >+</button>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <p className="item-subtotal">{formatPrice(item.subTotal)}</p>
                    <button 
                      className="remove-btn" 
                      onClick={() => handleRemove(item.cartItemId)}
                      title="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary-section">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal ({cartData.cartTotalItems} items)</span>
                <span>{formatPrice(cartData.cartTotalPrice)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row" style={{ color: '#666', fontSize: '0.9rem' }}>
                <span>Includes GST ({GST_RATE}%)</span>
                <span>{formatPrice(totalGSTAmount)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>{formatPrice(cartData.cartTotalPrice)}</span>
              </div>
              <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
