import React, { useState } from "react";
import Hero from "../components/Hero/Hero";
import Tile from "../components/Tile/Tile";
import api from "../api/apiService"; 

import diamondImg from "../assets/stone1.jpg";
import emeraldImg from "../assets/stone2.jpg";
import rubyImg from "../assets/stone3.jpg";

const HEADER_HEIGHT = 72;

export default function Home() {
  const [extraShown, setExtraShown] = useState(0);

  const extraBlocks = [
    {
      title: "Як обрати камінь",
      text:
        "Почніть із бажаного розміру (каратів) і форми огранювання. " +
        "Зверніть увагу на чистоту, колір і сертифікацію."
    },
    {
      title: "Догляд за коштовностями",
      text:
        "Уникайте різких хімічних засобів, зберігайте прикраси окремо, " +
        "використовуйте м'яку серветку для очищення."
    },
    {
      title: "Популярні огранювання",
      text:
        "Round Brilliant, Emerald, Oval, Princess — кожне огранювання має " +
        "свій характер і по-різному відбиває світло."
    }
  ];

  const canShowMore = extraShown < extraBlocks.length;
  
  const handleButtonClick = (buttonName) => {
    api.get(`/button-click?button=${encodeURIComponent(buttonName)}`)
      .then(response => {
        console.log('Button click recorded:', buttonName);
      })
      .catch(error => {
        console.error('Error sending button click:', error);
      });
  };

  const showMore = () => {
    setExtraShown((n) => Math.min(n + 1, extraBlocks.length));
    handleButtonClick('view_more_home');
  };

  return (
    <main style={{ paddingTop: HEADER_HEIGHT }}>
      <Hero />

      <section className="tiles-section container">
        <div className="tiles">
          <Tile
            title="Diamond"
            image={diamondImg}
            text={
              "Бездоганно прозорий діамант вагою 2.1 карата, огранювання Brilliant. " +
              "Ціна — $12,600."
            }
          />

          <Tile
            title="Sapphire"
            image={emeraldImg}
            text={
              "Небесно-синій сапфір 2.0 карата, вартість — $6,700. " +
              "Символ мудрості й відданості."
            }
          />

          <Tile
            title="Ruby"
            image={rubyImg}
            text={
              "Яскраво-червоний рубін вагою 2.5 карата, ціна — $9,000. " +
              "Уособлює пристрасть і життєву енергію."
            }
          />
        </div>

        {extraBlocks.slice(0, extraShown).map((b, i) => (
          <div key={i} className="container" style={{ maxWidth: 900, marginTop: 20, textAlign: "left" }}>
            <h3 style={{ color: "#1e3a8a", marginBottom: 6 }}>{b.title}</h3>
            <p style={{ color: "#475569", marginTop: 0 }}>{b.text}</p>
          </div>
        ))}

        {canShowMore && (
          <button 
            className="btn-primary" 
            onClick={showMore} 
            style={{ marginTop: 16 }}
          >
            View more
          </button>
        )}
      </section>
    </main>
  );
}