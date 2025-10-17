import { useEffect, useState } from "react";
import AdminLayout from "../layout";

function AdminDashboardView() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const getOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();

      const today = new Date().toISOString().split("T")[0];
      const ordersToday = Array.isArray(data)
        ? data.filter((order: { created_at?: string }) => {
            if (!order.created_at) return false;
            const orderDate = new Date(order.created_at)
              .toISOString()
              .split("T")[0];
            return orderDate === today;
          })
        : [];

      return ordersToday;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [productsData, ordersData] = await Promise.all([
        getProducts(),
        getOrders(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("id-ID").format(num);

  const currency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent mb-4"></div>
              <p className="text-gray-500">Memuat data dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  const activeProducts = products.filter(p => p.is_active).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const cards = [
    { 
      label: "Total Produk", 
      value: formatNumber(products.length),
      subtitle: `${activeProducts} aktif`,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    { 
      label: "Pesanan Hari Ini", 
      value: formatNumber(orders.length),
      subtitle: pendingOrders > 0 ? `${pendingOrders} pending` : "Semua selesai",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    { 
      label: "Pendapatan Hari Ini", 
      value: currency(totalRevenue),
      subtitle: orders.length > 0 ? `Dari ${orders.length} pesanan` : "Belum ada pesanan",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout >
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Selamat datang di admin panel Bakul Converse
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-600">
                        {card.label}
                      </p>
                      <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                        {card.value}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {card.subtitle}
                      </p>
                    </div>
                    <div className={`rounded-lg ${card.bgColor} p-3 ${card.iconColor}`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboardView;