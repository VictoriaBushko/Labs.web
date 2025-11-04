import { useMemo, useState } from "react";
import { useItems } from "../context/ItemsContext";
import CatalogCard from "../components/CatalogCard/CatalogCard";
import Select from "../components/ui/Select";
import SearchInput from "../components/ui/SearchInput";
import PrimaryButton from "../components/ui/PrimaryButton";

const norm = (s) =>
  (s || "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, "");

export default function Catalog() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("any");
  const [carat, setCarat] = useState("any");
  const [price, setPrice] = useState("any");

 const { items } = useItems();
 const filtered = useMemo(() => {
    const nq = norm(q);

     return items.filter((p) => {
      if (type !== "any" && p.type !== type) return false;

      const c = p.carat;
      if (carat !== "any") {
        if (carat === "0-1" && !(c >= 0 && c < 1)) return false;
        if (carat === "1-2" && !(c >= 1 && c < 2)) return false;
        if (carat === "2-3" && !(c >= 2 && c < 3)) return false;
        if (carat === "3+" && !(c >= 3)) return false;
      }

      const pr = p.price;
      if (price !== "any") {
        if (price === "0-5000" && !(pr >= 0 && pr < 5000)) return false;
        if (price === "5000-9000" && !(pr >= 5000 && pr < 9000)) return false;
        if (price === "9000+" && !(pr >= 9000)) return false;
      }

      if (!nq) return true;
      const hay = norm(`${p.title} ${p.desc} ${p.type}`);

      return hay.includes(nq);
    });
 }, [items, q, type, carat, price]);

  const reset = () => {
    setQ("");
    setType("any");
    setCarat("any");
    setPrice("any");
  };

  return (
    <main className="container catalog-page" style={{ padding: "40px 0" }}>
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
        <Select label="Gem" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="any">Any</option>
          <option value="Diamond">Diamond</option>
          <option value="Sapphire">Sapphire</option>
          <option value="Ruby">Ruby</option>
        </Select>

        <Select label="Carat" value={carat} onChange={(e) => setCarat(e.target.value)}>
          <option value="any">Any</option>
          <option value="0-1">0–1 ct</option>
          <option value="1-2">1–2 ct</option>
          <option value="2-3">2–3 ct</option>
          <option value="3+">3+ ct</option>
        </Select>

        <Select label="Price" value={price} onChange={(e) => setPrice(e.target.value)}>
          <option value="any">Any</option>
          <option value="0-5000">$0–5,000</option>
          <option value="5000-9000">$5,000–9,000</option>
          <option value="9000+">$9,000+</option>
        </Select>

        <PrimaryButton onClick={reset}>Reset</PrimaryButton>

        <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <section className="tiles" style={{ flexWrap: "wrap" }}>
        {filtered.map((p) => (
          <CatalogCard key={p.id} item={p} />
        ))}
      </section>
    </main>
  );
}
