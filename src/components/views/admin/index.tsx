// src/components/views/admin/index.tsx
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, Search, Filter, Plus } from "lucide-react";

/** ------------ Types selaras DB ------------ */
type Category = { id: number; name: string };
type Product = {
  id: number;
  name: string;
  price: number;      // DECIMAL -> number di FE
  stock: number;
  category_id: number;
  is_active: boolean;
  image_url: string;
};
type OrderStatus = "pending" | "diproses" | "dikirim" | "selesai" | "batal";
type Order = {
  id: number;
  r_id: number;          // ref: users.id
  total: number;         // DECIMAL(12,2)
  status: OrderStatus;
  address_text: string;
  created_at: string;    // ISO datetime
};
type OrderItem = {
  id: number;
  order_id: number;      // ref: orders.id
  product_id: number;    // ref: products.id
  price: number;         // DECIMAL(12,2)
  qty: number;
  subtotal: number;      // price * qty
};

/** ------------ Mock data ------------ */
const CATEGORIES: Category[] = [
  { id: 1, name: "Running" },
  { id: 2, name: "Basketball" },
  { id: 3, name: "Lifestyle" },
  { id: 4, name: "Football" },
  { id: 5, name: "Training" },
  { id: 6, name: "Kids" },
];

const PRODUCTS_SEED: Product[] = [
  { id: 1, name: "Nike Air Zoom Pegasus 41", price: 1899000, stock: 15, category_id: 1, is_active: true,  image_url: "/images/pegasus41.jpg" },
  { id: 2, name: "Adidas Ultraboost Light",  price: 2200000, stock: 12, category_id: 1, is_active: true,  image_url: "/images/ultraboost.jpg" },
  { id: 3, name: "Nike Air Force 1 '07",     price: 1599000, stock: 25, category_id: 3, is_active: true,  image_url: "/images/af1.jpg" },
  { id: 4, name: "Converse Chuck Taylor High",price:  899000, stock: 30, category_id: 3, is_active: false, image_url: "/images/converse.jpg" },
];

const ORDERS_SEED: Order[] = [
  { id: 201, r_id: 11, total: 2798000, status: "pending", address_text: "Jl. Kenanga No. 12, Bandung, 40211", created_at: "2025-09-27T09:15:00.000Z" },
  { id: 202, r_id: 12, total: 2300000, status: "dikirim", address_text: "Perum Gading 2 Blok B9, Jakarta, 13210", created_at: "2025-09-27T10:30:00.000Z" },
];

const ORDER_ITEMS_SEED: OrderItem[] = [
  { id: 1, order_id: 201, product_id: 1, price: 1899000, qty: 1, subtotal: 1899000 },
  { id: 2, order_id: 201, product_id: 3, price:  899000, qty: 1, subtotal:  899000 },
  { id: 3, order_id: 202, product_id: 2, price: 2300000, qty: 1, subtotal: 2300000 },
];

/** ------------ Helpers ------------ */
const currency = (n: number) =>
  n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

/** ------------ UI components ------------ */
const ProductCard = ({
  p,
  categoryName,
  onEdit,
  onDelete,
}: {
  p: Product;
  categoryName: string;
  onEdit: (p: Product) => void;
  onDelete: (id: number) => void;
}) => (
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
    <div className="relative aspect-[4/3] bg-gray-50">
      {p.image_url ? (
        <Image src={p.image_url} alt={p.name} fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-xs text-gray-400">No Image</div>
      )}
    </div>
    <div className="px-4 pb-4 pt-3">
      <p className="text-xs text-gray-500">{categoryName}</p>
      <h3 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900">{p.name}</h3>
      <p className="mt-2 text-lg font-bold text-gray-900">{currency(p.price)}</p>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onEdit(p)}
          className="flex-1 rounded-lg border border-gray-900 px-4 py-2 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(p.id)}
          className="rounded-lg bg-black px-3 py-2 text-white transition hover:bg-gray-800"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
);

/** ------------ Page (Admin) ------------ */
const AdminPage = () => {
  /** Produk: state + filter + CRUD */
  const [products, setProducts] = useState<Product[]>(PRODUCTS_SEED);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [sort, setSort] = useState<"Name A-Z" | "Name Z-A" | "Lowest Price" | "Highest Price">("Name A-Z");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const catMap = useMemo(
    () => Object.fromEntries(CATEGORIES.map(c => [c.id, c.name])) as Record<number, string>,
    []
  );

  const filtered = useMemo(() => {
    let data = products.slice();
    if (query.trim()) {
      const s = query.toLowerCase();
      data = data.filter(p => p.name.toLowerCase().includes(s));
    }
    if (categoryId !== "all") {
      data = data.filter(p => p.category_id === categoryId);
    }
    if (statusFilter !== "all") {
      data = data.filter(p => p.is_active === (statusFilter === "active"));
    }
    switch (sort) {
      case "Name Z-A":      data.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "Lowest Price":  data.sort((a, b) => a.price - b.price); break;
      case "Highest Price": data.sort((a, b) => b.price - a.price); break;
      default:              data.sort((a, b) => a.name.localeCompare(b.name));
    }
    return data;
  }, [products, query, categoryId, sort, statusFilter]);

  // Form tambah/edit — gunakan string agar input angka fleksibel & bisa dikosongkan
  type Draft = { id: number; name: string; price: string; stock: string; category_id: number; is_active: boolean; image_url: string; };
  const [form, setForm] = useState<Draft>({ id: 0, name: "", price: "", stock: "", category_id: CATEGORIES[0].id, is_active: true, image_url: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  function resetForm() {
    setForm({ id: 0, name: "", price: "", stock: "", category_id: CATEGORIES[0].id, is_active: true, image_url: "" });
    setEditingId(null);
  }
  function submitProduct(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = Number(form.price.replace(/\D/g, ""));
    const stockNum = Number(form.stock.replace(/\D/g, ""));
    if (!form.name.trim()) return alert("Nama wajib diisi");
    if (isNaN(priceNum) || isNaN(stockNum)) return alert("Harga/Stok tidak valid");

    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId
        ? { ...p, name: form.name, price: priceNum, stock: stockNum, category_id: form.category_id, is_active: form.is_active, image_url: form.image_url }
        : p
      ));
    } else {
      const nextId = Math.max(0, ...products.map(p => p.id)) + 1;
      setProducts(prev => [{ id: nextId, name: form.name, price: priceNum, stock: stockNum, category_id: form.category_id, is_active: form.is_active, image_url: form.image_url }, ...prev]);
    }
    resetForm();
  }
  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({ id: p.id, name: p.name, price: String(p.price), stock: String(p.stock), category_id: p.category_id, is_active: p.is_active, image_url: p.image_url });
  }
  function removeProduct(id: number) {
    if (confirm("Hapus produk ini?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      if (editingId === id) resetForm();
    }
  }

  /** Pesanan: list + status dengan konfirmasi */
  const [orders, setOrders] = useState<Order[]>(ORDERS_SEED);
  const [orderItems] = useState<OrderItem[]>(ORDER_ITEMS_SEED);
  const itemsFor = (orderId: number) => orderItems.filter(it => it.order_id === orderId);
  const productName = (pid: number) => products.find(p => p.id === pid)?.name ?? `#${pid}`;

  // status sementara per order (belum disimpan)
  const [pendingStatus, setPendingStatus] = useState<Record<number, OrderStatus | null>>({});

  function setTempStatus(id: number, status: OrderStatus) {
    setPendingStatus(prev => ({ ...prev, [id]: status }));
  }
  function confirmStatus(id: number) {
    const next = pendingStatus[id];
    const original = orders.find(o => o.id === id)?.status;
    if (!next || next === original) return;
    if (confirm(`Ubah status pesanan #${id} menjadi "${next}"?`)) {
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: next } : o)));
      setPendingStatus(prev => ({ ...prev, [id]: null }));
    }
  }
  function cancelTempStatus(id: number) {
    setPendingStatus(prev => ({ ...prev, [id]: null }));
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header (tanpa Login/Register) */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Store className="h-6 w-6" />
            ShoeStore
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            <Link href="/" className="text-gray-600 hover:text-black">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-black">Products</Link>
            <Link href="/admin" className="text-gray-900 font-semibold">Admin</Link>
          </nav>
          <div className="w-[1px]" />
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-12">
        {/* Sidebar: Filter + Form CRUD */}
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Filter className="h-5 w-5 text-gray-900" /> Filter &amp; Manage
            </h2>

            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk…"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Category */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-gray-700">Category</p>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                  <input type="radio" name="category" checked={categoryId === "all"} onChange={() => setCategoryId("all")} className="h-4 w-4 accent-black" />
                  All
                </label>
                {CATEGORIES.map((c) => (
                  <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                    <input type="radio" name="category" checked={categoryId === c.id} onChange={() => setCategoryId(c.id)} className="h-4 w-4 accent-black" />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-gray-700">Status</p>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                  <input type="radio" name="status" checked={statusFilter === "all"} onChange={() => setStatusFilter("all")} className="h-4 w-4 accent-black" />
                  All
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                  <input type="radio" name="status" checked={statusFilter === "active"} onChange={() => setStatusFilter("active")} className="h-4 w-4 accent-black" />
                  Active
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                  <input type="radio" name="status" checked={statusFilter === "inactive"} onChange={() => setStatusFilter("inactive")} className="h-4 w-4 accent-black" />
                  Inactive
                </label>
              </div>
            </div>

            {/* Sort */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-gray-700">Sort By</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option>Name A-Z</option>
                <option>Name Z-A</option>
                <option>Lowest Price</option>
                <option>Highest Price</option>
              </select>
            </div>

            <div className="my-6 h-px bg-gray-200" />

            {/* Form Tambah/Edit */}
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
              <Plus className="h-4 w-4" /> {editingId ? "Edit Product" : "Add Product"}
            </h3>
            <form onSubmit={submitProduct} className="space-y-2">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama produk"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-2.5 text-sm text-gray-500">Rp</span>
                  <input
                    inputMode="numeric" pattern="[0-9]*"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })}
                    placeholder="Harga"
                    className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <input
                  inputMode="numeric" pattern="[0-9]*"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value.replace(/\D/g, "") })}
                  placeholder="Stok"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="/images/filename.jpg"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 accent-black" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                Active
              </label>
              <div className="flex gap-2">
                <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                  {editingId ? "Update" : "Add"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold hover:bg-gray-900 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </aside>

        {/* Products */}
        <section className="md:col-span-8 lg:col-span-9">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
            <p className="text-sm text-gray-600">Manage your catalog: add, edit, remove.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                categoryName={catMap[p.category_id]}
                onEdit={startEdit}
                onDelete={removeProduct}
              />
            ))}
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                Tidak ada produk yang cocok.
              </div>
            )}
          </div>
        </section>

        {/* Orders + konfirmasi status */}
        <section className="md:col-span-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Daftar Pesanan</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-white">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">User ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Waktu</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 max-w-[320px]">Alamat &amp; Item</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const temp = pendingStatus[o.id];
                    const value = temp ?? o.status;
                    const dirty = temp !== null && temp !== undefined && temp !== o.status;

                    return (
                      <tr key={o.id} className="border-t border-gray-200 align-top">
                        <td className="px-4 py-3">#{o.id}</td>
                        <td className="px-4 py-3">{o.r_id}</td>
                        <td className="px-4 py-3" suppressHydrationWarning>
                          {new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(o.created_at))}
                        </td>
                        <td className="px-4 py-3 max-w-[360px]">
                          <p className="truncate font-medium" title={o.address_text}>{o.address_text}</p>
                          <div className="mt-2 space-y-1 text-xs text-gray-600">
                            {itemsFor(o.id).map((it) => (
                              <div key={it.id} className="flex justify-between">
                                <span>{productName(it.product_id)} × {it.qty}</span>
                                <span>{currency(it.subtotal)}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{currency(o.total)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <select
                              value={value}
                              onChange={(e) => setTempStatus(o.id, e.target.value as OrderStatus)}
                              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                            >
                              <option value="pending">pending</option>
                              <option value="diproses">diproses</option>
                              <option value="dikirim">dikirim</option>
                              <option value="selesai">selesai</option>
                              <option value="batal">batal</option>
                            </select>

                            {dirty && (
                              <>
                                <button
                                  onClick={() => confirmStatus(o.id)}
                                  className="rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                                  title="Simpan status"
                                >
                                  Simpan
                                </button>
                                <button
                                  onClick={() => cancelTempStatus(o.id)}
                                  className="rounded-lg border border-gray-900 px-3 py-1.5 text-xs font-semibold hover:bg-gray-900 hover:text-white"
                                  title="Batalkan perubahan"
                                >
                                  Batal
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">Belum ada pesanan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminPage;
