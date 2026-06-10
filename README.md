# BrewMate ☕

Aplikasi pemesanan kopi berbasis web — React + Vite + Tailwind + Express + MySQL.

---

## Tech Stack

| Layer     | Teknologi                        |
|-----------|----------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, shadcn/ui |
| Backend   | Express.js (Node.js)             |
| Database  | MySQL (via XAMPP)                |
| Hosting   | GitHub Pages (frontend)          |

---

## Cara Menjalankan Lokal

### 1. Prasyarat
- Node.js v18+
- XAMPP (MySQL)
- Git

### 2. Clone & Install
```bash
git clone https://github.com/username/brew-mate.git
cd brew-mate
npm install
```

### 3. Setup Environment
```bash
# Salin file contoh
cp .env.example .env

# Edit .env sesuai konfigurasi lokal kamu
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
```

### 4. Jalankan Database
1. Buka XAMPP → Start Apache & MySQL
2. Buka `http://localhost/phpmyadmin`
3. Buat database baru bernama `brewmate`
4. Tabel akan dibuat otomatis saat server pertama kali dijalankan

### 5. Jalankan Backend
```bash
node server.cjs
# Server berjalan di http://localhost:5000
```

### 6. Jalankan Frontend
```bash
# Terminal baru
npm run dev
# Frontend di http://localhost:5173
```

---

## Deploy ke GitHub Pages (Frontend Only)

### Langkah 1 — Pastikan `vite.config.js` sudah benar
```js
base: "/brew-mate/",   // nama repo GitHub kamu
build: { outDir: "docs" }
```

### Langkah 2 — Build
```bash
npm run build
# Output masuk ke folder /docs
```

### Langkah 3 — Push ke GitHub
```bash
git add .
git commit -m "deploy: update build"
git push
```

### Langkah 4 — Aktifkan GitHub Pages
1. Buka repo di GitHub → **Settings → Pages**
2. Source: **Deploy from branch**
3. Branch: `main` / `master`
4. Folder: `/docs`
5. Save → tunggu beberapa menit

### Langkah 5 — Akses
```
https://username.github.io/brew-mate/
```

---

## Catatan Penting

- File `.env` **tidak boleh** di-commit ke GitHub (sudah ada di `.gitignore`)
- Backend (Express) tidak bisa di-hosting di GitHub Pages — perlu hosting terpisah (Railway, Render, dll)
- Untuk demo GitHub Pages, frontend akan berjalan tanpa backend (data menggunakan state lokal)

---

## Login Demo

| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@brewmate.id    | admin123  |
| User  | daftar akun baru     | —         |
