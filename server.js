
const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Graceful fallback if pg is not installed yet
let Pool;
try {
  const pg = require('pg');
  Pool = pg.Pool;
} catch (e) {
  console.warn("PostgreSQL module 'pg' not found. Database features will be disabled.");
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// --- Database Connection ---
let pool = null;
if (Pool) {
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'aceprep',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
  });

  // Test DB Connection silently
  pool.connect((err, client, release) => {
    if (err) {
      console.warn('DB Connection Warning: Ensure PostgreSQL is running and .env is configured.');
    } else {
      console.log('Successfully connected to PostgreSQL database');
      release();
    }
  });
}

// --- API Routes ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), db: pool ? 'active' : 'disabled' });
});

app.get('/api/pyqs', async (req, res) => {
  if (!pool) return res.status(503).json({ error: "Database not connected" });
  try {
    const { exam, year } = req.query;
    // Placeholder for actual DB query
    // const result = await pool.query('SELECT * FROM pyqs WHERE exam = $1', [exam]);
    res.json({ message: "Connected to backend. Table setup required." });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// --- Serve React Frontend ---
const DIST_DIR = path.join(__dirname, 'dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  
  // Handle React Routing, return all requests to React app
  app.get('*', (req, res) => {
    if (fs.existsSync(HTML_FILE)) {
      res.sendFile(HTML_FILE);
    } else {
      res.status(404).send('index.html not found in dist folder. Did build fail?');
    }
  });
} else {
  // Fallback if build is missing (prevents 502 loop)
  app.get('*', (req, res) => {
    res.send(`
      <h1>Backend Running Successfully!</h1>
      <p>However, the Frontend build is missing.</p>
      <p>Please run the following command on your server:</p>
      <code>npm run build</code>
      <p>Then restart the server.</p>
    `);
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving frontend from: ${DIST_DIR}`);
});
