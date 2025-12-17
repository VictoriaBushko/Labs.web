import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearCart, addToCart } from '../redux/actions';
import { selectCartItems } from '../redux/selectors';
import CartItem from '../components/CartItem/CartItem';
import PrimaryButton from '../components/ui/PrimaryButton';
import api from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const HEADER_HEIGHT = 72;

const Cart = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  
  const cartItems = useSelector(selectCartItems);
  
  console.log('Cart component - cartItems:', cartItems);
  console.log('Cart component - userEmail from localStorage:', localStorage.getItem('userEmail'));

  const handleClearCart = async () => {
    try {
      await api.get('/button-click?button=clear_cart');
      dispatch(clearCart());
      alert('Кошик очищено!');
    } catch (error) {
      console.error('Помилка:', error);
      dispatch(clearCart());
      alert('Кошик очищено!');
    }
  };

  const handleContinueToCheckout = async () => {
    try {
      await api.get('/button-click?button=continue_to_checkout');
    } catch (error) {
      console.error('Помилка:', error);
    }
  };

  const handleBackToCatalog = async () => {
    try {
      await api.get('/button-click?button=back_to_catalog');
    } catch (error) {
      console.error('Помилка:', error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="container cart-page" style={{ paddingTop: HEADER_HEIGHT, paddingBottom: '60px' }}>
        <div className="cart-empty">
          <h2>Ваш кошик порожній</h2>
          <p>Додайте товари з каталогу, щоб вони з'явилися тут</p>
          <p>Поточний email: {user?.email || localStorage.getItem('userEmail') || 'Не визначено'}</p>
          
          <button 
            onClick={() => {
              const testItem = {
                id: 999,
                title: 'ТЕСТОВИЙ ТОВАР',
                price: 1000,
                type: 'Diamond',
                carat: 1.5,
                image: '/stone1.jpg',
                quantity: 2,
                selectedOption: 'Premium'
              };
              
              dispatch(addToCart(testItem));
              alert('Тестовий товар додано! Оновіть сторінку');
            }}
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              margin: '10px',
              cursor: 'pointer'
            }}
          >
            ТЕСТ: Додати товар
          </button>
          
          <Link to="/catalog">
            <PrimaryButton onClick={handleBackToCatalog}>
              До каталогу
            </PrimaryButton>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container cart-page" style={{ paddingTop: HEADER_HEIGHT, paddingBottom: '60px' }}>
      <div className="cart-header">
        <h1>Кошик покупок ({cartItems.length} товарів)</h1>
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
            До каталогу
          </PrimaryButton>
        </Link>
        
        <Link to="/checkout">
          <PrimaryButton onClick={handleContinueToCheckout}>
            Оформити замовлення
          </PrimaryButton>
        </Link>
      </div>
    </main>
  );
};

export default Cart;