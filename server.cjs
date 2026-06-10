const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS — izinkan frontend dev dan GitHub Pages
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://username.github.io", // ganti dengan username GitHub kamu
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ── Database Connection ──────────────────────────────────────
const db = mysql2.createConnection({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "brewmate",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal koneksi MySQL:", err.message);
    return;
  }
  console.log("✅ MySQL terhubung!");

  // Auto-create tables
  db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id            VARCHAR(50)  PRIMARY KEY,
      customer_name VARCHAR(100),
      phone         VARCHAR(20),
      order_type    VARCHAR(20),
      table_number  VARCHAR(10),
      notes         TEXT,
      payment_method VARCHAR(20),
      items         JSON,
      total         INT,
      status        VARCHAR(20) DEFAULT 'pending',
      created_at    DATETIME    DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("❌ Gagal buat tabel orders:", err.message);
    else console.log("✅ Tabel orders siap!");
  });

  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      email      VARCHAR(100) NOT NULL UNIQUE,
      password   VARCHAR(255) NOT NULL,
      role       ENUM('user','admin') DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("❌ Gagal buat tabel users:", err.message);
    else console.log("✅ Tabel users siap!");
  });
});

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── Orders ───────────────────────────────────────────────────
app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    results.forEach(r => { r.items = JSON.parse(r.items || "[]"); });
    res.json(results);
  });
});

app.post("/api/orders", (req, res) => {
  const order = req.body;
  if (!order.customer_name || !order.items || !order.total) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }
  const id = "order_" + Date.now();
  db.query(
    `INSERT INTO orders
      (id, customer_name, phone, order_type, table_number, notes, payment_method, items, total)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, order.customer_name, order.phone, order.order_type,
     order.table_number, order.notes, order.payment_method,
     JSON.stringify(order.items), order.total],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, ...order });
    }
  );
});

app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  const validStatus = ["pending", "Diproses", "Siap", "Selesai", "Dibatalkan"];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ error: "Status tidak valid" });
  }
  db.query("UPDATE orders SET status = ? WHERE id = ?",
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.delete("/api/orders/:id", (req, res) => {
  db.query("DELETE FROM orders WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ── Start server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
