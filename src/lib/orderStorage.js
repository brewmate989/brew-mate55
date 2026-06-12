import { supabase } from "@/lib/supabase";

export const orderStorage = {
  async getOrders() {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Gagal ambil orders:", error);
      return [];
    }
  },

  async getOrdersByUser(userEmail) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Gagal ambil orders user:", error);
      return [];
    }
  },

  async createOrder(orderData) {
    try {
      const id = "order_" + Date.now();
      const { data, error } = await supabase
        .from("orders")
        .insert([{ id, ...orderData }])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Gagal buat order:", error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Gagal update status:", error);
      return false;
    }
  },

  async deleteOrder(orderId) {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Gagal hapus order:", error);
      return false;
    }
  },
};
