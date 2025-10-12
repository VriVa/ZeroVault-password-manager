
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// test API
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is some data from backend' });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
