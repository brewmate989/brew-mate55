const API_URL = "http://localhost:5000/api";

// GET Orders
export async function getOrders() {
  try {
    const response = await fetch(`${API_URL}/orders`);

    if (!response.ok) {
      throw new Error("Gagal mengambil data orders");
    }

    return await response.json();
  } catch (error) {
    console.error("GET Orders Error:", error);
    return [];
  }
}

// CREATE Order
export async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Gagal membuat order");
    }

    return await response.json();
  } catch (error) {
    console.error("CREATE Order Error:", error);
    return null;
  }
}

// UPDATE Order
export async function updateOrder(id, orderData) {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Gagal update order");
    }

    return await response.json();
  } catch (error) {
    console.error("UPDATE Order Error:", error);
    return null;
  }
}

// DELETE Order
export async function deleteOrder(id) {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Gagal hapus order");
    }

    return await response.json();
  } catch (error) {
    console.error("DELETE Order Error:", error);
    return null;
  }
}