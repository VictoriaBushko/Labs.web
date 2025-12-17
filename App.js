import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store';

import "./style/global.css";
import "./components/Header/Header.css";
import "./components/Hero/Hero.css";
import "./components/Tile/Tile.css";
import "./components/Footer/Footer.css";
import "./components/CatalogCard/CatalogCard.css";
import "./components/ui/Loader.css";
import "./pages/Auth.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Item from "./pages/Item";                   
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Login from "./pages/Login";                  
import Register from "./pages/Register";            
import { ItemsProvider } from "./context/ItemsContext"; 
import { AuthProvider } from "./context/AuthContext"; 
import ProtectedRoute from "./components/ui/ProtectedRoute"; 

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>                              
          <ItemsProvider>
            <Header />

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/catalog" element={
                <ProtectedRoute>
                  <Catalog />
                </ProtectedRoute>
              } />
              <Route path="/item/:id" element={
                <ProtectedRoute>
                  <Item />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/success" element={
                <ProtectedRoute>
                  <Success />
                </ProtectedRoute>
              } />
            </Routes>

            <Footer />
          </ItemsProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;