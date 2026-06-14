const API_URL = "http://localhost:5000/api";

export const orderStorage = {
  async getOrders() {
    const res = await fetch(`${API_URL}/orders`);
    return await res.json();
  },

  async createOrder(order) {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    return await res.json();
  },

  async updateStatus(id, status) {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    return await res.json();
  },

  async deleteOrder(id) {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
    });

    return await res.json();
  },
};