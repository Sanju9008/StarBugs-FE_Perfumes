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
    
    if (selectedCategoryFilter === 'mens') return product.category.categoryId === 2;
    if (selectedCategoryFilter === 'womens') return product.category.categoryId === 1;
    if (selectedCategoryFilter === 'luxury') return product.category.categoryId === 3;
    return true;
  });

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
          <div className="products-grid">
            {filteredProducts.map(product => {
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
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
