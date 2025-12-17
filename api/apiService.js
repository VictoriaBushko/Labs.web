import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const IMAGE_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.map(item => ({
        ...item,
        image: item.image.startsWith('http') ? item.image : `${IMAGE_BASE_URL}${item.image}`
      }));
    }
    return response;
  },
  (error) => {
    console.error('API Помилка:', error);
    return Promise.reject(error);
  }
);

export const productsAPI = {
  getProducts: (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.type && filters.type !== 'any') {
      params.append('type', filters.type);
    }
    if (filters.carat && filters.carat !== 'any') {
      params.append('carat', filters.carat);
    }
    if (filters.price && filters.price !== 'any') {
      params.append('price', filters.price);
    }
    if (filters.search && filters.search.trim() !== '') {
      params.append('search', filters.search.trim());
    }
    
    if (filters.action) {
      params.append('action', filters.action);
    }
    if (filters.product_id) {
      params.append('product_id', filters.product_id);
    }
    if (filters.quantity) {
      params.append('quantity', filters.quantity);
    }
    if (filters.option) {
      params.append('option', filters.option);
    }
    
    params.append('nocache', Date.now());
    
    console.log(' Відправляю GET запит:', `/products?${params.toString()}`);
    
    return api.get(`/products?${params.toString()}`);
  },

  getProductById: (id) => {
    return api.get(`/products/${id}?nocache=${Date.now()}`);
  }
};

export default api;
