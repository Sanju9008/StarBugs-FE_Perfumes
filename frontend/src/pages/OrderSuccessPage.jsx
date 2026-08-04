import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CheckCircle } from 'lucide-react';

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center' }}>
        <CheckCircle size={80} color="#10b981" style={{ marginBottom: '2rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1a1a1a', fontFamily: 'Playfair Display, serif' }}>Payment Successful!</h1>
        <p style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '2rem', maxWidth: '500px' }}>
          Thank you for your purchase. Your order has been placed successfully and will be shipped soon.
        </p>
        <button 
          onClick={() => navigate('/products')}
          style={{ padding: '1rem 2rem', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1.1rem', cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
