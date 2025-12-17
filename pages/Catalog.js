import { useState, useEffect } from "react";
import { useItems } from "../context/ItemsContext";
import CatalogCard from "../components/CatalogCard/CatalogCard";
import Select from "../components/ui/Select";
import SearchInput from "../components/ui/SearchInput";
import PrimaryButton from "../components/ui/PrimaryButton";
import Loader from "../components/ui/Loader";

export default function Catalog() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("any");
  const [carat, setCarat] = useState("any");
  const [price, setPrice] = useState("any");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const { items, loading, error, getFiltered } = useItems();

  useEffect(() => {
    const applyFilters = async () => {
      const filters = {};
      
      if (type !== "any") filters.type = type;
      if (carat !== "any") filters.carat = carat;
      if (price !== "any") filters.price = price;
      if (q.trim() !== "") filters.search = q;

      console.log(' Всі фільтри для API:', filters);

      setIsFiltering(true);
      try {
        console.log(' Відправляю запит до API...');
        const filtered = await getFiltered(filters);
        console.log(' Отримано від API:', filtered.length, 'товарів');
        setFilteredItems(filtered);
      } catch (err) {
        console.error(' Помилка фільтрації:', err);
        setFilteredItems(items);
      } finally {
        setIsFiltering(false);
      }
    };

    const timeoutId = setTimeout(applyFilters, q ? 300 : 0);
    
    return () => clearTimeout(timeoutId);
  }, [type, carat, price, q, items, getFiltered]);

  const reset = () => {
    setQ("");
    setType("any");
    setCarat("any");
    setPrice("any");
  };

  const handleTypeChange = (e) => {
    console.log(' Змінюю тип на:', e.target.value);
    setType(e.target.value);
  };

  const handleCaratChange = (e) => {
    console.log(' Змінюю карат на:', e.target.value);
    setCarat(e.target.value);
  };

  const handlePriceChange = (e) => {
    console.log(' Змінюю ціну на:', e.target.value);
    setPrice(e.target.value);
  };

  if (loading && items.length === 0) {
    return (
      <main className="container catalog-page" style={{ padding: "40px 0" }}>
        <Loader />
      </main>
    );
  }

  if (error && items.length === 0) {
    return (
      <main className="container catalog-page" style={{ padding: "40px 0" }}>
        <div style={{ textAlign: "center", color: "#ef4444" }}>
          <h3>Помилка завантаження</h3>
          <p>{error}</p>
          <PrimaryButton onClick={() => window.location.reload()}>
            Спробувати знову
          </PrimaryButton>
        </div>
      </main>
    );
  }

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
        <Select 
          label="Тип каменю" 
          value={type} 
          onChange={handleTypeChange}  
        >
          <option value="any">Всі</option>
          <option value="Diamond">Діаманти</option>
          <option value="Sapphire">Сапфіри</option>
          <option value="Ruby">Рубіни</option>
        </Select>

        <Select 
          label="Карат" 
          value={carat} 
          onChange={handleCaratChange}  
        >
          <option value="any">Всі</option>
          <option value="0-1">0–1 карат</option>
          <option value="1-2">1–2 карати</option>
          <option value="2-3">2–3 карати</option>
          <option value="3+">3+ карати</option>
        </Select>

        <Select 
          label="Ціна" 
          value={price} 
          onChange={handlePriceChange}  
        >
          <option value="any">Всі</option>
          <option value="0-5000">$0–5,000</option>
          <option value="5000-9000">$5,000–9,000</option>
          <option value="9000+">$9,000+</option>
        </Select>

        <PrimaryButton onClick={reset}>Скинути</PrimaryButton>

        <SearchInput 
          value={q} 
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук..."
        />
      </div>

      {(loading || isFiltering) && <Loader />}

      {!loading && !isFiltering && (
        <div className="catalog-cards-container">
          {filteredItems.length > 0 ? (
            filteredItems.map((p) => (
              <CatalogCard key={p.id} item={p} />
            ))
          ) : (
            <div style={{ textAlign: "center", width: "100%", padding: "40px" }}>
              <h3>Товари не знайдено</h3>
              <p>Спробуйте змінити параметри пошуку</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}