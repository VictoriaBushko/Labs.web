import heroImage from "../../assets/hero.jpg";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <img src={heroImage} alt="Main product" className="hero-img" />
        <div className="hero-text">
          <h2>Дорогоцінні Камені</h2>
<p>
  Виберіть дорогоцінні камені, які підкреслять ваш стиль і стануть справжнім 
  символом індивідуальності. Ми пропонуємо тільки сертифіковані діаманти, 
  сапфіри, рубіни та смарагди найвищої якості - від 0.5 до 5 карат.
</p>
<p>
  Кожен камінь проходить експертну оцінку та має унікальний серійний номер. 
  Ціни стартують від <strong>$500 за карат</strong> залежно від чистоти, кольору й огранювання.
</p>
        </div>
      </div>
    </section>
  );
}
