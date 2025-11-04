const API = 'http://localhost:3000';

const cards   = document.getElementById('cards');
const search  = document.getElementById('searchInput');  
const sortBtn = document.getElementById('sortBtn');      
const sumBtn  = document.getElementById('sumBtn');
const summary = document.getElementById('summary');

let allStones = [];
let currentView = [];

let q = '';
let sortByKey = 'type'; 
let order = 'asc';       

async function apiGet({ q = '', sortBy = 'type', order = 'asc', page = 1, pageSize = 100 } = {}) {
  const params = new URLSearchParams({
    q, sortBy, order,
    page: String(page),
    pageSize: String(pageSize),
  });
  const r = await fetch(`${API}/stones?${params.toString()}`);
  if (!r.ok) throw new Error(`Failed to load stones: ${r.status} ${r.statusText}`);
  const data = await r.json();
  return Array.isArray(data) ? data : (data.items || []);
}

async function apiDelete(id) {
  const r = await fetch(`${API}/stones/${id}`, { method: 'DELETE' });
  if (!(r.ok || r.status === 204)) throw new Error('Failed to delete');
}

function render(list) {
  currentView = list;
  allStones   = list; 
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

function updateSummary() {
  const total = currentView.reduce((sum, s) => sum + Number(s.price), 0);
  summary.textContent = `Загальна сума: $${total.toFixed(2)}`;
}

search?.addEventListener('input', debounce(async () => {
  q = search.value.trim();
  await load(); // 
}, 300));

sortBtn?.addEventListener('click', async () => {
  sortByKey = 'price';
  order = (order === 'asc') ? 'desc' : 'asc';
  await load(); 
});

sumBtn?.addEventListener('click', updateSummary);

cards?.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action="remove"]');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  try {
    await apiDelete(id);
    await load();
  } catch (err) {
    alert('Помилка видалення: ' + err.message);
  }
});

async function load() {
  try {
    const items = await apiGet({ q, sortBy: sortByKey, order, page: 1, pageSize: 100 });
    render(items);
  } catch (err) {
    cards.innerHTML = `<div class="error">Не можу завантажити дані: ${err.message}</div>`;
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', load);

function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
