import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import cartService from '../services/cartService';
import addressService from '../services/addressService';
import paymentService from '../services/paymentService';
import { ArrowLeft, MapPin, Plus, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [cartData, setCartData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cart, userAddresses] = await Promise.all([
        cartService.getCart(),
        addressService.getUserAddresses()
      ]);
      setCartData(cart);
      setAddresses(userAddresses);
      
      if (userAddresses.length > 0) {
        const defaultAddr = userAddresses.find(a => a.isDefault) || userAddresses[0];
        setSelectedAddressId(defaultAddr.id);
      } else {
        setShowAddForm(true);
      }
    } catch (error) {
      console.error("Failed to load checkout data", error);
      toast.error("Failed to load checkout details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const added = await addressService.addAddress(newAddress);
      setAddresses(prev => [added, ...prev]);
      setSelectedAddressId(added.id);
      setShowAddForm(false);
      setNewAddress({
        fullName: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      toast.success("Address added successfully");
    } catch (error) {
      console.error("Failed to add address", error);
      toast.error("Failed to save address");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const GST_RATE = 18;
  const totalGSTAmount = cartData?.items?.reduce((total, item) => {
    const itemGST = item.subTotal - (item.subTotal / (1 + (GST_RATE / 100)));
    return total + itemGST;
  }, 0) || 0;

  const handleProceedToPayment = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    
    try {
      const orderResponse = await paymentService.createOrder(selectedAddressId);
      
      const options = {
        key: "rzp_test_TK5JI841MjDj62", // Razorpay Key ID
        amount: orderResponse.amount * 100, // amount in paise
        currency: orderResponse.currency,
        name: "E-Commerce Store",
        description: "Test Transaction",
        order_id: orderResponse.razorpayOrderId,
        handler: async function (response) {
          try {
            await paymentService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            toast.success("Payment successful!");
            navigate('/order-success');
          } catch (error) {
            console.error("Payment verification failed", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#000000"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
      
    } catch (error) {
      console.error("Failed to initiate payment", error);
      toast.error("Failed to initiate payment");
    }
  };

  if (loading) {
    return (
      <div className="checkout-page-container">
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="checkout-page-container">
        <Navbar />
        <main className="checkout-main">
           <h2>Your cart is empty</h2>
           <button onClick={() => navigate('/products')}>Go to Shop</button>
        </main>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <Navbar cartCount={cartData?.cartTotalItems || 0} />
      
      <main className="checkout-main">
        <div className="checkout-header">
          <button className="back-btn" onClick={() => navigate('/cart')}>
            <ArrowLeft size={20} /> Back to Cart
          </button>
          <h1>Secure Checkout</h1>
        </div>

        <div className="checkout-content">
          
          <div className="checkout-left">
            <section className="address-section">
              <h2><MapPin size={24} /> Delivery Address</h2>
              
              {addresses.length > 0 && !showAddForm && (
                <div className="address-list">
                  {addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      <div className="address-select-indicator">
                        {selectedAddressId === addr.id && <Check size={16} />}
                      </div>
                      <div className="address-details">
                        <h4>{addr.fullName} {addr.isDefault && <span className="default-badge">Default</span>}</h4>
                        <p>{addr.streetAddress}</p>
                        <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="phone">Phone: {addr.phoneNumber}</p>
                      </div>
                    </div>
                  ))}
                  <button className="add-new-btn" onClick={() => setShowAddForm(true)}>
                    <Plus size={18} /> Add New Address
                  </button>
                </div>
              )}

              {showAddForm && (
                <form className="address-form" onSubmit={handleAddAddress}>
                  <h3>Add a New Address</h3>
                  <div className="form-group">
                    <input type="text" name="fullName" placeholder="Full Name" value={newAddress.fullName} onChange={handleInputChange} required />
                    <input type="tel" name="phoneNumber" placeholder="Phone Number" value={newAddress.phoneNumber} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group full-width">
                    <input type="text" name="streetAddress" placeholder="Flat, House no., Building, Company, Apartment" value={newAddress.streetAddress} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <input type="text" name="city" placeholder="Town/City" value={newAddress.city} onChange={handleInputChange} required />
                    <input type="text" name="state" placeholder="State" value={newAddress.state} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <input type="text" name="pincode" placeholder="Pincode" value={newAddress.pincode} onChange={handleInputChange} required />
                  </div>
                  <div className="checkbox-group">
                    <input type="checkbox" id="isDefault" name="isDefault" checked={newAddress.isDefault} onChange={handleInputChange} />
                    <label htmlFor="isDefault">Make this my default address</label>
                  </div>
                  
                  <div className="form-actions">
                    {addresses.length > 0 && (
                      <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                    )}
                    <button type="submit" className="save-btn">Save Address</button>
                  </div>
                </form>
              )}
            </section>
          </div>

          <div className="checkout-right">
            <section className="order-summary-section">
              <h2>Order Summary</h2>
              <div className="summary-items">
                {cartData.items.map(item => (
                  <div key={item.cartItemId} className="summary-item">
                    <div className="item-info">
                      <span className="item-qty">{item.quantity}x</span>
                      <span className="item-name">{item.productName}</span>
                    </div>
                    <span className="item-price">{formatPrice(item.subTotal)}</span>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartData.cartTotalPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-row gst-row">
                  <span>Includes GST ({GST_RATE}%)</span>
                  <span>{formatPrice(totalGSTAmount)}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total Payable</span>
                  <span>{formatPrice(cartData.cartTotalPrice)}</span>
                </div>
              </div>
              
              <button 
                className="proceed-payment-btn" 
                onClick={handleProceedToPayment}
                disabled={!selectedAddressId}
              >
                Proceed to Payment
              </button>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
