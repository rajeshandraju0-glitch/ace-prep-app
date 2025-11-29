
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// --- Database Connection ---
// In a real scenario, you would import this from database.js
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'aceprep',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Test DB Connection
pool.connect((err, client, release) => {
  if (err) {
    console.warn('Warning: Could not connect to database. Ensure PostgreSQL is running and .env is configured.');
    console.error(err.message);
  } else {
    console.log('Successfully connected to PostgreSQL database');
    release();
  }
});

// --- API Routes ---
// Example: Get all PYQs from Database instead of static file
app.get('/api/pyqs', async (req, res) => {
  try {
    const { exam, year } = req.query;
    // Example Query: const result = await pool.query('SELECT * FROM pyqs WHERE exam = $1', [exam]);
    // For now, returning empty to prevent crash until DB is set up
    res.json({ message: "Connected to backend, but tables not created yet." });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- Serve React Frontend ---
// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
