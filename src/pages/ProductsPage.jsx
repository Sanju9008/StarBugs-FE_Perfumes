import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [cartCount, setCartCount] = useState(0);
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
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
    // Here we could also call a backend API to save the cart item
  };

  const filteredProducts = selectedCategoryId 
    ? products.filter(product => product.category && product.category.categoryId === selectedCategoryId)
    : products;

  return (
    <div className="products-page-container">
      <Navbar cartCount={cartCount} />
      <CategoryBar 
        categories={categories} 
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
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
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.productId} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductsPage;
