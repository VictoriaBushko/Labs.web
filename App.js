import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import "./style/global.css";
import "./components/Header/Header.css";
import "./components/Hero/Hero.css";
import "./components/Tile/Tile.css";
import "./components/Footer/Footer.css";

import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";

function App() {
  return (
    <BrowserRouter>
      {}
      <Header />

      {}
      <Routes>
        <Route path="/" element={<Home />} />              {}
        <Route path="/catalog" element={<Catalog />} />    {}
        <Route path="/cart" element={<div>Cart page</div>} /> {}
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
