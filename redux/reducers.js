import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREMENT_QUANTITY,
  DECREMENT_QUANTITY,
  CLEAR_CART,
  LOAD_USER_CART
} from './actions';

const normalizeItems = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter(item => item && typeof item === 'object');
};

const initialState = {
  items: []
};

const cartReducer = (state = initialState, action) => {
  const currentItems = Array.isArray(state.items) ? state.items : [];

  switch (action.type) {
    case ADD_TO_CART:
      const newItem = action.payload;
      const existingIndex = currentItems.findIndex(
        item => item.uniqueId === newItem.uniqueId
      );
      
      if (existingIndex !== -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + (newItem.quantity || 1)
        };
        return { ...state, items: updatedItems };
      } else {
        return {
          ...state,
          items: [...currentItems, { 
            ...newItem, 
            quantity: newItem.quantity || 1 
          }]
        };
      }

    case REMOVE_FROM_CART:
      return {
        ...state,
        items: currentItems.filter(item => item.uniqueId !== action.payload)
      };

    case INCREMENT_QUANTITY:
      return {
        ...state,
        items: currentItems.map(item =>
          item.uniqueId === action.payload && item.quantity < 10
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };

    case DECREMENT_QUANTITY:
      return {
        ...state,
        items: currentItems.map(item =>
          item.uniqueId === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      };

    case CLEAR_CART:
      return { ...state, items: [] };

    case LOAD_USER_CART:
      return {
        ...state,
        items: normalizeItems(action.payload)
      };

    default:
      return {
        ...state,
        items: currentItems
      };
  }
};

export default cartReducer;