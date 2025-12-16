
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useItems } from "../context/ItemsContext";
import PrimaryButton from "../components/ui/PrimaryButton";
import { productsAPI } from "../api/apiService"; 

const HEADER_HEIGHT = 72;

export default function Item() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById } = useItems();
  const item = getById(id);

  const [countable, setCountable] = useState(1);
  const [selectable, setSelectable] = useState("A");

  const handleGoBack = async () => {
    try {
      console.log(' Go Back: Відправляю запит');
      await productsAPI.getProducts({ action: 'go_back' });
      navigate(-1);
    } catch (error) {
      console.error('Помилка Go Back:', error);
      navigate(-1);
    }
  };

  const handleAddToCart = async () => {
    try {
      console.log(' Add to Cart: Відправляю запит', { 
        product_id: item.id, 
        quantity: countable, 
        option: selectable 
      });
      await productsAPI.getProducts({ 
        action: 'add_to_cart', 
        product_id: item.id,
        quantity: countable,
        option: selectable
      });
      alert(`Added ${countable} × ${item.title} (${selectable}) to cart`);
    } catch (error) {
      console.error('Помилка Add to Cart:', error);
      alert(`Added ${countable} × ${item.title} (${selectable}) to cart`);
    }
  };

  const handleQuantityChange = async (value) => {
    try {
      console.log(' Quantity Change: Відправляю запит', { quantity: value });
      await productsAPI.getProducts({ action: 'quantity_change', quantity: value });
      setCountable(value);
    } catch (error) {
      console.error('Помилка Quantity Change:', error);
      setCountable(value);
    }
  };

  const handleSelectChange = async (value) => {
    try {
      console.log(' Select Change: Відправляю запит', { option: value });
      await productsAPI.getProducts({ action: 'select_change', option: value });
      setSelectable(value);
    } catch (error) {
      console.error('Помилка Select Change:', error);
      setSelectable(value);
    }
  };

  if (!item) {
    return (
      <main className="container" style={{ paddingTop: HEADER_HEIGHT }}>
        <h2>Item not found</h2>
        <Link to="/catalog">Back to catalog</Link>
      </main>
    );
  }

  return (
    <main
      className="container"
      style={{
        paddingTop: HEADER_HEIGHT,
        paddingBottom: "60px", 
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: 28,
          alignItems: "flex-start",
        }}
      >
        {}
        <div
          style={{
            width: "100%",
            height: 260,
            overflow: "hidden",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {}
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span className="chip">1 characteristic</span>
            <span
              className="chip"
              style={{ background: "#e0f2fe", borderColor: "#bae6fd" }}
            >
              2 characteristic
            </span>
          </div>

          <h2 style={{ marginTop: 0 }}>{item.title}</h2>
          <p style={{ color: "#475569", maxWidth: 640 }}>{item.description}</p>

          {}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "45px",
              alignItems: "flex-start",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            <label style={{ flex: "1 1 220px", minWidth: 200, maxWidth: 320 }}>
              <div
                style={{
                  fontSize: 14,
                  color: "#334155",
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Кількість
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={countable}
                onChange={(e) => handleQuantityChange(+e.target.value || 1)}
                placeholder="Enter quantity..."
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: 10,
                  fontSize: 15,
                  boxShadow: "0 2px 6px rgba(30,64,175,.08)",
                  transition: "all .25s ease",
                  outline: "none",
                  background: "#fff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
              />
            </label>

            <label style={{ flex: "1 1 260px", minWidth: 220, maxWidth: 520 }}>
              <div
                style={{
                  fontSize: 14,
                  color: "#334155",
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Опція
              </div>
              <select
                value={selectable}
                onChange={(e) => handleSelectChange(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: 10,
                  fontSize: 15,
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 6px rgba(30,64,175,.08)",
                  transition: "all .25s ease",
                  outline: "none",
                  appearance: "none",
                  backgroundImage:
                    'url("data:image/svg+xml;utf8,<svg fill=\'%236b7280\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>")',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                  backgroundSize: 18,
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
              >
                <option value="A">Select</option>
                <option value="Premium">Premium</option>
                <option value="Exclusive">Exclusive</option>
              </select>
            </label>
          </div>

          <h3 style={{ marginTop: 24 }}>Price: ${item.price}</h3>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <PrimaryButton onClick={handleGoBack}>Go back</PrimaryButton>
            <PrimaryButton onClick={handleAddToCart}>Add to cart</PrimaryButton>
          </div>
        </div>
      </div>
    </main>
  );
}