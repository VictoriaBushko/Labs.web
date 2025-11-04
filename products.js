import diamondImg from "../assets/stone1.jpg";
import sapphireImg from "../assets/stone2.jpg";
import rubyImg from "../assets/stone3.jpg";

export const products = [
  {
    id: 1,
    type: "Diamond",
    title: "Round Brilliant Diamond",
    carat: 2.1,
    price: 12600,
    image: diamondImg,
    desc: "Класичний круглий діамант, прозорість VVS1, колір D. Ідеальний блиск."
  },
  {
    id: 2,
    type: "Sapphire",
    title: "Royal Blue Sapphire",
    carat: 2.0,
    price: 6700,
    image: sapphireImg,
    desc: "Насичений небесно-синій сапфір зі Шрі-Ланки. Символ мудрості й відданості."
  },
  {
    id: 3,
    type: "Ruby",
    title: "Pigeon Blood Ruby",
    carat: 2.5,
    price: 9000,
    image: rubyImg,
    desc: "Яскраво-червоний рубін з високою насиченістю кольору. Енергія та пристрасть."
  },
  {
    id: 4,
    type: "Diamond",
    title: "Emerald-Cut Diamond",
    carat: 1.5,
    price: 8400,
    image: diamondImg,
    desc: "Сходинкове огранювання, акцент на чистоті каменя. Витончена геометрія."
  },
  {
    id: 5,
    type: "Sapphire",
    title: "Cornflower Sapphire",
    carat: 1.9,
    price: 7100,
    image: sapphireImg,
    desc: "Легкий «васильковий» відтінок, рідкісний тон. Гармонійний баланс кольору."
  },
  {
    id: 6,
    type: "Ruby",
    title: "Oval Ruby",
    carat: 2.6,
    price: 9500,
    image: rubyImg,
    desc: "Овальне огранювання, теплий червоний. Виглядає більшим за свій карат."
  }
];
