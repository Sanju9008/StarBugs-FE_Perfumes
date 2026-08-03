import React from 'react';

const ProductCard = ({ product, cartItem, onAddToCart, onUpdateQuantity, onRemove }) => {
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
        {cartItem ? (
          <div className="product-card-qty-controls" style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '1rem',
            marginTop: 'auto',
            background: '#f8f9fa',
            padding: '0.5rem',
            borderRadius: '30px'
          }}>
            <button 
              className="qty-btn"
              onClick={() => {
                if(cartItem.quantity > 1) {
                  onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
                } else {
                  onRemove(cartItem.cartItemId);
                }
              }}
              style={{
                background: 'white', border: '1px solid #ddd', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >-</button>
            <span className="qty-value" style={{fontWeight: '600'}}>{cartItem.quantity}</span>
            <button 
              className="qty-btn"
              onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
              style={{
                background: 'white', border: '1px solid #ddd', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >+</button>
          </div>
        ) : (
          <button 
            className="btn-add-to-cart"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
