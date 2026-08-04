import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ShoppingCart, User, LogOut, Package, UserCircle } from 'lucide-react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side: Logo & Brand */}
        <div className="navbar-brand" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
          <ShoppingBag className="navbar-logo" size={28} />
          <span className="navbar-title">ShopNest</span>
        </div>

        {/* Right Side: Cart & Avatar */}
        <div className="navbar-actions">
          <div className="cart-icon-wrapper" onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>
          
          <div className="avatar-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
            <div className="avatar-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{ cursor: 'pointer' }} title="Profile Menu">
              <User size={24} />
            </div>
            
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}>
                  <UserCircle size={18} />
                  <span>Profile</span>
                </div>
                <div className="dropdown-item" onClick={() => { setIsDropdownOpen(false); navigate('/orders'); }}>
                  <Package size={18} />
                  <span>Orders</span>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item text-danger" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
