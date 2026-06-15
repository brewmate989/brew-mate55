const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://brewmate989.github.io",
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
      password   VARCHAR(255),
      picture    VARCHAR(500),
      provider   ENUM('local','google') DEFAULT 'local',
      role       ENUM('user','admin') DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("❌ Gagal buat tabel users:", err.message);
    else {
      console.log("✅ Tabel users siap!");
      const adminEmail = "admin@brewmate.com";
      db.query("SELECT id FROM users WHERE email = ?", [adminEmail], async (err, rows) => {
        if (!err && rows.length === 0) {
          const hash = await bcrypt.hash("admin123", 10);
          db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            ["Admin BrewMate", adminEmail, hash, "admin"],
            (err) => {
              if (!err) console.log("✅ Akun admin default dibuat!");
            }
          );
        }
      });
    }
  });
});

// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── AUTH ─────────────────────────────────────────────────────

// Register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Semua field wajib diisi" });

  if (password.length < 6)
    return res.status(400).json({ error: "Password minimal 6 karakter" });

  db.query("SELECT id FROM users WHERE email = ?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (rows.length > 0)
      return res.status(409).json({ error: "Email sudah terdaftar" });

    try {
      const hash = await bcrypt.hash(password, 10);
      db.query(
        "INSERT INTO users (name, email, password, provider) VALUES (?, ?, ?, 'local')",
        [name, email, hash],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Gagal membuat akun" });
          res.status(201).json({
            message: "Akun berhasil dibuat",
            user: { id: result.insertId, name, email, role: "user", picture: "" },
          });
        }
      );
    } catch {
      res.status(500).json({ error: "Server error" });
    }
  });
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email dan password wajib diisi" });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: "Server error" });
    if (rows.length === 0)
      return res.status(401).json({ error: "Email atau password salah" });

    const user = rows[0];

    if (user.provider === "google")
      return res.status(401).json({ error: "Akun ini terdaftar via Google, silakan login dengan Google" });

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: "Email atau password salah" });

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture || "",
          role: user.role,
        },
      });
    } catch {
      res.status(500).json({ error: "Server error" });
    }
  });
});

// Google Login
app.post("/api/auth/google", (req, res) => {
  const { name, email, picture } = req.body;

  if (!email)
    return res.status(400).json({ error: "Data tidak valid" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ error: "Server error" });

    if (rows.length > 0) {
      const user = rows[0];
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture || picture || "",
          role: user.role,
        },
      });
    }

    db.query(
      "INSERT INTO users (name, email, picture, provider, password) VALUES (?, ?, ?, 'google', '')",
      [name, email, picture || ""],
      (err, result) => {
        if (err) return res.status(500).json({ error: "Gagal menyimpan akun Google" });
        res.status(201).json({
          user: {
            id: result.insertId,
            name,
            email,
            picture: picture || "",
            role: "user",
          },
        });
      }
    );
  });
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
  if (!order.customer_name || !order.items || !order.total)
    return res.status(400).json({ error: "Data tidak lengkap" });

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
  if (!validStatus.includes(status))
    return res.status(400).json({ error: "Status tidak valid" });

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