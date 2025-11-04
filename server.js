const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');

const pricePerCarat = {
  Diamond: 5000,
  Ruby: 1000,
  Emerald: 800,
  Sapphire: 600,
  Opal: 56,
};

function addPrices(item) {
  const ppc = pricePerCarat[item.type] ?? 0;
  return {
    ...item,
    pricePerCarat: ppc,
    price: +(ppc * Number(item.carats)).toFixed(2),
  };
}

function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeDB(arr) {
  fs.writeFileSync(DB_FILE, JSON.stringify(arr, null, 2), 'utf-8');
}

let stones = readDB();
if (!stones.length) {
  stones = [
    { id: randomUUID(), type: 'Opal',     carats: 6 },
    { id: randomUUID(), type: 'Ruby',     carats: 2.2 },
    { id: randomUUID(), type: 'Diamond',  carats: 0.5 },
    { id: randomUUID(), type: 'Emerald',  carats: 1.1 },
    { id: randomUUID(), type: 'Sapphire', carats: 0.9 },
  ].map(addPrices);
  writeDB(stones);
}

app.get('/stones', (req, res) => {
  const {
    q = '',
    type,
    minCarats,
    maxCarats,
    sortBy = 'type',           
    order = 'asc',             
    page = '1',
    pageSize = '50',
  } = req.query;

  const nPage = Math.max(1, parseInt(page, 10) || 1);
  const nSize = Math.min(200, Math.max(1, parseInt(pageSize, 10) || 50));

  let data = readDB();

  if (q) {
    const ql = String(q).toLowerCase();
    data = data.filter(s => String(s.type).toLowerCase().includes(ql));
  }
  if (type) {
    data = data.filter(s => s.type === type);
  }
  if (minCarats !== undefined) {
    const v = Number(minCarats);
    if (!Number.isNaN(v)) data = data.filter(s => Number(s.carats) >= v);
  }
  if (maxCarats !== undefined) {
    const v = Number(maxCarats);
    if (!Number.isNaN(v)) data = data.filter(s => Number(s.carats) <= v);
  }

  const allowedSort = new Set(['type', 'carats', 'price', 'pricePerCarat']);
  const key = allowedSort.has(sortBy) ? sortBy : 'type';
  const dir = order === 'desc' ? -1 : 1;

  data.sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (key === 'type') return String(av).localeCompare(String(bv)) * dir;
    return (Number(av) - Number(bv)) * dir;
  });

  const total = data.length;
  const start = (nPage - 1) * nSize;
  const items = data.slice(start, start + nSize);

  res.json({ items, total, page: nPage, pageSize: nSize });
});

app.get('/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const data = readDB();
  const results = data.filter(s => s.type.toLowerCase().includes(q));
  res.json({ items: results, total: results.length, page: 1, pageSize: results.length || 0 });
});

app.get('/stones/:id', (req, res) => {
  const data = readDB();
  const stone = data.find(s => s.id === req.params.id);
  if (!stone) return res.status(404).json({ error: 'Not found' });
  res.json(stone);
});

app.post('/stones', (req, res) => {
  const { type, carats } = req.body || {};
  if (!type || !(type in pricePerCarat) || !carats || Number(carats) <= 0) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const data = readDB();
  const item = addPrices({ id: randomUUID(), type, carats: Number(carats) });
  data.push(item);
  writeDB(data);
  res.status(201).json(item);
});

app.put('/stones/:id', (req, res) => {
  const { type, carats } = req.body || {};
  if (!type || !(type in pricePerCarat) || !carats || Number(carats) <= 0) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const data = readDB();
  const idx = data.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const updated = addPrices({ id: data[idx].id, type, carats: Number(carats) });
  data[idx] = updated;
  writeDB(data);
  res.json(updated);
});

app.delete('/stones/:id', (req, res) => {
  const data = readDB();
  const before = data.length;
  const filtered = data.filter(s => s.id !== req.params.id);
  if (filtered.length === before) {
    return res.status(404).json({ error: 'Not found' });
  }
  writeDB(filtered);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` API running on http://localhost:${PORT}`);
});
