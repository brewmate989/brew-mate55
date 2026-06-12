CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(100),
  phone VARCHAR(20),
  order_type VARCHAR(20),
  table_number VARCHAR(10),
  notes TEXT,
  payment_method VARCHAR(20),
  items JSONB,
  total INT,
  status VARCHAR(20) DEFAULT 'pending',
  user_email VARCHAR(100),
  user_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);