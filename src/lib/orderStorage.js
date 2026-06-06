const STORAGE_KEY = "brewmate_orders";

export const orderStorage = {
  getOrders() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getOrders:", error);
      return [];
    }
  },

  createOrder(orderData) {
    try {
      const orders = this.getOrders();

      const newOrder = {
        id: Date.now().toString(),
        customer_name: orderData.customer_name,
        phone: orderData.phone,
        order_type: orderData.order_type,
        table_number: orderData.table_number || "",
        notes: orderData.notes || "",
        payment_method: orderData.payment_method,
        items: orderData.items || [],
        total: orderData.total || 0,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      orders.unshift(newOrder);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(orders)
      );

      return newOrder;
    } catch (error) {
      console.error("Error createOrder:", error);
      throw error;
    }
  },

  updateStatus(orderId, status) {
    const orders = this.getOrders();

    const updated = orders.map((order) =>
      order.id === orderId
        ? { ...order, status }
        : order
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    return updated;
  },

  deleteOrder(orderId) {
    const orders = this.getOrders();

    const filtered = orders.filter(
      (order) => order.id !== orderId
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(filtered)
    );
  },

  clearOrders() {
    localStorage.removeItem(STORAGE_KEY);
  },
};