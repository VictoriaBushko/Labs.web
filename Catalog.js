import { products } from "../data/products";
import CatalogCard from "../components/CatalogCard/CatalogCard";
import Select from "../components/ui/Select";
import SearchInput from "../components/ui/SearchInput";
import PrimaryButton from "../components/ui/PrimaryButton";

const HEADER_HEIGHT = 72;

export default function Catalog() {
  return (
    <main
      className="container catalog-page"
      style={{ padding: "40px 0", paddingTop: HEADER_HEIGHT }}
    >
      <div
        className="filters"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 140px auto",
          gap: 16,
          alignItems: "end",
          marginBottom: 28,
        }}
      >
        <Select label="Gem" value="any" disabled>
          <option value="any">Any</option>
          <option value="Diamond">Diamond</option>
          <option value="Sapphire">Sapphire</option>
          <option value="Ruby">Ruby</option>
        </Select>

        <Select label="Carat" value="any" disabled>
          <option value="any">Any</option>
          <option value="0-1">0–1 ct</option>
          <option value="1-2">1–2 ct</option>
          <option value="2-3">2–3 ct</option>
          <option value="3+">3+ ct</option>
        </Select>

        <Select label="Price" value="any" disabled>
          <option value="any">Any</option>
          <option value="0-5000">$0–5,000</option>
          <option value="5000-9000">$5,000–9,000</option>
          <option value="9000+">$9,000+</option>
        </Select>

        <PrimaryButton disabled>Reset</PrimaryButton>

        <SearchInput value="" placeholder="Search" disabled />
      </div>

      {}
      <section className="tiles" style={{ flexWrap: "wrap" }}>
        {products.map((p) => (
          <CatalogCard key={p.id} item={p} />
        ))}
      </section>
    </main>
  );
}
