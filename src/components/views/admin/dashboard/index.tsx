function AdminDashboardView() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[
        { label: "Total Produk", value: "27" },
        { label: "Pesanan Hari Ini", value: "12" },
        { label: "Pendapatan (mock)", value: "Rp 5.200.000" },
      ].map((c) => (
        <div key={c.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
          <p className="text-xs text-gray-500">{c.label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{c.value}</p>
        </div>
      ))}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:col-span-3">
        <p className="text-gray-700">Tambahkan grafik/insight di sini (placeholder).</p>
      </div>
    </div>
  );
}

export default AdminDashboardView;