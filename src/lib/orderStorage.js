const API_URL = "http://localhost:5000/api";
const STORAGE_KEY = "brewmate_orders";

// ── localStorage helpers ──────────────────────────────────────
function localGet() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function localSet(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// ── cek apakah backend bisa diakses ──────────────────────────
let _backendAvailable = null;
async function isBackendAvailable() {
  if (_backendAvailable !== null) return _backendAvailable;
  try {
    const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(2000) });
    _backendAvailable = res.ok;
  } catch {
    _backendAvailable = false;
  }
  return _backendAvailable;
}

// ── orderStorage ──────────────────────────────────────────────
export const orderStorage = {
  async getOrders() {
    if (await isBackendAvailable()) {
      try {
        const res = await fetch(`${API_URL}/orders`);
        return await res.json();
      } catch { /* fallback */ }
    }
    return localGet();
  },

  async createOrder(order) {
    const newOrder = {
      ...order,
      id: "order_" + Date.now(),
      status: "pending",
      created_at: new Date().toISOString(),
    };

    if (await isBackendAvailable()) {
      try {
        const res = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(order),
        });
        return await res.json();
      } catch { /* fallback */ }
    }

    // localStorage fallback
    const orders = localGet();
    orders.unshift(newOrder);
    localSet(orders);
    return newOrder;
  },

  async updateStatus(id, status) {
    if (await isBackendAvailable()) {
      try {
        const res = await fetch(`${API_URL}/orders/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        return await res.json();
      } catch { /* fallback */ }
    }

    // localStorage fallback
    const orders = localGet().map(o => o.id === id ? { ...o, status } : o);
    localSet(orders);
    return { success: true };
  },

  async deleteOrder(id) {
    if (await isBackendAvailable()) {
      try {
        const res = await fetch(`${API_URL}/orders/${id}`, { method: "DELETE" });
        return await res.json();
      } catch { /* fallback */ }
    }

    // localStorage fallback
    localSet(localGet().filter(o => o.id !== id));
    return { success: true };
  },
};