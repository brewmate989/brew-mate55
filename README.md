# Welcome to My Project

## About

This project is built using React, Vite, Tailwind CSS, Express, and MySQL.

The application can run fully on your local machine without Base44 integration.

---

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* XAMPP / MySQL

---

## Installation

Clone the repository:

```bash
git clone your-repository-url
```

Navigate to the project folder:

```bash
cd your-project-folder
```

Install dependencies:

```bash
npm install
```

---

## Environment Setup

Create a `.env.local` file if needed.

Example:

```env
VITE_API_URL=http://localhost:3000
```

---

## Run Frontend

```bash
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

---

## Run Backend

Start your Express server:

```bash
node server.js
```

Backend will run on:

```txt
http://localhost:3000
```

---

## Database Setup

1. Open phpMyAdmin
2. Create a database
3. Import your SQL file if available
4. Update database credentials inside `server.js`

Example:

```js
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "your_database_name"
});
```

---

## Tech Stack

* React
* Vite
* Tailwind CSS
* Express.js
* MySQL

---

## Notes

This project has been converted from Base44 into a standalone local development project.

All Base44 dependencies and integrations have been removed.
