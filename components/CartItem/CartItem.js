import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../../redux/actions';
import api from '../../api/apiService';
import './CartItem.css';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const getPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price) || 0;
    return 0;
  };

  const formatPrice = (price) => {
    const numericPrice = getPrice(price);
    return numericPrice.toFixed(2);
  };

  const getTotalPrice = () => {
    const numericPrice = getPrice(item.price);
    return (numericPrice * item.quantity).toFixed(2);
  };

  const handleIncrement = async () => {
    try {
      await api.get(`/button-click?button=increment_${item.id}_${item.selectedOption}`);
      dispatch(incrementQuantity(item.uniqueId));
    } catch (error) {
      console.error('Error sending increment click:', error);
      dispatch(incrementQuantity(item.uniqueId));
    }
  };

  const handleDecrement = async () => {
    try {
      await api.get(`/button-click?button=decrement_${item.id}_${item.selectedOption}`);
      dispatch(decrementQuantity(item.uniqueId));
    } catch (error) {
      console.error('Error sending decrement click:', error);
      dispatch(decrementQuantity(item.uniqueId));
    }
  };

  const handleRemove = async () => {
    try {
      await api.get(`/button-click?button=remove_${item.id}_${item.selectedOption}`);
      dispatch(removeFromCart(item.uniqueId));
    } catch (error) {
      console.error('Error sending remove click:', error);
      dispatch(removeFromCart(item.uniqueId));
    }
  };

  const handleItemClick = async () => {
    try {
      await api.get(`/button-click?button=cart_item_click_${item.id}`);
    } catch (error) {
      console.error('Error sending item click:', error);
    }
  };

  if (!item) {
    return (
      <div className="cart-item">
        <div className="cart-item-error">
          <p>Помилка: товар не знайдено</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-item">
      <div className="cart-item-content">
        {}
        <Link 
          to={`/item/${item.id}`} 
          className="cart-item-image-link"
          onClick={handleItemClick}
        >
          <div className="cart-item-image">
            <img 
              src={item.image} 
              alt={item.title || 'Product image'} 
              onError={(e) => {
                console.error('Image load error for:', item.image);
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
        </Link>
        
        {}
        <div className="cart-item-info">
          <Link 
            to={`/item/${item.id}`} 
            className="cart-item-title-link"
            onClick={handleItemClick}
          >
            <h3 className="cart-item-title">
              {item.displayName || item.title || 'No title'}
              {item.selectedOption && item.selectedOption !== 'A' && (
                <span className="cart-item-option"> ({item.selectedOption})</span>
              )}
            </h3>
          </Link>
          <p className="cart-item-type">{item.type || 'No type'}</p>
          <p className="cart-item-carat">Карат: {item.carat || 'N/A'}</p>
          <p className="cart-item-price">${formatPrice(item.price)}</p>
        </div>

        <div className="cart-item-controls">
          <div className="quantity-section">
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="quantity">{item.quantity || 0}</span>
              <button 
                className="quantity-btn" 
                onClick={handleIncrement}
                disabled={item.quantity >= 10}
              >
                +
              </button>
            </div>
            <div className="item-total">
              ${getTotalPrice()}
            </div>
          </div>
          
          <button className="remove-btn" onClick={handleRemove}>
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;