import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, Users,
  DollarSign, Clock, CheckCircle, XCircle, Package,
  Star, ArrowLeft, Search, Plus, Pencil, Trash2, BadgeCheck
} from "lucide-react";
import { orderStorage } from "@/lib/orderStorage";
import { formatRupiah, MENU_ITEMS as INITIAL_MENU } from "@/lib/menuData";
import { useAuth } from "@/lib/authcontext";

/* ── helpers ── */
const MENU_KEY = "brewmate_menu";
const getMenu  = () => { try { const d = localStorage.getItem(MENU_KEY); return d ? JSON.parse(d) : INITIAL_MENU; } catch { return INITIAL_MENU; } };
const saveMenu = (m) => localStorage.setItem(MENU_KEY, JSON.stringify(m));
const fmtDate  = (d) => new Date(d).toLocaleString("id-ID");

const STATUS = {
  pending:    { label: "Menunggu",   color: "bg-yellow-100 text-yellow-700" },
  Diproses:   { label: "Diproses",   color: "bg-blue-100 text-blue-700" },
  Siap:       { label: "Siap",       color: "bg-purple-100 text-purple-700" },
  Selesai:    { label: "Selesai",    color: "bg-green-100 text-green-700" },
  Dibatalkan: { label: "Dibatalkan", color: "bg-red-100 text-red-700" },
};
const STATUS_LIST = Object.keys(STATUS);
const CATS   = ["kopi","non-kopi","cemilan","makanan"];
const BADGES = ["Favorit","Baru","Spesial"];

/* ══ STAT CARD ══════════════════════════════════════════════ */
function StatCard({ icon: Icon, color, value, label }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-4`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <p className="text-gray-400 mt-1">{label}</p>
    </div>
  );
}

/* ══ TAB DASHBOARD ══════════════════════════════════════════ */
function TabDashboard({ orders }) {
  const revenue = orders.filter(o => o.status === "Selesai").reduce((s,o) => s + (o.total||0), 0);
  const pending = orders.filter(o => o.status === "pending").length;
  const selesai = orders.filter(o => o.status === "Selesai").length;

  const sales = {};
  orders.forEach(o => (o.items||[]).forEach(i => {
    sales[i.name] = (sales[i.name]||0) + (i.quantity||i.qty||1);
  }));
  const topMenus = Object.entries(sales).sort((a,b) => b[1]-a[1]).slice(0,5);
  const recent   = [...orders].sort((a,b) => new Date(b.created_at)-new Date(a.created_at)).slice(0,5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={DollarSign}  color="bg-orange-500" value={formatRupiah(revenue)} label="Total Revenue" />
        <StatCard icon={ShoppingBag} color="bg-blue-500"   value={orders.length}         label="Total Pesanan" />
        <StatCard icon={Clock}       color="bg-yellow-500" value={pending}               label="Menunggu" />
        <StatCard icon={BadgeCheck}  color="bg-green-500"  value={selesai}               label="Selesai" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-500" /> Menu Terlaris
          </h2>
          {topMenus.length === 0
            ? <p className="text-gray-400">Belum ada data</p>
            : topMenus.map(([name, qty], i) => (
              <div key={name} className="flex justify-between items-center py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs flex items-center justify-center font-bold">{i+1}</span>
                  <span className="font-medium text-gray-800">{name}</span>
                </div>
                <span className="text-gray-500 text-sm">{qty}x terjual</span>
              </div>
            ))
          }
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-500" /> Pesanan Terbaru
          </h2>
          {recent.length === 0
            ? <p className="text-gray-400">Belum ada pesanan</p>
            : recent.map(o => {
              const sc = STATUS[o.status] || STATUS.pending;
              return (
                <div key={o.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{o.customer_name}</p>
                    <p className="text-sm text-gray-400">{fmtDate(o.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatRupiah(o.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.color}`}>{sc.label}</span>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

/* ══ TAB KELOLA MENU ════════════════════════════════════════ */
function TabMenu() {
  const [menu, setMenu]   = useState(getMenu());
  const [search, setSearch] = useState("");
  const [cat, setCat]     = useState("semua");
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState({});
  const [delId, setDelId] = useState(null);

  const filtered = menu.filter(m =>
    (cat==="semua"||m.category===cat) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = ()    => { setForm({category:"kopi",badge:null,image:""}); setModal("add"); };
  const openEdit = (item)=> { setForm({...item}); setModal("edit"); };
  const close    = ()    => { setModal(null); setForm({}); };
  const save = () => {
    if(!form.name||!form.price) return;
    const updated = modal==="add"
      ? [{...form,id:Date.now(),price:Number(form.price)},...menu]
      : menu.map(m => m.id===form.id ? {...form,price:Number(form.price)} : m);
    saveMenu(updated); setMenu(updated); close();
  };
  const del = (id) => { const u=menu.filter(m=>m.id!==id); saveMenu(u); setMenu(u); setDelId(null); };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari menu..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
        </div>
        <select value={cat} onChange={e=>setCat(e.target.value)}
          className="px-4 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="semua">Semua Kategori</option>
          {CATS.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
          <Plus className="w-4 h-4"/> Tambah Menu
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-36 bg-gray-100 relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                onError={e=>{e.target.src="https://placehold.co/400x300?text=No+Image";}}/>
              {item.badge && <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full bg-orange-500 text-white">{item.badge}</span>}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                <span className="text-sm font-bold text-orange-500 shrink-0 ml-2">{formatRupiah(item.price)}</span>
              </div>
              <p className="text-xs text-gray-400 capitalize mb-3">{item.category}</p>
              <div className="flex gap-2">
                <button onClick={()=>openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium hover:bg-gray-50">
                  <Pencil className="w-3.5 h-3.5"/> Edit
                </button>
                <button onClick={()=>setDelId(item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-100 text-red-500 text-xs font-medium hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5"/> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* modal add/edit */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-gray-900">{modal==="add"?"Tambah Menu":"Edit Menu"}</h3>
            {[
              {label:"Nama",key:"name",type:"text"},
              {label:"Harga",key:"price",type:"number"},
              {label:"Deskripsi",key:"description",type:"text"},
              {label:"Notes Rasa",key:"notes",type:"text"},
              {label:"URL / Path Gambar",key:"image",type:"text",placeholder:"/images/nama.png"},
            ].map(f=>(
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{f.label}</label>
                <input type={f.type} value={form[f.key]||""} placeholder={f.placeholder||""}
                  onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                  className="w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Kategori</label>
                <select value={form.category||"kopi"} onChange={e=>setForm(p=>({...p,category:e.target.value}))}
                  className="w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Badge</label>
                <select value={form.badge||""} onChange={e=>setForm(p=>({...p,badge:e.target.value||null}))}
                  className="w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="">Tidak Ada</option>
                  {BADGES.map(b=><option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={close} className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-gray-50">Batal</button>
              <button onClick={save}  className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* modal delete */}
      {delId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-500"/>
            </div>
            <h3 className="font-bold text-gray-900">Hapus Menu?</h3>
            <p className="text-sm text-gray-500">Menu ini akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDelId(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium">Batal</button>
              <button onClick={()=>del(delId)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ TAB PESANAN ════════════════════════════════════════════ */
function TabPesanan() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");

  useEffect(() => {
    const load = async () => {
      const data = await orderStorage.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  const refresh = async () => {
    const data = await orderStorage.getOrders();
    setOrders(Array.isArray(data) ? data : []);
  };

  const filtered = orders.filter(o =>
    (filter==="semua"||o.status===filter) &&
    (o.customer_name||"").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <h2 className="text-xl font-semibold">Daftar Pesanan</h2>
        <div className="flex gap-2">
          <select value={filter} onChange={e=>setFilter(e.target.value)}
            className="px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
            <option value="semua">Semua Status</option>
            {STATUS_LIST.map(s=><option key={s} value={s}>{STATUS[s]?.label||s}</option>)}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama..."
              className="pl-9 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
          </div>
        </div>
      </div>

      {filtered.length === 0
        ? <p className="text-gray-400 py-8 text-center">Tidak ada pesanan</p>
        : <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 pr-4">Pelanggan</th>
                  <th className="pb-3 pr-4">Item</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Waktu</th>
                  <th className="pb-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-stone-50">
                    <td className="py-3 pr-4 font-medium">{o.customer_name}</td>
                    <td className="py-3 pr-4 text-gray-500">{(o.items||[]).length} item</td>
                    <td className="py-3 pr-4 font-semibold text-orange-600">{formatRupiah(o.total)}</td>
                    <td className="py-3 pr-4">
                      <select value={o.status}
                        onChange={async e => { await orderStorage.updateStatus(o.id, e.target.value); refresh(); }}
                        className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${STATUS[o.status]?.color||"bg-gray-100 text-gray-600"}`}>
                        {STATUS_LIST.map(s=><option key={s} value={s}>{STATUS[s]?.label||s}</option>)}
                      </select>
                    </td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">{fmtDate(o.created_at)}</td>
                    <td className="py-3">
                      <button onClick={async ()=>{ await orderStorage.deleteOrder(o.id); refresh(); }}
                        className="text-red-400 hover:text-red-600 transition">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}

/* ══ TAB PENGGUNA ═══════════════════════════════════════════ */
function TabPengguna({ orders }) {
  const map = {};
  orders.forEach(o => {
    const k = o.customer_name+"|"+o.phone;
    if(!map[k]) map[k]={name:o.customer_name,phone:o.phone,orders:0,total:0};
    map[k].orders++; map[k].total+=o.total||0;
  });
  const users = Object.values(map).sort((a,b)=>b.total-a.total);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Daftar Pengguna</h2>
      {users.length === 0
        ? <p className="text-gray-400">Belum ada data pengguna</p>
        : <div className="space-y-3">
            {users.map((u,i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-stone-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">{u.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">{formatRupiah(u.total)}</p>
                  <p className="text-xs text-gray-400">{u.orders} pesanan</p>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

/* ══ MAIN ═══════════════════════════════════════════════════ */
const TABS = [
  { id:"dashboard", label:"Dashboard",   icon:LayoutDashboard },
  { id:"menu",      label:"Kelola Menu", icon:UtensilsCrossed },
  { id:"pesanan",   label:"Pesanan",     icon:ShoppingBag },
  { id:"pengguna",  label:"Pengguna",    icon:Users },
];

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]       = useState("dashboard");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await orderStorage.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  if (!user || !isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white p-2.5 rounded-xl text-xl">☕</div>
            <h1 className="text-2xl font-bold">BrewMate Admin</h1>
          </div>
          <button onClick={()=>navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition text-sm">
            <ArrowLeft className="w-4 h-4"/> Ke Toko
          </button>
        </div>
        <nav className="max-w-7xl mx-auto px-8 flex gap-1 overflow-x-auto">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tab===t.id ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}>
              <t.icon className="w-4 h-4"/>{t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* content */}
      <main className="max-w-7xl mx-auto p-8">
        {tab==="dashboard" && <TabDashboard orders={orders}/>}
        {tab==="menu"      && <TabMenu/>}
        {tab==="pesanan"   && <TabPesanan/>}
        {tab==="pengguna"  && <TabPengguna orders={orders}/>}
      </main>
    </div>
  );
}