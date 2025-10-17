import { useMemo, useState } from "react";
import Image from "next/image";

/** ------- Types + mock selaras DB (products + stocks) ------- */
type Category = { id: number; name: string };

type Variant = {
  size: string;      // contoh: "38", "39", "40"
  quantity: number;  // stok per size
};

type Product = {
  id: number;
  name: string;
  price: number;          // DECIMAL -> number
  category_id: number;    // fk categories.id
  is_active: boolean;
  image_url: string;
  variants: Variant[];    
};

const CATEGORIES: Category[] = [
  { id: 1, name: "Classic Chuck" },
  { id: 2, name: "Double Stack" },
  { id: 3, name: "Run Star" },
  { id: 4, name: "Basketball" },
  { id: 5, name: "Slip-On & Sandal" },
];

const SEED: Product[] = [
  {
    id: 1,
    name: "Chuck Taylor All Star Hi Darkly Jaded",
    price: 1099000,
    category_id: 1,
    is_active: true,
    image_url: "",
    variants: [
      { size: "38", quantity: 10 },
      { size: "39", quantity: 8 },
      { size: "40", quantity: 6 },
    ],
  },
  {
    id: 2,
    name: "CONS Louie Lopez Pro 2 Suede Low Black",
    price: 1499000,
    category_id: 3,
    is_active: true,
    image_url: "",
    variants: [
      { size: "41", quantity: 12 },
      { size: "42", quantity: 10 },
    ],
  },
  {
    id: 3,
    name: "All Star BB Prototype CX",
    price: 2099000,
    category_id: 4,
    is_active: false,
    image_url: "",
    variants: [
      { size: "40", quantity: 3 },
      { size: "41", quantity: 2 },
      { size: "42", quantity: 1 },
    ],
  },
];

const currency = (n: number) =>
  n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

/** ------- Komponen kecil ------- */
const Th = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 ${className}`}>{children}</th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>
);

/** ======================== VIEW ======================== */
function AdminProductsView() {
  const [products, setProducts] = useState<Product[]>(SEED);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const catMap = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name])) as Record<number, string>,
    []
  );

  const filtered = useMemo(() => {
    let data = [...products];
    if (query.trim()) {
      const s = query.toLowerCase();
      data = data.filter((p) => p.name.toLowerCase().includes(s));
    }
    if (categoryId !== "all") data = data.filter((p) => p.category_id === categoryId);
    if (statusFilter !== "all") data = data.filter((p) => p.is_active === (statusFilter === "active"));
    return data;
  }, [products, query, categoryId, statusFilter]);

  /** ---------- Modal Add/Edit ---------- */
  type Draft = {
    id: number;
    name: string;
    price: string; // string supaya bisa kosong dulu
    category_id: number;
    is_active: boolean;
    image_url: string;
    variants: { size: string; quantity: string }[]; // string agar mudah input
  };

  const emptyDraft: Draft = {
    id: 0,
    name: "",
    price: "",
    category_id: CATEGORIES[0].id,
    is_active: true,
    image_url: "",
    variants: [{ size: "38", quantity: "0" }],
  };

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);

  function openAdd() {
    setEditingId(null);
    setDraft(emptyDraft);
    setOpen(true);
  }
  function openEdit(p: Product) {
    setEditingId(p.id);
    setDraft({
      id: p.id,
      name: p.name,
      price: String(p.price),
      category_id: p.category_id,
      is_active: p.is_active,
      image_url: p.image_url,
      variants: p.variants.map((v) => ({ size: v.size, quantity: String(v.quantity) })),
    });
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setDraft(emptyDraft);
    }, 150);
  }

  function addVariantRow() {
    setDraft((d) => ({ ...d, variants: [...d.variants, { size: "", quantity: "0" }] }));
  }
  function removeVariantRow(idx: number) {
    setDraft((d) => ({ ...d, variants: d.variants.filter((_, i) => i !== idx) }));
  }
  function updateVariant(idx: number, field: "size" | "quantity", value: string) {
    setDraft((d) => {
      const arr = d.variants.slice();
      arr[idx] = { ...arr[idx], [field]: field === "quantity" ? value.replace(/\D/g, "") : value };
      return { ...d, variants: arr };
    });
  }

  function saveDraft(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = Number(draft.price.replace(/\D/g, ""));
    if (!draft.name.trim()) return alert("Nama wajib diisi");
    if (isNaN(priceNum)) return alert("Harga tidak valid");

    // bersihkan variants: hapus baris kosong & ubah qty ke number
    const cleanedVariants: Variant[] = draft.variants
      .map((v) => ({ size: v.size.trim(), quantity: Number(v.quantity || "0") }))
      .filter((v) => v.size !== "" && !Number.isNaN(v.quantity));

    if (cleanedVariants.length === 0) {
      return alert("Minimal satu variasi ukuran harus diisi.");
    }

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: draft.name,
                price: priceNum,
                category_id: draft.category_id,
                is_active: draft.is_active,
                image_url: draft.image_url,
                variants: cleanedVariants,
              }
            : p
        )
      );
    } else {
      const nextId = Math.max(0, ...products.map((p) => p.id)) + 1;
      setProducts((prev) => [
        {
          id: nextId,
          name: draft.name,
          price: priceNum,
          category_id: draft.category_id,
          is_active: draft.is_active,
          image_url: draft.image_url,
          variants: cleanedVariants,
        },
        ...prev,
      ]);
    }
    closeModal();
  }

  function removeProduct(id: number) {
    if (confirm("Hapus produk ini?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) closeModal();
    }
  }

  const totalStock = (p: Product) => p.variants.reduce((sum, v) => sum + (v.quantity || 0), 0);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk…"
            className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <select
            value={categoryId as any}
            onChange={(e) => setCategoryId(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
        <button
          onClick={openAdd}
          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-white">
              <Th>ID</Th>
              <Th>Produk</Th>
              <Th>Kategori</Th>
              <Th>Harga</Th>
              <Th>Stok</Th>
              <Th>Status</Th>
              <Th className="text-right">Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-gray-200">
                <Td>#{p.id}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    {p.image_url ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                        <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="grid h-12 w-12 place-items-center rounded-md border border-gray-200 bg-gray-50 text-xs text-gray-400">
                        IMG
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">{currency(p.price)}</div>
                    </div>
                  </div>
                </Td>
                <Td>{catMap[p.category_id]}</Td>
                <Td>{currency(p.price)}</Td>
                <Td>{totalStock(p)}</Td>
                <Td>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-900 px-3 py-1.5 text-sm font-semibold hover:bg-gray-900 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      Hapus
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                  Tidak ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- Modal ---------- */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h3 className="text-base font-bold text-gray-900">{editingId ? "Edit Produk" : "Tambah Produk"}</h3>
              <button onClick={closeModal} className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100">
                ✕
              </button>
            </div>

            <form onSubmit={saveDraft} className="space-y-3 px-5 py-4">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-gray-700">Nama Produk</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Nama produk"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-gray-700">Harga</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-gray-500">Rp</span>
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={draft.price}
                      onChange={(e) => setDraft({ ...draft, price: e.target.value.replace(/\D/g, "") })}
                      className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="0"
                    />
                  </div>
                </label>

                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-gray-700">Kategori</span>
                  <select
                    value={draft.category_id}
                    onChange={(e) => setDraft({ ...draft, category_id: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-gray-700">URL Gambar</span>
                <input
                  value={draft.image_url}
                  onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="/images/filename.jpg atau URL https"
                />
              </label>

              <label className="flex items-center gap-2 text-sm pt-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-black"
                  checked={draft.is_active}
                  onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
                />
                Aktif
              </label>

              {/* Variasi Size & Stok */}
              <div className="pt-2">
                <p className="mb-2 text-sm font-medium text-gray-700">Ukuran & Stok</p>
                <div className="space-y-2">
                  {draft.variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                      <input
                        value={v.size}
                        onChange={(e) => updateVariant(idx, "size", e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="38"
                      />
                      <input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={v.quantity}
                        onChange={(e) => updateVariant(idx, "quantity", e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="0"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantRow(idx)}
                        className="rounded-lg border border-gray-900 px-3 py-2 text-sm font-semibold hover:bg-gray-900 hover:text-white"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addVariantRow}
                  className="mt-3 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  + Tambah ukuran & stok
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold hover:bg-gray-900 hover:text-white"
                >
                  Batal
                </button>
                <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                  {editingId ? "Simpan Perubahan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductsView;