import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const AdminUsers = () => {
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [adminUserPage, setAdminUserPage] = useState(1);
  const adminUsersPerPage = 6;
  
  const [editUserCandidate, setEditUserCandidate] = useState(null);
  const [deleteUserCandidate, setDeleteUserCandidate] = useState(null);
  const [editUserData, setEditUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setAdminUserPage(1);
  }, [userSearch]);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsersList(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const openEditUserModal = (user) => {
    setEditUserCandidate(user);
    setEditUserData({
      username: user.username || '',
      email: user.email || '',
      password: '',
      role: user.role || 'USER'
    });
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!editUserCandidate) return;

    try {
      const payload = {
        username: editUserData.username,
        email: editUserData.email,
        role: editUserData.role
      };
      if (editUserData.password && editUserData.password.trim() !== '') {
        payload.password = editUserData.password;
      }

      await adminService.updateUser(editUserCandidate.id, payload);
      toast.success(`User '${editUserData.username}' updated successfully!`);
      setEditUserCandidate(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!deleteUserCandidate) return;
    try {
      await adminService.deleteUser(deleteUserCandidate.id);
      toast.success(`User '${deleteUserCandidate.username}' deleted.`);
      setDeleteUserCandidate(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = usersList.filter(u =>
    (u.username && u.username.toLowerCase().includes(userSearch.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const totalAdminUserPages = Math.max(1, Math.ceil(filteredUsers.length / adminUsersPerPage));
  const adminIndexOfLastUser = adminUserPage * adminUsersPerPage;
  const adminIndexOfFirstUser = adminIndexOfLastUser - adminUsersPerPage;
  const paginatedAdminUsers = filteredUsers.slice(adminIndexOfFirstUser, adminIndexOfLastUser);

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', width: '280px', flex: '1 1 240px', maxWidth: '340px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.85rem 0.5rem 2.3rem',
              background: '#ffffff',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              color: '#0f172a',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>User</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                  No registered users found matching search.
                </td>
              </tr>
            ) : (
              paginatedAdminUsers.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: '#64748b' }}>#{u.id}</td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role && u.role.toUpperCase().includes('ADMIN') ? 'admin' : 'user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-icon-edit"
                      title="Edit User & Roles"
                      onClick={() => openEditUserModal(u)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn-icon-danger"
                      title="Delete User"
                      onClick={() => setDeleteUserCandidate(u)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredUsers.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.75rem',
          padding: '0.6rem 1rem',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '10px',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#475569' }}>
            Showing <strong style={{ color: '#0f172a' }}>{adminIndexOfFirstUser + 1}</strong> to{' '}
            <strong style={{ color: '#0f172a' }}>{Math.min(adminIndexOfLastUser, filteredUsers.length)}</strong> of{' '}
            <strong style={{ color: '#0f172a' }}>{filteredUsers.length}</strong> users
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              disabled={adminUserPage === 1}
              onClick={() => setAdminUserPage(prev => Math.max(prev - 1, 1))}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: adminUserPage === 1 ? '#e2e8f0' : '#f1f5f9',
                color: adminUserPage === 1 ? '#94a3b8' : '#0f172a',
                cursor: adminUserPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span style={{ padding: '0 0.5rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
              Page {adminUserPage} of {totalAdminUserPages}
            </span>
            <button
              disabled={adminUserPage === totalAdminUserPages}
              onClick={() => setAdminUserPage(prev => Math.min(prev + 1, totalAdminUserPages))}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: adminUserPage === totalAdminUserPages ? '#e2e8f0' : '#f1f5f9',
                color: adminUserPage === totalAdminUserPages ? '#94a3b8' : '#0f172a',
                cursor: adminUserPage === totalAdminUserPages ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUserCandidate && (
        <div className="modal-overlay">
          <div className="admin-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="admin-modal-title" style={{ margin: 0 }}>Edit User Details & Role</h2>
              <X size={20} style={{ cursor: 'pointer', color: '#475569' }} onClick={() => setEditUserCandidate(null)} />
            </div>

            <form onSubmit={handleEditUserSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Username</label>
                <input
                  type="text"
                  required
                  value={editUserData.username}
                  onChange={(e) => setEditUserData({ ...editUserData, username: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Assign User Role</label>
                <select
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                >
                  <option value="USER">CUSTOMER / USER (Standard Shopper)</option>
                  <option value="ADMIN">ADMIN (System Administrator)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>New Password (Leave blank to keep unchanged)</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditUserCandidate(null)}
                  style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid rgba(0, 0, 0, 0.2)', color: '#0f172a', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.75rem 1.5rem', background: '#6366f1', border: 'none', color: '#ffffff', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation */}
      {deleteUserCandidate && (
        <div className="modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Delete User Account?</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete user <strong style={{ color: '#0f172a' }}>"{deleteUserCandidate.username}"</strong> ({deleteUserCandidate.email})?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteUserCandidate(null)}
                style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid rgba(0, 0, 0, 0.2)', color: '#0f172a', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUserConfirm}
                style={{ padding: '0.75rem 1.5rem', background: '#ef4444', border: 'none', color: '#ffffff', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
