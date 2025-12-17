const getNumericPrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price) || 0;
  return 0;
};

export const selectCartItems = (state) => {
  if (!state || !state.cart || !state.cart.items) {
    return [];
  }
  
  return state.cart.items;
};

export const selectCartTotal = (state) => {
  const items = selectCartItems(state);
  return items.reduce((total, item) => {
    return total + (getNumericPrice(item.price) * item.quantity);
  }, 0);
};

export const selectCartItemsCount = (state) => {
  const items = selectCartItems(state);
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const loadUserCartFromStorage = () => {
  try {
    const userEmail = localStorage.getItem('userEmail') || 'guest';
    const cartData = localStorage.getItem('userCart_' + userEmail);
    
    if (cartData) {
      return JSON.parse(cartData);
    }
  } catch (err) {
    console.error('Error loading cart from storage:', err);
  }
  return [];
};