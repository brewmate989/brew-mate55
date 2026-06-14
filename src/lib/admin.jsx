function TabMenu() {
  const [menus, setMenus] = useState(() => {
    const saved = localStorage.getItem("brewmate_admin_menu");
    return saved ? JSON.parse(saved) : MENU_ITEMS;
  });

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "kopi",
    price: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "brewmate_admin_menu",
      JSON.stringify(menus)
    );
  }, [menus]);

  const resetForm = () => {
    setForm({
      name: "",
      category: "kopi",
      price: "",
      description: "",
      image: "",
    });

    setEditingId(null);
  };

  const saveMenu = () => {
    if (!form.name || !form.price) {
      alert("Nama dan harga wajib diisi");
      return;
    }

    if (editingId) {
      setMenus(
        menus.map((m) =>
          m.id === editingId
            ? {
                ...m,
                ...form,
                price: Number(form.price),
              }
            : m
        )
      );
    } else {
      setMenus([
        ...menus,
        {
          id: Date.now(),
          ...form,
          price: Number(form.price),
          notes: "",
          badge: null,
        },
      ]);
    }

    resetForm();
  };

  const editMenu = (menu) => {
    setEditingId(menu.id);

    setForm({
      name: menu.name,
      category: menu.category,
      price: menu.price,
      description: menu.description,
      image: menu.image,
    });
  };

  const deleteMenu = (id) => {
    if (!confirm("Hapus menu ini?")) return;

    setMenus(
      menus.filter((m) => m.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border">
        <h3 className="font-semibold mb-4">
          {editingId
            ? "Edit Menu"
            : "Tambah Menu"}
        </h3>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border p-2 rounded-lg"
            placeholder="Nama Menu"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            className="border p-2 rounded-lg"
            placeholder="Harga"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
          />

          <select
            className="border p-2 rounded-lg"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          >
            <option value="kopi">Kopi</option>
            <option value="non-kopi">
              Non Kopi
            </option>
            <option value="cemilan">
              Cemilan
            </option>
            <option value="makanan">
              Makanan
            </option>
          </select>

          <input
            className="border p-2 rounded-lg"
            placeholder="URL Gambar"
            value={form.image}
            onChange={(e) =>
              setForm({
                ...form,
                image: e.target.value,
              })
            }
          />
        </div>

        <textarea
          className="border p-2 rounded-lg w-full mt-3"
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={saveMenu}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg"
          >
            {editingId
              ? "Update Menu"
              : "Tambah Menu"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="border px-4 py-2 rounded-lg"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {menus.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 border-b"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-xl"
            />

            <div className="flex-1">
              <h4 className="font-semibold">
                {item.name}
              </h4>

              <p className="text-sm text-gray-500">
                {item.description}
              </p>

              <p className="text-orange-500 font-bold">
                {formatRupiah(item.price)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  editMenu(item)
                }
                className="px-3 py-2 bg-blue-500 text-white rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteMenu(item.id)
                }
                className="px-3 py-2 bg-red-500 text-white rounded-lg"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}