import {
  FaDollarSign,
  FaShoppingCart,
  FaClock,
  FaCheck,
  FaStar,
  FaClipboardList,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa";

export default function Admin() {
  return (
    <div className="min-h-screen bg-stone-100">
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white p-3 rounded-xl text-xl">
              ☕
            </div>
            <h1 className="text-2xl font-bold">BrewMate Admin</h1>
          </div>

          {/* Button */}
          <button className="flex items-center gap-2 text-gray-600 hover:text-black">
            <FaArrowLeft />
            Ke Toko
          </button>
        </div>

        {/* ================= NAVIGASI ================= */}
        <nav className="max-w-7xl mx-auto px-8 flex gap-10">
          <NavItem active>Dashboard</NavItem>
          <NavItem icon={<FaClipboardList />}>Kelola Menu</NavItem>
          <NavItem icon={<FaShoppingCart />}>Pesanan</NavItem>
          <NavItem icon={<FaUsers />}>Pengguna</NavItem>
        </nav>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto p-8">

        {/* ===== STAT CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon="💲" color="bg-orange-500" value="Rp 0" label="Total Revenue" />
          <StatCard icon="🛒" color="bg-blue-500" value="0" label="Total Pesanan" />
          <StatCard icon="🕐" color="bg-yellow-500" value="0" label="Menunggu" />
          <StatCard icon="✅" color="bg-green-500" value="0" label="Selesai" />
        </div>

        {/* ===== BOTTOM PANELS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Menu Terlaris */}
          <div className="bg-white border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <FaStar className="text-orange-500" />
              <h2 className="text-xl font-semibold">Menu Terlaris</h2>
            </div>
            <p className="text-gray-400">Belum ada data</p>
          </div>

          {/* Pesanan Terbaru */}
          <div className="bg-white border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <FaClipboardList className="text-orange-500" />
              <h2 className="text-xl font-semibold">Pesanan Terbaru</h2>
            </div>
            <p className="text-gray-400">Belum ada pesanan</p>
          </div>

        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENT NAV ================= */
function NavItem({ children, icon, active }) {
  return (
    <button
      className={`py-4 flex items-center gap-2 font-medium border-b-2 transition
      ${
        active
          ? "border-orange-500 text-orange-500"
          : "border-transparent text-gray-600 hover:text-black"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ icon, color, value, label }) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <div
        className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-4`}
      >
        {icon}
      </div>

      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-gray-500 mt-2">{label}</p>
    </div>
  );
}