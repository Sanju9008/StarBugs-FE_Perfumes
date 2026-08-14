import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, ArrowLeft, Edit2, Check, X, Camera, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import userService from '../services/userService';
import addressService from '../services/addressService';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [updating, setUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [savingAddress, setSavingAddress] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setNewUsername(userData.username || '');

      // Load profile photo from database or fallback to localStorage
      if (userData.profilePhoto) {
        setProfileImage(userData.profilePhoto);
      } else {
        const savedPhoto = localStorage.getItem(`profile_photo_${userData.id}`);
        if (savedPhoto) {
          setProfileImage(savedPhoto);
        }
      }

      await loadAddresses();
    } catch (err) {
      console.error('Failed to load profile:', err);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const addressData = await addressService.getUserAddresses();
      setAddresses(addressData || []);
    } catch (err) {
      console.log('No addresses found');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        try {
          if (user?.id) {
            const updatedUser = await userService.updateUser(user.id, { profilePhoto: base64String });
            setUser(updatedUser);
            localStorage.setItem(`profile_photo_${user.id}`, base64String);
          }
          toast.success('Profile photo saved to database successfully!');
        } catch (err) {
          toast.error(err.message || 'Failed to save profile photo to database');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    try {
      setUpdating(true);
      const updatedUser = await userService.updateUser(user.id, { username: newUsername });
      setUser(updatedUser);
      setNewUsername(updatedUser.username || newUsername);
      
      const savedUserStr = localStorage.getItem('user');
      if (savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          parsedUser.username = updatedUser.username;
          localStorage.setItem('user', JSON.stringify(parsedUser));
        } catch (e) {
          console.error('Error updating cached user:', e);
        }
      }

      setIsEditing(false);
      toast.success('Username updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update username');
    } finally {
      setUpdating(false);
    }
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      fullName: user?.username || '',
      phoneNumber: '',
      streetAddress: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0
    });
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      fullName: addr.fullName || '',
      phoneNumber: addr.phoneNumber || '',
      streetAddress: addr.streetAddress || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || addr.zipCode || '',
      isDefault: !!addr.isDefault
    });
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phoneNumber || !addressForm.streetAddress || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error('Please fill in all required address fields.');
      return;
    }

    try {
      setSavingAddress(true);
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, addressForm);
        toast.success('Address updated successfully!');
      } else {
        await addressService.addAddress(addressForm);
        toast.success('New address added successfully!');
      }
      setShowAddressModal(false);
      await loadAddresses();
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressService.deleteAddress(addressId);
      toast.success('Address deleted successfully');
      await loadAddresses();
    } catch (err) {
      toast.error(err.message || 'Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="profile-page-container">
        <Navbar cartCount={0} />
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <Navbar cartCount={0} />

      <div className="profile-main-content">
        <div className="profile-header">
          <button className="btn-back" onClick={() => navigate('/products')}>
            <ArrowLeft size={20} />
            Back to Shop
          </button>
          <h1>My Profile</h1>
          <p className="profile-subtitle">View and manage your profile details and saved addresses</p>
        </div>

        {user && (
          <div className="profile-single-card-container">
            <div className="unified-profile-card">
              {/* Top Banner & Photo Upload Section */}
              <div className="profile-card-header">
                <div className="avatar-upload-wrapper">
                  <div className="avatar-large-container">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="profile-img" />
                    ) : (
                      <div className="avatar-placeholder">
                        <User size={48} />
                      </div>
                    )}
                    <label htmlFor="profile-photo-input" className="camera-upload-btn" title="Upload profile photo">
                      <Camera size={16} />
                      <input
                        type="file"
                        id="profile-photo-input"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                <div className="user-title-block">
                  <h2>{user.username}</h2>
                  <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                    <ShieldCheck size={14} />
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="card-divider"></div>

              {/* Personal Details Section */}
              <div className="section-block">
                <h3 className="section-title">Personal Details</h3>
                <div className="user-details-list">
                  <div className="detail-item">
                    <div className="detail-icon"><User size={18} /></div>
                    <div className="detail-content">
                      <span className="detail-label">Username</span>
                      {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="edit-username-form">
                          <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="edit-username-input"
                            autoFocus
                          />
                          <button type="submit" className="btn-icon-action save" disabled={updating}>
                            <Check size={16} />
                          </button>
                          <button type="button" className="btn-icon-action cancel" onClick={() => setIsEditing(false)}>
                            <X size={16} />
                          </button>
                        </form>
                      ) : (
                        <div className="value-with-edit">
                          <span className="detail-value">{user.username}</span>
                          <button className="btn-edit" onClick={() => setIsEditing(true)} title="Edit username">
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-icon"><Mail size={18} /></div>
                    <div className="detail-content">
                      <span className="detail-label">Email Address</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-divider"></div>

              {/* Saved Addresses Section */}
              <div className="section-block">
                <div className="section-header-row">
                  <h3 className="section-title">
                    <MapPin size={18} /> Saved Addresses
                  </h3>
                  <button className="btn-add-address" onClick={handleOpenAddAddress}>
                    <Plus size={16} /> Add New Address
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <p className="no-addresses-text">No saved addresses found. Click "Add New Address" above to save an address.</p>
                ) : (
                  <div className="address-cards-grid">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={`single-address-card ${addr.isDefault ? 'default-card' : ''}`}>
                        <div className="address-card-header">
                          <div className="address-name-wrapper">
                            <span className="address-name">{addr.fullName || addr.streetAddress}</span>
                            {addr.isDefault && <span className="default-badge">Default</span>}
                          </div>
                          <div className="address-card-actions">
                            <button
                              className="addr-action-btn edit"
                              onClick={() => handleOpenEditAddress(addr)}
                              title="Edit address"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="addr-action-btn delete"
                              onClick={() => handleDeleteAddress(addr.id)}
                              title="Delete address"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="address-line">{addr.streetAddress}</div>
                        <div className="address-line">{addr.city}, {addr.state} - {addr.pincode || addr.zipCode}</div>
                        <div className="address-phone">Phone: {addr.phoneNumber}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      {showAddressModal && (
        <div className="modal-backdrop">
          <div className="address-modal">
            <div className="modal-header">
              <h2>{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
              <button className="modal-close-btn" onClick={() => setShowAddressModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="address-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={addressForm.phoneNumber}
                  onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <textarea
                  value={addressForm.streetAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                  placeholder="Enter street, apartment, suite, etc."
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pincode / Zip Code</label>
                  <input
                    type="text"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    placeholder="Pincode"
                    required
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    />
                    <span>Set as default address</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowAddressModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save" disabled={savingAddress}>
                  {savingAddress ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
