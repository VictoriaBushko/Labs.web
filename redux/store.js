import { createStore } from 'redux';
import rootReducer from './rootReducer';

const getCurrentUserEmail = () => {
  return localStorage.getItem('userEmail') || 'guest';
};

const getCurrentAddress = () => {
  return localStorage.getItem('currentAddress') || 'default';
};

const getCartStorageKey = () => {
  const email = getCurrentUserEmail();
  const address = getCurrentAddress();
  return `reduxCartState_${email}_${encodeURIComponent(address)}`;
};

const loadState = () => {
  try {
    const storageKey = getCartStorageKey();
    const serializedState = localStorage.getItem(storageKey);
    console.log('Loading cart from localStorage for user:', getCurrentUserEmail(), 'address:', getCurrentAddress());
    
    if (serializedState === null) {
      console.log('No saved cart state found for this user and address');
      return undefined;
    }
    
    const parsedState = JSON.parse(serializedState);
    console.log('Loaded state:', parsedState);
    
    if (parsedState && parsedState.cart) {
      if (!Array.isArray(parsedState.cart.items)) {
        parsedState.cart.items = [];
      }
      console.log('Cart items loaded:', parsedState.cart.items.length, 'items');
      return parsedState;
    }
    
    return undefined;
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const storageKey = getCartStorageKey();
    const serializedState = JSON.stringify(state);
    localStorage.setItem(storageKey, serializedState);
    console.log('Cart saved to localStorage:', state.cart.items.length, 'items for user:', getCurrentUserEmail(), 'address:', getCurrentAddress());
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const persistedState = loadState();

const store = createStore(
  rootReducer,
  persistedState, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  saveState(store.getState());
});

window.addEventListener('beforeunload', () => {
  saveState(store.getState());
});

export default store;