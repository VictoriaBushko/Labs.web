import { Link } from "react-router-dom";
import PrimaryButton from "../ui/PrimaryButton";

export default function CatalogCard({ item }) {
  return (
    <article className="tile">
      <div className="tile-image-wrapper">
        <img className="tile-img" src={item.image} alt={item.title} />
      </div>

      <div className="tile-content">
        <div className="tile-text-wrapper">
          <h3 className="tile-title">{item.title}</h3>
          <p className="tile-text">{item.desc}</p>
        </div>

        <div className="tile-bottom">
          <p style={{ fontWeight: 600, marginTop: 6 }}>
            Price: <span style={{ fontWeight: 400 }}>${item.price}</span>
          </p>
          <p style={{ margin: 0, color: "#475569" }}>Carat: {item.carat}</p>

          <Link to={`/item/${item.id}`}>
            <PrimaryButton>View more</PrimaryButton>
          </Link>
        </div>
      </div>
    </article>
  );
}
