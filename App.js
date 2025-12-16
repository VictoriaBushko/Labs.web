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

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Item from "./pages/Item";                   
import Cart from "./pages/Cart";
import { ItemsProvider } from "./context/ItemsContext"; 

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ItemsProvider>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/item/:id" element={<Item />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>

          <Footer />
        </ItemsProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;