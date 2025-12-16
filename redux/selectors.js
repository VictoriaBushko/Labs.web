
const getNumericPrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price) || 0;
  return 0;
};

export const selectCartItems = (state) => {
  console.log('=== SELECTOR DEBUG ===');
  console.log('Full state received:', state);
  
  let items = [];
  
  if (state && state.cart && Array.isArray(state.cart.items)) {
    items = state.cart.items;
    console.log('Found items in state.cart.items');
  } else if (state && Array.isArray(state.items)) {
    items = state.items;
    console.log('Found items in state.items');
  } else if (Array.isArray(state)) {
    items = state;
    console.log('State is directly the items array');
  } else {
    console.warn('Cannot find items in state structure:', state);
    items = [];
  }
  
  console.log('Final items:', items);
  return items;
};

export const selectCartTotal = (state) => {
  const items = selectCartItems(state);
  return items.reduce((total, item) => {
    const numericPrice = getNumericPrice(item.price);
    return total + (numericPrice * item.quantity);
  }, 0);
};

export const selectCartItemsCount = (state) => {
  const items = selectCartItems(state);
  return items.reduce((count, item) => count + item.quantity, 0);
};