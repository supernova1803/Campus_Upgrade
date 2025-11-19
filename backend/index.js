const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory demo data
const items = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' }
];

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const body = req.body || {};
  const item = { id: items.length + 1, name: body.name || `Item ${items.length + 1}` };
  items.push(item);
  res.status(201).json(item);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
