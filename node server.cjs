<<<<<<< HEAD
const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi MySQL
const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Gagal koneksi MySQL:", err);
    return;
  }
  console.log("MySQL terhubung!");

  // Buat tabel orders
  db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(50) PRIMARY KEY,
      customer_name VARCHAR(100),
      phone VARCHAR(20),
      order_type VARCHAR(20),
      table_number VARCHAR(10),
      notes TEXT,
      payment_method VARCHAR(20),
      items JSON,
      total INT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("Gagal buat tabel:", err);
    else console.log("Tabel orders siap!");
  });
});

// GET semua orders
app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    results.forEach(r => { r.items = JSON.parse(r.items || "[]"); });
    res.json(results);
  });
});

// POST buat order baru
app.post("/api/orders", (req, res) => {
  const order = req.body;
  const id = `order_${Date.now()}`;
  db.query(
    "INSERT INTO orders (id, customer_name, phone, order_type, table_number, notes, payment_method, items, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, order.customer_name, order.phone, order.order_type, order.table_number, order.notes, order.payment_method, JSON.stringify(order.items), order.total],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, ...order });
    }
  );
});

// PUT update status order
app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// DELETE hapus order
app.delete("/api/orders/:id", (req, res) => {
  db.query("DELETE FROM orders WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
=======
const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi MySQL
const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Gagal koneksi MySQL:", err);
    return;
  }
  console.log("MySQL terhubung!");

  // Buat tabel orders
  db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(50) PRIMARY KEY,
      customer_name VARCHAR(100),
      phone VARCHAR(20),
      order_type VARCHAR(20),
      table_number VARCHAR(10),
      notes TEXT,
      payment_method VARCHAR(20),
      items JSON,
      total INT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("Gagal buat tabel:", err);
    else console.log("Tabel orders siap!");
  });
});

// GET semua orders
app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    results.forEach(r => { r.items = JSON.parse(r.items || "[]"); });
    res.json(results);
  });
});

// POST buat order baru
app.post("/api/orders", (req, res) => {
  const order = req.body;
  const id = `order_${Date.now()}`;
  db.query(
    "INSERT INTO orders (id, customer_name, phone, order_type, table_number, notes, payment_method, items, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, order.customer_name, order.phone, order.order_type, order.table_number, order.notes, order.payment_method, JSON.stringify(order.items), order.total],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, ...order });
    }
  );
});

// PUT update status order
app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// DELETE hapus order
app.delete("/api/orders/:id", (req, res) => {
  db.query("DELETE FROM orders WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
>>>>>>> 6c034dc56efe1c8b3542e1e60cf5c1d4c4b022e2
});