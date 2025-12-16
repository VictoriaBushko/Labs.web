import { Link } from "react-router-dom";
import PrimaryButton from "../ui/PrimaryButton";
import api from "../../api/apiService";
import "./CatalogCard.css";

export default function CatalogCard({ item }) {
  const getDescription = (type, title) => {
    const descriptions = {
      "Diamond": {
        "Round Brilliant Diamond": "Класичний круглий діамант, прозорість VVS1, колір D. Ідеальний блиск та гра світла. Ідеально підходить для заручних кілець.",
        "Emerald-Cut Diamond": "Сходинкове огранювання, акцент на чистоті каменя. Витончена геометрія та елегантний вигляд. Символ вишуканості."
      },
      "Sapphire": {
        "Royal Blue Sapphire": "Насичений небесно-синій сапфір зі Шрі-Ланки. Символ мудрості й відданості. Природна краса та глибина кольору.",
        "Cornflower Sapphire": "Легкий «васильковий» відтінок, рідкісний тон. Гармонійний баланс кольору та прозорості. Унікальний та витончений."
      },
      "Ruby": {
        "Pigeon Blood Ruby": "Яскраво-червоний рубін з високою насиченістю кольору. Енергія та пристрасть. Найцінніший відтінок рубінів.",
        "Oval Ruby": "Овальне огранювання, теплий червоний колір. Виглядає більшим за свій карат. Ідеальний для кулонів та сережок."
      }
    };
    
    return descriptions[type]?.[title] || item.description || item.desc || "Ексклюзивний дорогоцінний камінь найвищої якості.";
  };

  const handleButtonClick = (buttonName) => {
    api.get(`/button-click?button=${encodeURIComponent(buttonName)}`)
      .then(response => {
        console.log('Button click recorded:', buttonName);
      })
      .catch(error => {
        console.error('Error sending button click:', error);
      });
  };

  const handleDetailsClick = () => {
    handleButtonClick(`details_${item.id}`);
  };

  const description = getDescription(item.type, item.title);

  return (
    <article className="catalog-card">
      <div className="catalog-card-image-wrapper">
        <img className="catalog-card-image" src={item.image} alt={item.title} />
      </div>

      <div className="catalog-card-content">
        <div className="catalog-card-text-wrapper">
          <h3 className="catalog-card-title">{item.title}</h3>
          <p className="catalog-card-text">{description}</p>
        </div>

        <div className="catalog-card-bottom">
          <p className="catalog-card-price">
            Ціна: <span>${item.price}</span>
          </p>
          <p className="catalog-card-carat">Карат: {item.carat}</p>

          <Link to={`/item/${item.id}`}>
            <PrimaryButton onClick={handleDetailsClick}>Детальніше</PrimaryButton>
          </Link>
        </div>
      </div>
    </article>
  );
}