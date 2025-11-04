import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./style/global.css";
import "./components/Header/Header.css";
import "./components/Hero/Hero.css";
import "./components/Tile/Tile.css";
import "./components/Footer/Footer.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Item from "./pages/Item";                   
import { ItemsProvider } from "./context/ItemsContext"; 

function App() {
  return (
    <BrowserRouter>
      <ItemsProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/item/:id" element={<Item />} />   {}
          <Route path="/cart" element={<div className="container" style={{padding:"40px 0"}}>Cart page</div>} />
        </Routes>

        <Footer />
      </ItemsProvider>
    </BrowserRouter>
  );
}

export default App;
