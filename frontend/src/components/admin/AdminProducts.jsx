import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import productService from '../../services/productService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('all');
  const [adminProductPage, setAdminProductPage] = useState(1);
  const adminProductsPerPage = 6;
  
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [deleteProductCandidate, setDeleteProductCandidate] = useState(null);
  const [editProductCandidate, setEditProductCandidate] = useState(null);
  
  const [editProductData, setEditProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: ''
  });
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    setAdminProductPage(1);
  }, [productSearch, adminCategoryFilter]);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productService.getAllCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.categoryId) {
      toast.error('Please select a valid product category.');
      return;
    }

    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
        categoryId: parseInt(newProduct.categoryId, 10),
        imageUrl: newProduct.imageUrl
      };

      await adminService.addProduct(payload);
      toast.success(`Product '${newProduct.name}' created successfully!`);
      setIsAddProductModalOpen(false);
      setNewProduct({ name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' });
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to add product');
    }
  };

  const handleDeleteProductConfirm = async () => {
    if (!deleteProductCandidate) return;
    try {
      await adminService.deleteProduct(deleteProductCandidate.productId);
      toast.success(`Product '${deleteProductCandidate.name}' removed from inventory.`);
      setDeleteProductCandidate(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  const openEditProductModal = (p) => {
    setEditProductCandidate(p);
    setEditProductData({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      stock: p.stock !== undefined ? p.stock : '',
      categoryId: p.category?.categoryId || '',
      imageUrl: p.images && p.images.length > 0 ? p.images[0].imageUrl : ''
    });
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editProductCandidate) return;
    if (!editProductData.categoryId) {
      toast.error('Please select a valid product category.');
      return;
    }

    try {
      const payload = {
        name: editProductData.name,
        description: editProductData.description,
        price: parseFloat(editProductData.price),
        stock: parseInt(editProductData.stock, 10),
        categoryId: parseInt(editProductData.categoryId, 10),
        imageUrl: editProductData.imageUrl
      };

      await adminService.updateProduct(editProductCandidate.productId, payload);
      toast.success(`Product '${editProductData.name}' updated successfully!`);
      setEditProductCandidate(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to update product');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.category && p.category.categoryName.toLowerCase().includes(productSearch.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (adminCategoryFilter === 'all') return true;
    if (!p.category) return false;

    const catName = p.category.categoryName ? p.category.categoryName.toLowerCase() : '';
    const catId = p.category.categoryId;

    if (adminCategoryFilter === 'mens') {
      return catId === 2 || (catName.includes('men') && !catName.includes('women'));
    }
    if (adminCategoryFilter === 'womens') {
      return catId === 1 || catName.includes('women');
    }
    if (adminCategoryFilter === 'luxury') {
      return catId === 3 || catName.includes('lux');
    }
    return true;
  });

  const totalAdminProductPages = Math.max(1, Math.ceil(filteredProducts.length / adminProductsPerPage));
  const adminIndexOfLastProduct = adminProductPage * adminProductsPerPage;
  const adminIndexOfFirstProduct = adminIndexOfLastProduct - adminProductsPerPage;
  const paginatedAdminProducts = filteredProducts.slice(adminIndexOfFirstProduct, adminIndexOfLastProduct);

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', width: '280px', flex: '1 1 240px', maxWidth: '340px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
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

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Products' },
            { id: 'mens', label: "Men's" },
            { id: 'womens', label: "Women's" },
            { id: 'luxury', label: 'Luxury' }
          ].map(cat => {
            const active = adminCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setAdminCategoryFilter(cat.id)}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: active ? '1px solid #38bdf8' : '1px solid rgba(0, 0, 0, 0.1)',
                  background: active ? 'rgba(56, 189, 248, 0.15)' : '#ffffff',
                  color: active ? '#38bdf8' : '#94a3b8',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <button
          className="admin-action-btn"
          onClick={() => setIsAddProductModalOpen(true)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            borderRadius: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                  No products found in inventory.
                </td>
              </tr>
            ) : (
              paginatedAdminProducts.map((p) => {
                const img = p.images && p.images.length > 0 ? p.images[0].imageUrl : 'https://via.placeholder.com/60';
                return (
                  <tr key={p.productId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img src={img} alt={p.name} className="product-img-thumb" onError={(e) => e.target.src = 'https://via.placeholder.com/60'} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: '0.775rem', color: '#64748b', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.825rem' }}>
                        {p.category ? p.category.categoryName : 'Uncategorized'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#34d399' }}>
                      ${parseFloat(p.price).toFixed(2)}
                    </td>
                    <td>
                      <span style={{
                        color: p.stock > 10 ? '#34d399' : p.stock > 0 ? '#fbbf24' : '#ef4444',
                        fontWeight: 600
                      }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        className="btn-icon-edit"
                        title="Edit Product Details"
                        onClick={() => openEditProductModal(p)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon-danger"
                        title="Delete Product"
                        onClick={() => setDeleteProductCandidate(p)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredProducts.length > 0 && (
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
            Showing <strong style={{ color: '#0f172a' }}>{adminIndexOfFirstProduct + 1}</strong> to{' '}
            <strong style={{ color: '#0f172a' }}>{Math.min(adminIndexOfLastProduct, filteredProducts.length)}</strong> of{' '}
            <strong style={{ color: '#0f172a' }}>{filteredProducts.length}</strong> products
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              disabled={adminProductPage === 1}
              onClick={() => setAdminProductPage(prev => Math.max(prev - 1, 1))}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: adminProductPage === 1 ? '#e2e8f0' : '#f1f5f9',
                color: adminProductPage === 1 ? '#94a3b8' : '#0f172a',
                cursor: adminProductPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span style={{ padding: '0 0.5rem', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
              Page {adminProductPage} of {totalAdminProductPages}
            </span>
            <button
              disabled={adminProductPage === totalAdminProductPages}
              onClick={() => setAdminProductPage(prev => Math.min(prev + 1, totalAdminProductPages))}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: adminProductPage === totalAdminProductPages ? '#e2e8f0' : '#f1f5f9',
                color: adminProductPage === totalAdminProductPages ? '#94a3b8' : '#0f172a',
                cursor: adminProductPage === totalAdminProductPages ? 'not-allowed' : 'pointer',
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

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="modal-overlay">
          <div className="admin-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="admin-modal-title" style={{ margin: 0 }}>Add New Product</h2>
              <X size={20} style={{ cursor: 'pointer', color: '#475569' }} onClick={() => setIsAddProductModalOpen(false)} />
            </div>

            <form onSubmit={handleAddProductSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Amber EDP"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="99.99"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Stock Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Product Category</label>
                <select
                  required
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows="3"
                  placeholder="Enter product features, notes, fragrance details..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid rgba(0, 0, 0, 0.2)', color: '#0f172a', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.75rem 1.5rem', background: '#6366f1', border: 'none', color: '#ffffff', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Modal */}
      {deleteProductCandidate && (
        <div className="modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Delete Product?</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Are you sure you want to delete <strong style={{ color: '#0f172a' }}>"{deleteProductCandidate.name}"</strong>? This will remove it permanently from customer browsing.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteProductCandidate(null)}
                style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid rgba(0, 0, 0, 0.2)', color: '#0f172a', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProductConfirm}
                style={{ padding: '0.75rem 1.5rem', background: '#ef4444', border: 'none', color: '#ffffff', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProductCandidate && (
        <div className="modal-overlay">
          <div className="admin-modal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="admin-modal-title" style={{ margin: 0 }}>Edit Product Details</h2>
              <X size={20} style={{ cursor: 'pointer', color: '#475569' }} onClick={() => setEditProductCandidate(null)} />
            </div>

            <form onSubmit={handleEditProductSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midnight Amber Parfum"
                  value={editProductData.name}
                  onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="129.99"
                    value={editProductData.price}
                    onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Stock Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={editProductData.stock}
                    onChange={(e) => setEditProductData({ ...editProductData, stock: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Product Category</label>
                <select
                  required
                  value={editProductData.categoryId}
                  onChange={(e) => setEditProductData({ ...editProductData, categoryId: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={editProductData.imageUrl}
                  onChange={(e) => setEditProductData({ ...editProductData, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows="3"
                  placeholder="Enter product features, notes, fragrance details..."
                  value={editProductData.description}
                  onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: '#f1f5f9', border: '1px solid rgba(0, 0, 0, 0.15)', borderRadius: '8px', color: '#0f172a', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditProductCandidate(null)}
                  style={{ padding: '0.75rem 1.25rem', background: 'transparent', border: '1px solid rgba(0, 0, 0, 0.2)', color: '#0f172a', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.75rem 1.5rem', background: '#38bdf8', border: 'none', color: '#f1f5f9', fontWeight: 700, borderRadius: '8px', cursor: 'pointer' }}
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
