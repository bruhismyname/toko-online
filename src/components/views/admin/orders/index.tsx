import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

/* ============== Types ============== */
export type OrderStatus = "pending" | "diproses" | "dikirim" | "selesai" | "batal";

type ProductLite = { id: number; name: string; price: number };
type OrderItemRow = {
  id: number;
  price: number;
  qty: number;
  subtotal: number;
  products?: ProductLite | null;
};
export type OrderRow = {
  id: number;
  user_id: number;
  total: number;
  status: OrderStatus;
  address_text: string;
  created_at: string;
  users?: { id: number; name: string | null; email: string | null } | null;
  order_items: OrderItemRow[];
};

/* ============== Helpers ============== */
const currency = (n: number) =>
  n.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })
    .format(new Date(iso));

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" })
    .format(new Date(iso));

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  batal: "Batal",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending:  "bg-yellow-50 border-yellow-200 text-yellow-900",
  diproses: "bg-blue-50 border-blue-200 text-blue-900",
  dikirim:  "bg-indigo-50 border-indigo-200 text-indigo-900",
  selesai:  "bg-emerald-50 border-emerald-200 text-emerald-900",
  batal:    "bg-rose-50 border-rose-200 text-rose-900",
};

/* ============== Modal konfirmasi ============== */
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  order,
  nextStatus,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  order: OrderRow | null;
  nextStatus: OrderStatus | null;
}) {
  if (!open || !order || !nextStatus) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900">Konfirmasi Perubahan Status</h3>
        <p className="mt-2 text-sm text-gray-600">
          Pesanan <span className="font-semibold">#{order.id}</span> (user <span className="font-semibold">#{order.user_id}</span>) akan diubah menjadi{" "}
          <span className="font-semibold">{STATUS_LABEL[nextStatus]}</span>.
        </p>

        <div className="mt-4 rounded-lg border border-gray-200 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Status sekarang</span>
            <span className="font-semibold">{STATUS_LABEL[order.status]}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-gray-600">Status baru</span>
            <span className="font-semibold">{STATUS_LABEL[nextStatus]}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold hover:bg-gray-900 hover:text-white"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============== VIEW ============== */
const AdminOrdersView = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  // draft status + modal
  const [pendingStatus, setPendingStatus] = useState<Record<number, OrderStatus | null>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalId, setModalId] = useState<number | null>(null);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      setOrders(json.orders ?? []);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { fetchOrders(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (!s) return true;
      const hay = [
        String(o.id),
        String(o.user_id),
        o.users?.name ?? "",
        o.users?.email ?? "",
        o.address_text ?? "",
        ...o.order_items.map((it) => it.products?.name ?? ""),
      ].join(" ").toLowerCase();
      return hay.includes(s);
    });
  }, [orders, q, status]);

  function handleChangeStatus(orderId: number, value: OrderStatus) {
    const current = orders.find((o) => o.id === orderId)?.status;
    if (current === value) return;
    setPendingStatus((prev) => ({ ...prev, [orderId]: value }));
    setModalId(orderId);
    setModalOpen(true);
  }

  async function confirmSave() {
    if (modalId == null) return;
    const id = modalId;
    const next = pendingStatus[id];
    const original = orders.find((o) => o.id === id)?.status as OrderStatus;

    // optimistik
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next as OrderStatus } : o)));
    setPendingStatus((p) => ({ ...p, [id]: null }));
    setModalOpen(false);
    setModalId(null);

    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
    } catch (e) {
      console.error(e);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: original } : o)));
      alert("Gagal menyimpan status. Coba lagi.");
    }
  }

  function closeModal() {
    setModalOpen(false);
    setModalId(null);
    if (modalId != null) setPendingStatus((p) => ({ ...p, [modalId]: null }));
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* filter bar (tanpa judul & tanpa Reset) */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari (ID, user, alamat, produk)…"
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black md:w-56"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="diproses">Diproses</option>
            <option value="dikirim">Dikirim</option>
            <option value="selesai">Selesai</option>
            <option value="batal">Batal</option>
          </select>
        </div>

        {/* table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-white">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Alamat</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Item</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">Memuat…</td>
                </tr>
              )}

              {!loading && filtered.map((o) => (
                <tr key={o.id} className="border-t border-gray-200 align-top">
                  <td className="px-4 py-3">#{o.id}</td>

                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">#{o.user_id}</div>
                    <div className="text-xs text-gray-600">{o.users?.name ?? "-"}</div>
                  </td>

                  <td className="px-4 py-3 max-w-[360px]">
                    <p className="truncate text-gray-900" title={o.address_text}>{o.address_text}</p>
                  </td>

                  <td className="px-4 py-3">
                    <div className="space-y-1 text-xs text-gray-700">
                      {o.order_items.map((it) => (
                        <div key={it.id} className="flex justify-between gap-3">
                          <span className="truncate">
                            {it.products?.name ?? `#${it.products?.id ?? "-"}`} × {it.qty}
                          </span>
                          <span>{currency(it.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right font-semibold">{currency(o.total)}</td>

                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleChangeStatus(o.id, e.target.value as OrderStatus)}
                      className={`rounded-lg border px-3 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black ${STATUS_STYLE[o.status]}`}
                      title="Ubah status"
                    >
                      <option value="pending">Pending</option>
                      <option value="diproses">Diproses</option>
                      <option value="dikirim">Dikirim</option>
                      <option value="selesai">Selesai</option>
                      <option value="batal">Batal</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <div className="leading-tight">
                      <div className="text-gray-900">{fmtDate(o.created_at)}</div>
                      <div className="text-xs text-gray-600">{fmtTime(o.created_at)}</div>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">Tidak ada pesanan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* popup konfirmasi */}
      <ConfirmModal
        open={modalOpen}
        onClose={closeModal}
        onConfirm={confirmSave}
        order={orders.find((o) => o.id === (modalId ?? -1)) ?? null}
        nextStatus={modalId ? pendingStatus[modalId] ?? null : null}
      />
    </main>
  );
};

export default AdminOrdersView;
