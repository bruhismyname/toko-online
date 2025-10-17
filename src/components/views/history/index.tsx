import { useEffect, useState } from "react";
import { Package, MapPin, Calendar, CreditCard, User, Mail } from "lucide-react";

const HistoryView = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]); 

  const getSession = async () => {
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Session Data:", data);
        return data.user;
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  const getAllOrders = async (id: string) => {
    try {
      const res = await fetch(`/api/orders?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Orders Data:", data);
        setOrders(data);    
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getSession().then((data) => {
      if (data?.id) {
        setSessionId(data.id);
      }
    });
  }, []);

  useEffect(() => {
    if (sessionId) {
      getAllOrders(sessionId); 
    }
  }, [sessionId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'completed':
      case 'selesai':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'diproses':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'dibatalkan':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">Your Orders</h1>
              <p className="text-gray-600 mt-1">Riwayat pembelian Anda</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg">
              <Package className="w-5 h-5" />
              <span className="font-semibold">{orders.length} Order</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((orderItem) => (
              <div
                key={orderItem.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-black">
                          Order #{orderItem.order_id || orderItem.id}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{orderItem.created_at ? formatDate(orderItem.created_at) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 text-sm font-semibold rounded-lg border ${getStatusColor(orderItem.status)}`}>
                        {orderItem.status?.toUpperCase() || 'PENDING'}
                      </span>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase">Total</div>
                        <div className="text-xl font-bold text-black">{formatCurrency(orderItem.total)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Product Details */}
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-4">Product Details</h4>
                      <div className="space-y-4">
                        {orderItem.cart_item && (
                          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="w-24 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                              {orderItem.cart_item.product?.image_url ? (
                                <img 
                                  src={orderItem.cart_item.product.image_url} 
                                  alt={orderItem.cart_item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-10 h-10 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-bold text-black mb-1">
                                {orderItem.cart_item.product?.name || 'Product Name'}
                              </h5>
                              <div className="space-y-1 text-sm">
                                <p className="text-gray-600">
                                  <span className="font-semibold">Price:</span> {formatCurrency(orderItem.cart_item.product?.price || 0)}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-semibold">Quantity:</span> {orderItem.cart_item.qty}
                                </p>
                                <p className="font-semibold text-black mt-2">
                                  Subtotal: {formatCurrency(orderItem.total)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping & Customer Info */}
                    <div className="space-y-4">
                      {/* Shipping Address */}
                      {orderItem.address && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-2 mb-3">
                            <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h4>
                              <div className="text-sm text-gray-700 space-y-1">
                                <p className="font-medium">{orderItem.address.street}</p>
                                <p>{orderItem.address.city}, {orderItem.address.province}</p>
                                <p>{orderItem.address.postal_code}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Customer Info */}
                      {orderItem.order?.user && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Info</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-700">{orderItem.order.user.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-700">{orderItem.order.user.email}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      
                    </div>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Order ID: <span className="font-mono font-semibold text-black">{orderItem.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-16 px-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">
              Start shopping for premium Converse collection
            </p>
            <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Shop Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;