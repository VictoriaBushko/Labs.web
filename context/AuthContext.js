import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/apiService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    if (token && userEmail) {
      setUser({ 
        email: userEmail,
        username: userName || userEmail.split('@')[0]
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Login attempt with:', email);
      
      await api.get('/button-click?button=login_attempt');
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = existingUsers.find(u => u.email === email);
      
      if (!user) {
        throw new Error('User not found. Please register first.');
      }
      
      if (user.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }
      
      const mockResponse = {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: { 
          username: user.username, 
          email: user.email 
        }
      };
      
      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.username);
      
      setUser({ 
        username: user.username, 
        email: user.email 
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Register attempt with:', { username, email });
      
      await api.get('/button-click?button=register_attempt');
      
      if (!username || !email || !password) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email must have at least 2 letters after dot');
      }
      
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      if (existingUsers.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      if (existingUsers.some(u => u.username === username)) {
        throw new Error('Username already taken');
      }
      
      const newUser = { 
        username, 
        email, 
        password,
        createdAt: new Date().toISOString()
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      
      const mockResponse = {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: { username, email }
      };
      
      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', username);
      
      setUser({ username, email });
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await api.get('/button-click?button=logout');
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      
      setUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed' };
    }
  };

  const saveUserData = (email, data) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData[email] = data;
      localStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  };

  const getUserData = (email) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      return userData[email] || null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    saveUserData,
    getUserData,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};