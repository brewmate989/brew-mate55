const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql2.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "brewmate",
});

db.connect((err) => {
  if (err) {
    console.error("Gagal koneksi MySQL:", err.message);
    return;
  }
  console.log("MySQL terhubung!");
  db.query(`CREATE TABLE IF NOT EXISTS orders (
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
  )`, (err) => {
    if (err) console.error("Gagal buat tabel:", err.message);
    else console.log("Tabel orders siap!");
  });
});

app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    results.forEach(r => { r.items = JSON.parse(r.items || "[]"); });
    res.json(results);
  });
});

app.post("/api/orders", (req, res) => {
  const order = req.body;
  const id = "order_" + Date.now();
  db.query(
    "INSERT INTO orders (id, customer_name, phone, order_type, table_number, notes, payment_method, items, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, order.customer_name, order.phone, order.order_type, order.table_number, order.notes, order.payment_method, JSON.stringify(order.items), order.total],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, ...order });
    }
  );
});

app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete("/api/orders/:id", (req, res) => {
  db.query("DELETE FROM orders WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(5000, () => {
  console.log("Server berjalan di http://localhost:5000");
});
