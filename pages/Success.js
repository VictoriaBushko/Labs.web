import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PrimaryButton from '../components/ui/PrimaryButton';
import api from '../api/apiService';
import './Success.css';

const HEADER_HEIGHT = 72;

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData, cartItems, cartTotal } = location.state || {};

  useEffect(() => {
    const recordSuccess = async () => {
      try {
        await api.get('/button-click?button=order_success');
      } catch (error) {
        console.error('Error recording success:', error);
      }
    };

    recordSuccess();
  }, []);

  const handleBackToHome = async () => {
    try {
      await api.get('/button-click?button=back_to_home_from_success');
      navigate('/');
    } catch (error) {
      console.error('Error sending back to home click:', error);
      navigate('/');
    }
  };

  const handleNewOrder = async () => {
    try {
      await api.get('/button-click?button=new_order_from_success');
      navigate('/catalog');
    } catch (error) {
      console.error('Error sending new order click:', error);
      navigate('/catalog');
    }
  };

  if (!orderData) {
    return (
      <main className="container success-page" style={{ paddingTop: HEADER_HEIGHT, paddingBottom: '60px' }}>
        <div className="success-empty">
          <h2>Інформація про замовлення недоступна</h2>
          <p>Схоже, ви перейшли на цю сторінку безпосередньо</p>
          <Link to="/">
            <PrimaryButton>Повернутись на головну</PrimaryButton>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container success-page" style={{ paddingTop: HEADER_HEIGHT, paddingBottom: '60px' }}>
      <div className="success-content">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h1>Замовлення успішно оформлено!</h1>
        
        <div className="success-message">
          <p>Дякуємо за ваше замовлення, <strong>{orderData.firstName} {orderData.lastName}</strong>!</p>
          <p>На ваш email <strong>{orderData.email}</strong> відправлено підтвердження замовлення з деталями.</p>
          <p>Ми зв'яжемося з вами за номером <strong>{orderData.phone}</strong> для уточнення деталей доставки.</p>
        </div>

        <div className="order-details">
          <h2>Деталі замовлення</h2>
          
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Ім'я:</span>
              <span className="detail-value">{orderData.firstName} {orderData.lastName}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{orderData.email}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Телефон:</span>
              <span className="detail-value">{orderData.phone}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Адреса доставки:</span>
              <span className="detail-value">{orderData.address}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Спосіб оплати:</span>
              <span className="detail-value">
                {orderData.paymentMethod === 'credit_card' && 'Кредитна карта'}
                {orderData.paymentMethod === 'paypal' && 'PayPal'}
                {orderData.paymentMethod === 'bank_transfer' && 'Банківський переказ'}
                {orderData.paymentMethod === 'cash_on_delivery' && 'Готівка при отриманні'}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Загальна сума:</span>
              <span className="detail-value total-price">${cartTotal ? cartTotal.toFixed(2) : '0.00'}</span>
            </div>
          </div>
          
          <div className="order-items-summary">
            <h3>Товари в замовленні:</h3>
            <ul className="items-list">
              {cartItems && cartItems.map(item => (
                <li key={item.uniqueId} className="order-item-summary">
                  <span className="item-name">{item.title}</span>
                  {item.selectedOption && item.selectedOption !== 'A' && (
                    <span className="item-option"> ({item.selectedOption})</span>
                  )}
                  <span className="item-quantity">× {item.quantity}</span>
                  <span className="item-price">${(getNumericPrice(item.price) * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="success-instructions">
          <h3>Що далі?</h3>
          <ul>
            <li> Перевірте вашу поштову скриньку для підтвердження замовлення</li>
            <li> Наш менеджер зв'яжеться з вами протягом 24 годин</li>
            <li> Час доставки: 3-5 робочих днів</li>
            <li> При доставці перевірте товар перед оплатою</li>
          </ul>
        </div>

        <div className="success-buttons">
          <PrimaryButton onClick={handleBackToHome}>
            Повернутись на головну
          </PrimaryButton>
          
          <PrimaryButton onClick={handleNewOrder}>
            Зробити нове замовлення
          </PrimaryButton>
        </div>
      </div>
    </main>
  );
};

function getNumericPrice(price) {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price) || 0;
  return 0;
}

export default Success;