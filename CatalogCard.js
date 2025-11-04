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
          <p className="tile-price"><strong>Price:</strong> ${item.price}</p>
          <p className="tile-carat">Carat: {item.carat}</p>
          <PrimaryButton>View more</PrimaryButton>
        </div>
      </div>
    </article>
  );
}
