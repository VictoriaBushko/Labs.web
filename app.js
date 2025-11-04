const pricePerCarat = {
  Diamond: 5000,
  Ruby: 1000,
  Emerald: 800,
  Sapphire: 600,
  Opal: 56
};

const LS_KEY = 'stones';
const readLS  = () => JSON.parse(localStorage.getItem(LS_KEY) || '[]');
const writeLS = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

function seedIfEmpty() {
  if (readLS().length) return;
  const seed = [
    { id: uid(), type: 'Opal',     carats: 6 },
    { id: uid(), type: 'Ruby',     carats: 2.2 },
    { id: uid(), type: 'Diamond',  carats: 0.5 },
    { id: uid(), type: 'Emerald',  carats: 1.1 },
    { id: uid(), type: 'Sapphire', carats: 0.9 },
  ].map(addPrices);
  writeLS(seed);
}
seedIfEmpty();

let stones = readLS();

const cards   = document.getElementById('cards');
const search  = document.getElementById('searchInput');
const sortBtn = document.getElementById('sortBtn');
const sumBtn  = document.getElementById('sumBtn');
const summary = document.getElementById('summary');
let sortAsc = true;

let currentView = stones.slice();

function render(list = stones) {
  currentView = list;               

  cards.innerHTML = '';
  if (!list.length) {
    cards.innerHTML = '<p class="muted">Нічого не знайдено</p>';
    updateSummary();                
    return;
  }

  list.forEach(s => {
    const html = `
      <div class="card">
        <h3>${s.type}</h3>
        <p>Карати: <strong>${s.carats}</strong></p>
        <p>Ціна за карат: <strong>$${s.pricePerCarat}</strong></p>
        <p>Вартість: <strong>$${Number(s.price).toFixed(2)}</strong></p>
        <div class="btn-row">
          <a class="btn" href="edit.html?id=${s.id}">Edit</a>
          <button class="btn" data-action="remove" data-id="${s.id}">Remove</button>
        </div>
      </div>`;
    cards.insertAdjacentHTML('beforeend', html);
  });

  updateSummary();                 
}

search.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  const filtered = stones.filter(s => s.type.toLowerCase().includes(q));
  render(filtered);                
});

sortBtn.addEventListener('click', () => {
  const list = [...currentView].sort((a, b) =>
    sortAsc ? a.price - b.price : b.price - a.price
  );
  sortAsc = !sortAsc;
  render(list);
});

function updateSummary() {
  const total = currentView.reduce((sum, s) => sum + Number(s.price), 0);
  summary.textContent = `Загальна сума: $${total.toFixed(2)}`;
}
sumBtn.addEventListener('click', updateSummary);

cards.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action="remove"]');
  if (!btn) return;

  const id = btn.getAttribute('data-id');
  stones = stones.filter(s => s.id !== id);
  writeLS(stones);

  const q = search.value.trim().toLowerCase();
  const base = q ? stones.filter(s => s.type.toLowerCase().includes(q)) : stones;
  render(base);
});

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}
function addPrices(item){
  const ppc = pricePerCarat[item.type] ?? 0;
  return { ...item, pricePerCarat: ppc, price: +(ppc * item.carats).toFixed(2) };
}

render(stones);
