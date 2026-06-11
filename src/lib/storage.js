import { supabase } from "./supabase";

export const orderStorage = {
  async getOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { console.error(error); return []; }
    return data;
  },

  async createOrder(orderData) {
    const { data, error } = await supabase
      .from("orders")
      .insert([{
        customer_name: orderData.customer_name,
        phone: orderData.phone,
        order_type: orderData.order_type,
        table_number: orderData.table_number || "",
        notes: orderData.notes || "",
        payment_method: orderData.payment_method,
        items: orderData.items,
        total: orderData.total,
        status: "pending",
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
  },

  async deleteOrder(id) {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};

export const menuStorage = {
  async getMenu() {
    const { data, error } = await supabase
      .from("menu")
      .select("*")
      .order("id", { ascending: true });
    if (error) { console.error(error); return []; }
    return data;
  },

  async saveMenuItem(item) {
    if (item.id && typeof item.id === "number" && item.id < 1000000) {
      const { error } = await supabase.from("menu").update(item).eq("id", item.id);
      if (error) throw error;
    } else {
      const { id, ...rest } = item;
      const { error } = await supabase.from("menu").insert([rest]);
      if (error) throw error;
    }
  },

  async deleteMenuItem(id) {
    const { error } = await supabase.from("menu").delete().eq("id", id);
    if (error) throw error;
  },
};
