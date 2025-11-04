import Hero from "../components/Hero/Hero";
import Tile from "../components/Tile/Tile";
import diamondImg from "../assets/stone1.jpg";
import emeraldImg from "../assets/stone2.jpg";
import rubyImg from "../assets/stone3.jpg";

const HEADER_HEIGHT = 72; 

export default function Home() {
  return (
    <main style={{ paddingTop: HEADER_HEIGHT }}>
      <Hero />

      <section className="tiles-section container">
        <div className="tiles">
          <Tile
            title="Diamond"
            image={diamondImg}
            text="Бездоганно прозорий діамант вагою 2.1 карата, огранювання Brilliant. 
Ціна - $12,600."
          />
          <Tile
            title="Sapphire"
            image={emeraldImg}
            text="Небесно-синій сапфір 2.0 карата, вартість - $6,700. 
Символ мудрості й відданості"
          />
          <Tile
            title="Ruby"
            image={rubyImg}
            text="Яскраво-червоний рубін вагою 2.5 карата, ціна - $9,000. 
Уособлює пристрасть і життєву енергію."
          />
        </div>

        <button className="btn-primary">View more</button>
      </section>
    </main>
  );
}
