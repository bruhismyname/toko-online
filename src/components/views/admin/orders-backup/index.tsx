import { useState, useEffect } from 'react';
import OrderDetailModal from '@/components/fragment/modal/admin-order-detail';
import AdminLayout from '../layout';

const OrdersAdminView = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const getAllOrdersProducts = async () => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getAllOrdersProducts();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const currency = (value : any) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString : any) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
 
  const getStatusBadge = (status : keyof typeof statusStyles) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };



    return (
      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  console.log(orders)
  console.log(orders.length)

  const filteredOrders = orders.filter((order : any) => {
    const matchesSearch = 
      order.cart_item?.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order?.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openModal = (id: number) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    setIsModalOpen(false);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Total {orders.length} orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 rounded-lg border-2 border-black bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <svg 
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, customers, products..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-black">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-sm font-medium">Loading orders...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-sm font-medium">No orders found</p>
                          <p className="mt-1 text-xs">
                            {searchQuery || statusFilter !== "all" 
                              ? "Try adjusting your filters" 
                              : "No orders have been placed yet"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order : any) => (
                      <tr 
                        key={order.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {order.order?.user?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.order?.user?.email || '-'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                              {order.cart_item?.product?.image_url ? (
                                <img
                                  src={order.cart_item.product.image_url}
                                  alt={order.cart_item.product.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                  NO IMAGE
                                </div>
                              )}
                            </div>
                            <div className="max-w-xs">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {order.cart_item?.product?.name || 'Unknown Product'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                            {order.cart_item?.qty || 0}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                          {currency(order.total || 0)}
                        </td>
                        {/* 🆕 Kolom Address */}
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {order.address ? (
                            <div className="max-w-[250px]">
                              <p className="font-medium">{order.address.city}</p>
                              <p className="text-xs text-gray-500">
                                {order.address.street}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.address.province} ({order.address.postal_code})
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs italic text-gray-400">No address</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {getStatusBadge(order.status) ?? 'pending'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openModal(order.id)}
                              className="rounded-lg border border-gray-300 p-2 text-gray-700 transition-colors hover:border-black hover:bg-black hover:text-white"
                              title="View Details"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => alert(`Update status for order #${order.id}`)}
                              className="rounded-lg border border-gray-300 p-2 text-gray-700 transition-colors hover:border-black hover:bg-black hover:text-white"
                              title="Update Status"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
                Total Orders
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
              {filteredOrders.length !== orders.length && (
                <p className="mt-1 text-xs text-gray-500">
                  Showing {filteredOrders.length}
                </p>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
                Pending Orders
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {pendingOrders}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
                Total Revenue
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {currency(totalRevenue)}
              </p>
              {filteredOrders.length !== orders.length && (
                <p className="mt-1 text-xs text-gray-500">
                  Filtered: {currency(filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0))}
                </p>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
                Avg Order Value
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {orders.length > 0 ? currency(totalRevenue / orders.length) : currency(0)}
              </p>
            </div>
          </div>
        </div>
        <OrderDetailModal
          orderId={selectedOrderId}
          isOpen={isModalOpen}
          onClose={closeModal}
          onUpdateSuccess={async () => {
            const data = await getAllOrdersProducts();
            setOrders(data);
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default OrdersAdminView;