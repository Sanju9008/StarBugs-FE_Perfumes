import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';
import cartService from '../services/cartService';
import { toast } from 'react-toastify';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          productService.getAllCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        
        // Also fetch cart count
        try {
            const cartData = await cartService.getCart();
            setCartCount(cartData.cartTotalItems || 0);
            setCartItems(cartData.items || []);
        } catch(e) {
            console.error("Failed to fetch initial cart", e);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryFilter]);

  const handleAddToCart = async (product) => {
    try {
        const data = await cartService.addToCart(product.productId, 1);
        setCartCount(data.cartTotalItems);
        setCartItems(data.items || []);
        toast.success(`Added ${product.name} to cart`);
    } catch(e) {
        console.error("Failed to add to cart", e);
        toast.error("Failed to add to cart");
    }
  };
  
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      const data = await cartService.updateQuantity(cartItemId, newQuantity);
      setCartCount(data.cartTotalItems);
      setCartItems(data.items || []);
    } catch (e) {
      console.error("Failed to update quantity", e);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const data = await cartService.removeFromCart(cartItemId);
      setCartCount(data.cartTotalItems);
      setCartItems(data.items || []);
      toast.info("Item removed from cart");
    } catch (e) {
      console.error("Failed to remove item", e);
      toast.error("Failed to remove item");
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategoryFilter === 'all') return true;
    if (!product.category) return false;
    
    const catName = product.category.categoryName ? product.category.categoryName.toLowerCase() : '';
    const catId = product.category.categoryId;

    if (selectedCategoryFilter === 'mens') {
      return catId === 2 || (catName.includes('men') && !catName.includes('women'));
    }
    if (selectedCategoryFilter === 'womens') {
      return catId === 1 || catName.includes('women');
    }
    if (selectedCategoryFilter === 'luxury') {
      return catId === 3 || catName.includes('lux');
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="products-page-container">
      <Navbar cartCount={cartCount} />
      <CategoryBar 
        selectedCategoryFilter={selectedCategoryFilter}
        onSelectCategory={setSelectedCategoryFilter}
      />
      
      <main className="products-main">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading premium fragrances...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <>
            <div className="products-grid">
              {paginatedProducts.map(product => {
                const cartItem = cartItems.find(item => item.productId === product.productId);
              return (
                <ProductCard 
                  key={product.productId} 
                  product={product} 
                  cartItem={cartItem}
                  onAddToCart={handleAddToCart} 
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              );
            })}
            </div>

            {/* Customer Products Pagination Bar */}
            {filteredProducts.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                margin: '2.5rem 0 1.5rem 0',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: currentPage === 1 ? 'rgba(255,255,255,0.02)' : '#1e293b',
                    color: currentPage === 1 ? '#64748b' : '#fff',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  Previous
                </button>

                <span style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 600 }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: currentPage === totalPages ? 'rgba(255,255,255,0.02)' : '#1e293b',
                    color: currentPage === totalPages ? '#64748b' : '#fff',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
