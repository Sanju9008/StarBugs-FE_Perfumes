import React from 'react';
import { ShoppingBag, ShoppingCart, User } from 'lucide-react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side: Logo & Brand */}
        <div className="navbar-brand">
          <ShoppingBag className="navbar-logo" size={28} />
          <span className="navbar-title">ShopNest</span>
        </div>

        {/* Right Side: Cart & Avatar */}
        <div className="navbar-actions">
          <div className="cart-icon-wrapper">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>
          
          <div className="avatar-wrapper" onClick={handleLogout} title="Click to Logout">
            <User size={24} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
