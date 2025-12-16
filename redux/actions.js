export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY';
export const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';

const getNumericPrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price) || 0;
  return 0;
};

export const addToCart = (item) => {
  const cartItem = {
    ...item,
    price: getNumericPrice(item.price),
    uniqueId: `${item.id}_${item.selectedOption}`,
    displayName: item.displayName || `${item.title} (${item.selectedOption})`
  };
  
  return {
    type: ADD_TO_CART,
    payload: cartItem
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