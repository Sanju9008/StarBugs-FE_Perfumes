import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  // Use the first image if available, else a placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].imageUrl 
    : 'https://via.placeholder.com/300x400?text=No+Image';

  // Format the price in INR or a currency format
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(product.price);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={imageUrl} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-subtitle">{product.description || 'Premium Fragrance'}</p>
        <div className="product-price">{formattedPrice}</div>
        <button 
          className="btn-add-to-cart"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
