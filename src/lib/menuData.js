export const MENU_CATEGORIES = [
  { id: "semua", label: "Semua", icon: "LayoutGrid" },
  { id: "kopi", label: "Kopi", icon: "Coffee" },
  { id: "non-kopi", label: "Non-Kopi", icon: "GlassWater" },
  { id: "cemilan", label: "Cemilan", icon: "Cookie" },
  { id: "makanan", label: "Makanan Utama", icon: "UtensilsCrossed" },
];

export const MENU_ITEMS = [
  { id: 1, name: "Espresso", category: "kopi", price: 25000, description: "Ekstraksi murni biji Arabica pilihan, kuat dan intense", notes: "Bold, Intense, Smoky", badge: null, image: "/images/espresso.png" },
  { id: 2, name: "Cappuccino", category: "kopi", price: 35000, description: "Espresso dengan steamed milk dan foam lembut sempurna", notes: "Creamy, Balanced, Velvety", badge: "Favorit", image: "/images/cappuccino.png" },
  { id: 3, name: "Cold Brew", category: "kopi", price: 32000, description: "Diseduh dingin selama 18 jam untuk rasa yang halus", notes: "Smooth, Chocolatey, Refreshing", badge: null, image: "/images/cold-brew.png" },
  { id: 4, name: "Caramel Latte", category: "kopi", price: 40000, description: "Latte es dengan drizzle karamel dan whipped cream", notes: "Sweet, Caramel, Rich", badge: "Baru", image: "/images/caramel-latte.png" },
  { id: 5, name: "Pour Over", category: "kopi", price: 38000, description: "Metode seduh manual dengan biji single origin pilihan", notes: "Floral, Light, Complex", badge: "Spesial", image: "/images/pour-over.png" },
  { id: 6, name: "Flat White", category: "kopi", price: 35000, description: "Espresso double shot dengan microfoam susu lembut", notes: "Strong, Smooth, Milky", badge: null, image: "/images/flat-white.png" },
  { id: 7, name: "Matcha Latte", category: "non-kopi", price: 38000, description: "Matcha premium dari Uji Jepang dengan susu segar", notes: "Earthy, Sweet, Umami", badge: "Favorit", image: "/images/matcha-latte.png" },
  { id: 8, name: "Taro Milk Tea", category: "non-kopi", price: 35000, description: "Teh susu dengan rasa talas ungu yang creamy", notes: "Nutty, Sweet, Creamy", badge: "Baru", image: "/images/taro-milk-tea.png" },
  { id: 9, name: "Lemon Tea Soda", category: "non-kopi", price: 28000, description: "Teh dingin segar dengan perasan lemon dan soda", notes: "Fresh, Citrus, Sparkling", badge: null, image: "/images/lemon-tea-soda.png" },
  { id: 10, name: "Croissant Butter", category: "cemilan", price: 28000, description: "Croissant renyah berlapis butter Prancis asli", notes: "Flaky, Buttery, Golden", badge: null, image: "/images/croissant-butter.png" },
  { id: 11, name: "Chocolate Brownie", category: "cemilan", price: 30000, description: "Fudgy brownie cokelat Belgia premium, hangat dan padat", notes: "Rich, Fudgy, Decadent", badge: "Favorit", image: "/images/chocolate-brownie.png" },
  { id: 12, name: "French Fries", category: "cemilan", price: 25000, description: "Kentang goreng renyah dengan bumbu truffle spesial", notes: "Crispy, Savory, Aromatic", badge: null, image: "/images/french-fries.png" },
  { id: 13, name: "Cheesecake", category: "cemilan", price: 35000, description: "New York cheesecake creamy dengan topping berry segar", notes: "Rich, Creamy, Sweet", badge: "Baru", image: "/images/cheesecake.png" },
  { id: 14, name: "Fruit Tart", category: "cemilan", price: 32000, description: "Tart custard vanila dengan topping buah-buahan segar", notes: "Fresh, Bright, Citrus", badge: null, image: "/images/fruit-tart.png" },
  { id: 15, name: "Chicken Wings", category: "cemilan", price: 38000, description: "Sayap ayam crispy dengan saus pilihan BBQ atau pedas", notes: "Crispy, Savory, Spicy", badge: "Spesial", image: "/images/chiken-wings.png" },
  { id: 16, name: "Nasi Goreng Spesial", category: "makanan", price: 45000, description: "Nasi goreng dengan telur mata sapi, ayam, dan kerupuk", notes: "Smoky, Savory, Hearty", badge: "Favorit", image: "/images/nasi-goreng.png" },
  { id: 17, name: "Club Sandwich", category: "makanan", price: 42000, description: "Triple-decker dengan ayam, telur, selada, dan tomat segar", notes: "Fresh, Filling, Classic", badge: null, image: "/images/club-sandwich.png" },
  { id: 18, name: "Pasta Carbonara", category: "makanan", price: 48000, description: "Spaghetti dengan saus krim, bacon crispy, dan parmesan", notes: "Creamy, Savory, Indulgent", badge: null, image: "/images/pasta-carbonara.png" },
  { id: 19, name: "Mie Goreng Spesial", category: "makanan", price: 43000, description: "Mie goreng kering dengan ayam, udang, dan sayuran segar", notes: "Wok-fried, Savory, Umami", badge: "Baru", image: "/images/mie-goreng.png" },
  { id: 20, name: "Chicken Steak", category: "makanan", price: 55000, description: "Ayam panggang juicy dengan saus mushroom dan kentang", notes: "Grilled, Rich, Hearty", badge: "Spesial", image: "/images/chiken-steak.png" },
];

export function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
