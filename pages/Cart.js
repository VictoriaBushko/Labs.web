import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearCart } from '../redux/actions';
import { selectCartItems } from '../redux/selectors';
import CartItem from '../components/CartItem/CartItem';
import PrimaryButton from '../components/ui/PrimaryButton';
import api from '../api/apiService';
import './Cart.css';

const HEADER_HEIGHT = 72;

const Cart = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  console.log('=== CART PAGE DEBUG ===');
  console.log('Cart items array:', cartItems);
  console.log('Number of items:', cartItems.length);
  
  if (cartItems.length > 0) {
    console.log('First item details:', cartItems[0]);
    console.log('First item keys:', Object.keys(cartItems[0]));
  }

  const handleClearCart = async () => {
    try {
      await api.get('/button-click?button=clear_cart');
      dispatch(clearCart());
    } catch (error) {
      console.error('Error sending clear cart click:', error);
      dispatch(clearCart());
    }
  };

  const handleContinueShopping = async () => {
    try {
      await api.get('/button-click?button=continue_shopping');
    } catch (error) {
      console.error('Error sending continue shopping click:', error);
    }
  };

  const handleBackToCatalog = async () => {
    try {
      await api.get('/button-click?button=back_to_catalog');
    } catch (error) {
      console.error('Error sending back to catalog click:', error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="container cart-page" style={{ paddingTop: HEADER_HEIGHT, paddingBottom: '60px' }}>
        <div className="cart-empty">
          <h2>Ваш кошик порожній</h2>
          <p>Додайте товари з каталогу, щоб вони з'явилися тут</p>
          <Link to="/catalog">
            <PrimaryButton onClick={handleBackToCatalog}>
              Back to Catalog
            </PrimaryButton>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container cart-page" style={{ paddingTop: HEADER_HEIGHT, paddingBottom: '60px' }}>
      <div className="cart-header">
        <h1>Кошик покупок</h1>
        <button className="clear-cart-btn" onClick={handleClearCart}>
          Очистити кошик
        </button>
      </div>

      <div className="cart-items">
        {cartItems.map((item, index) => (
          <CartItem key={item.uniqueId || index} item={item} />
        ))}
      </div>

      <div className="cart-buttons">
        <Link to="/catalog">
          <PrimaryButton onClick={handleBackToCatalog}>
            Back to Catalog
          </PrimaryButton>
        </Link>
        
        <PrimaryButton onClick={handleContinueShopping}>
          Continue
        </PrimaryButton>
      </div>
    </main>
  );
};

export default Cart;