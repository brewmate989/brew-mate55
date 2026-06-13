import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate, Link } from "react-router-dom";
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, Users,
  Plus, Pencil, Trash2, X, Clock, Package, CheckCircle,
  XCircle, Search, DollarSign, ShoppingCart, Star, Coffee,
  ArrowLeft, BadgeCheck
} from "lucide-react";
import { orderStorage } from "@/lib/orderStorage";
import { formatRupiah, MENU_ITEMS as INITIAL_MENU } from "@/lib/menuData";
import { useAuth } from "@/lib/authcontext";

/* ── helpers ── */
const MENU_KEY = "brewmate_menu";
const getMenu  = () => { try { const d = localStorage.getItem(MENU_KEY); return d ? JSON.parse(d) : INITIAL_MENU; } catch { return INITIAL_MENU; } };
const saveMenu = (m) => localStorage.setItem(MENU_KEY, JSON.stringify(m));

const STATUS = {
  pending:    { label: "Menunggu",   icon: Clock,         color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  processing: { label: "Diproses",   icon: Package,       color: "text-blue-600 bg-blue-50 border-blue-200" },
  completed:  { label: "Selesai",    icon: CheckCircle,   color: "text-green-600 bg-green-50 border-green-200" },
  cancelled:  { label: "Dibatalkan", icon: XCircle,       color: "text-red-600 bg-red-50 border-red-200" },
};

const CATS   = ["kopi","non-kopi","cemilan","makanan"];
const BADGES = ["Favorit","Baru","Spesial"];

/* ══════════════════════════════════════════════════════════════
   TAB: DASHBOARD
══════════════════════════════════════════════════════════════ */
function TabDashboard({ orders }) {
  const revenue  = orders.filter(o=>o.status==="completed").reduce((s,o)=>s+o.total,0);
  const pending  = orders.filter(o=>o.status==="pending").length;
  const done     = orders.filter(o=>o.status==="completed").length;

  /* top menu */
  const sales = {};
  orders.forEach(o=>(o.items||[]).forEach(i=>{ sales[i.name]=(sales[i.name]||0)+i.quantity; }));
  const topMenus = Object.entries(sales).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const recent = [...orders].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,5);

  const cards = [
    { label:"Total Revenue",  value: formatRupiah(revenue), bg:"bg-orange-500",  icon: DollarSign   },
    { label:"Total Pesanan",  value: orders.length,         bg:"bg-blue-500",    icon: ShoppingCart },
    { label:"Menunggu",       value: pending,               bg:"bg-yellow-500",  icon: Clock        },
    { label:"Selesai",        value: done,                  bg:"bg-green-500",   icon: BadgeCheck   },
  ];

  return (
    <div className="space-y-5">
      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c,i)=>(
          <motion.div key={c.label} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`w-12 h-12 ${c.bg} rounded-2xl flex items-center justify-center mb-4`}>
              <c.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            <p className="text-sm text-gray-400 mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {/* bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* menu terlaris */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-400" /> Menu Terlaris
          </h3>
          {topMenus.length===0 ? (
            <p className="text-sm text-gray-400">Belum ada data</p>
          ) : topMenus.map(([name,qty],i)=>(
            <div key={name} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">{i+1}</span>
                <span className="text-sm text-gray-700">{name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{qty}x</span>
            </div>
          ))}
        </div>

        {/* pesanan terbaru */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-400" /> Pesanan Terbaru
          </h3>
          {recent.length===0 ? (
            <p className="text-sm text-gray-400">Belum ada pesanan</p>
          ) : recent.map(o=>{
            const sc=STATUS[o.status]||STATUS.pending;
            return (
              <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-800">{o.customer_name}</p>
                  <p className="text-xs text-gray-400">{formatRupiah(o.total)}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${sc.color}`}>{sc.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB: KELOLA MENU
══════════════════════════════════════════════════════════════ */
function TabMenu() {
  const [menu, setMenu]   = useState(getMenu());
  const [search, setSearch] = useState("");
  const [cat, setCat]     = useState("semua");
  const [modal, setModal] = useState(null);
  const [form, setForm]   = useState({});
  const [delId, setDelId] = useState(null);

  const filtered = menu.filter(m=>
    (cat==="semua"||m.category===cat) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = ()   => { setForm({category:"kopi",badge:null,image:""}); setModal("add"); };
  const openEdit = (item)=> { setForm({...item}); setModal("edit"); };
  const close    = ()   => { setModal(null); setForm({}); };

  const save = () => {
    if(!form.name||!form.price) return;
    const updated = modal==="add"
      ? [{...form,id:Date.now(),price:Number(form.price)},...menu]
      : menu.map(m=>m.id===form.id?{...form,price:Number(form.price)}:m);
    saveMenu(updated); setMenu(updated); close();
  };

  const del = (id) => { const u=menu.filter(m=>m.id!==id); saveMenu(u); setMenu(u); setDelId(null); };

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari menu..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <select value={cat} onChange={e=>setCat(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="semua">Semua Kategori</option>
          {CATS.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
          <Plus className="w-4 h-4" /> Tambah Menu
        </button>
      </div>

      {/* grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item,i)=>(
          <motion.div key={item.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}}
            className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-36 bg-gray-100 relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                onError={e=>{e.target.src="https://placehold.co/400x300?text=No+Image";}} />
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
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-xs font-medium hover:bg-gray-50">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={()=>setDelId(item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-100 text-red-500 text-xs font-medium hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* modal add/edit */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{scale:0.95,y:20}} animate={{scale:1,y:0}} exit={{scale:0.95}}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900">{modal==="add"?"Tambah Menu":"Edit Menu"}</h3>
                <button onClick={close}><X className="w-5 h-5 text-gray-400"/></button>
              </div>
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
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Kategori</label>
                  <select value={form.category||"kopi"} onChange={e=>setForm(p=>({...p,category:e.target.value}))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Badge</label>
                  <select value={form.badge||""} onChange={e=>setForm(p=>({...p,badge:e.target.value||null}))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="">Tidak Ada</option>
                    {BADGES.map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={close} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Batal</button>
                <button onClick={save}  className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600">Simpan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* modal delete */}
      <AnimatePresence>
        {delId && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-red-500"/>
              </div>
              <h3 className="font-bold text-gray-900">Hapus Menu?</h3>
              <p className="text-sm text-gray-500">Menu ini akan dihapus permanen.</p>
              <div className="flex gap-3">
                <button onClick={()=>setDelId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Batal</button>
                <button onClick={()=>del(delId)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB: PESANAN
══════════════════════════════════════════════════════════════ */
function TabPesanan() {
  const [orders, setOrders] = useState(orderStorage.getOrders());
  const [filter, setFilter] = useState("semua");
  const [search, setSearch] = useState("");

  const refresh = () => setOrders(orderStorage.getOrders());

  const filtered = orders.filter(o=>
    (filter==="semua"||o.status===filter) &&
    (o.customer_name||"").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pelanggan..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
          <option value="semua">Semua Status</option>
          {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {filtered.length===0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl shadow-sm">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30"/>
          <p className="text-sm">Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o,i)=>{
            const sc=STATUS[o.status]||STATUS.pending;
            const Icon=sc.icon;
            return (
              <motion.div key={o.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.03}}
                className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{o.customer_name}</p>
                    <p className="text-xs text-gray-400">{o.phone} · {new Date(o.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border whitespace-nowrap ${sc.color}`}>
                    <Icon className="w-3.5 h-3.5"/>{sc.label}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  {(o.items||[]).map((item,j)=>(
                    <div key={j} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.quantity}x {item.name}</span>
                      <span className="text-gray-700">{formatRupiah(item.price*item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t pt-3 gap-3">
                  <span className="font-bold text-gray-900">{formatRupiah(o.total)}</span>
                  <div className="flex gap-2">
                    <select value={o.status}
                      onChange={e=>{ orderStorage.updateStatus(o.id,e.target.value); refresh(); }}
                      className="text-xs rounded-lg border border-gray-200 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400">
                      {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button onClick={()=>{ orderStorage.deleteOrder(o.id); refresh(); }}
                      className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB: PENGGUNA
══════════════════════════════════════════════════════════════ */
function TabPengguna() {
  const orders = orderStorage.getOrders();
  const map = {};
  orders.forEach(o=>{
    const k=o.customer_name+"|"+o.phone;
    if(!map[k]) map[k]={name:o.customer_name,phone:o.phone,orders:0,total:0};
    map[k].orders++; map[k].total+=o.total||0;
  });
  const users = Object.values(map).sort((a,b)=>b.total-a.total);

  return (
    <div className="space-y-3">
      {users.length===0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl shadow-sm">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30"/>
          <p className="text-sm">Belum ada data pengguna</p>
        </div>
      ) : users.map((u,i)=>(
        <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <span className="text-orange-600 font-bold text-sm">{u.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
              <p className="text-xs text-gray-400">{u.phone}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-gray-900 text-sm">{formatRupiah(u.total)}</p>
            <p className="text-xs text-gray-400">{u.orders} pesanan</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
const TABS = [
  { id:"dashboard", label:"Dashboard",   icon:LayoutDashboard },
  { id:"menu",      label:"Kelola Menu", icon:UtensilsCrossed },
  { id:"pesanan",   label:"Pesanan",     icon:ShoppingBag },
  { id:"pengguna",  label:"Pengguna",    icon:Users },
];

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const orders = orderStorage.getOrders();

  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-[#f0ece4]">
      {/* ── header ── */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow">
              <Coffee className="w-5 h-5 text-white"/>
            </div>
            <span className="font-bold text-gray-900 text-lg">BrewMate Admin</span>
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft className="w-4 h-4"/> Ke Toko
          </Link>
        </div>

        {/* ── tabs ── */}
        <div className="max-w-6xl mx-auto px-6 flex gap-0 overflow-x-auto">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tab===t.id
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}>
              <t.icon className="w-4 h-4"/>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── content ── */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}>
            {tab==="dashboard" && <TabDashboard orders={orders}/>}
            {tab==="menu"      && <TabMenu/>}
            {tab==="pesanan"   && <TabPesanan/>}
            {tab==="pengguna"  && <TabPengguna/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}