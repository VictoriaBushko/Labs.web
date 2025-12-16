import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREMENT_QUANTITY,
  DECREMENT_QUANTITY,
  CLEAR_CART
} from './actions';

const initialState = {
  items: []
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.uniqueId === newItem.uniqueId);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + newItem.quantity;
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: Math.min(newQuantity, 10)
        };
        
        return {
          ...state,
          items: updatedItems
        };
      } else {
        return {
          ...state,
          items: [
            ...state.items,
            {
              ...newItem,
              quantity: Math.min(newItem.quantity, 10)
            }
          ]
        };
      }

    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => item.uniqueId !== action.payload)
      };

    case INCREMENT_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.uniqueId === action.payload && item.quantity < 10
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };

    case DECREMENT_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.uniqueId === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      };

    case CLEAR_CART:
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

export default cartReducer;