// actions.js
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY';
export const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';
export const LOAD_USER_CART = 'LOAD_USER_CART';

export const addToCart = (item) => {
  const userEmail = localStorage.getItem('userEmail') || 'guest';
  
  return {
    type: ADD_TO_CART,
    payload: {
      ...item,
      userEmail: userEmail,
      uniqueId: `${item.id}_${item.selectedOption || 'default'}_${userEmail}`
    }
  };
};

export const removeFromCart = (uniqueId) => ({
  type: REMOVE_FROM_CART,
  payload: uniqueId
});

export const incrementQuantity = (uniqueId) => ({
  type: INCREMENT_QUANTITY,
  payload: uniqueId
});

export const decrementQuantity = (uniqueId) => ({
  type: DECREMENT_QUANTITY,
  payload: uniqueId
});

export const clearCart = () => ({
  type: CLEAR_CART
});

export const loadUserCart = (cartItems) => ({
  type: LOAD_USER_CART,
  payload: cartItems
});