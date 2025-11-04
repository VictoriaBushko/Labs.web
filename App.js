import React from "react";

import "./style/global.css";

import "./components/Header/Header.css";
import "./components/Hero/Hero.css";
import "./components/Tile/Tile.css";
import "./components/Footer/Footer.css";
import "./components/Navigation/Navigation.css";

import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}

export default App;
