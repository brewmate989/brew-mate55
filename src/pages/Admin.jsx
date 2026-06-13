import { useState } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Star,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    {
      title: "Total Revenue",
      value: "Rp 0",
      icon: <DollarSign size={24} />,
      color: "bg-orange-500",
    },
    {
      title: "Total Pesanan",
      value: "0",
      icon: <ShoppingBag size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Menunggu",
      value: "0",
      icon: <Clock size={24} />,
      color: "bg-yellow-500",
    },
    {
      title: "Selesai",
      value: "0",
      icon: <CheckCircle size={24} />,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white p-3 rounded-xl">
              ☕
            </div>
            <h1 className="text-2xl font-bold">BrewMate Admin</h1>
          </div>

          <button className="flex items-center gap-2 text-gray-600 hover:text-black">
            <ArrowLeft size={18} />
            Ke Toko
          </button>
        </div>

        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 flex gap-8">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 py-4 border-b-2 ${
              activeTab === "dashboard"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-600"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("menu")}
            className="flex items-center gap-2 py-4 text-gray-600"
          >
            <UtensilsCrossed size={18} />
            Kelola Menu
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className="flex items-center gap-2 py-4 text-gray-600"
          >
            <ShoppingBag size={18} />
            Pesanan
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className="flex items-center gap-2 py-4 text-gray-600"
          >
            <Users size={18} />
            Pengguna
          </button>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border"
            >
              <div
                className={`w-14 h-14 rounded-xl ${item.color} text-white flex items-center justify-center mb-4`}
              >
                {item.icon}
              </div>

              <h2 className="text-4xl font-bold">{item.value}</h2>

              <p className="text-gray-500 mt-2">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Bottom Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-orange-500" size={20} />
              <h2 className="text-2xl font-bold">Menu Terlaris</h2>
            </div>

            <p className="text-gray-400">Belum ada data</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList
                className="text-orange-500"
                size={20}
              />
              <h2 className="text-2xl font-bold">
                Pesanan Terbaru
              </h2>
            </div>

            <p className="text-gray-400">
              Belum ada pesanan
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}