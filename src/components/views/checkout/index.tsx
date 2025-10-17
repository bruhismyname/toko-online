import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddressModal from "@/components/fragment/modal/address-form-modal";
import cart from "@/pages/api/cart";

type CheckoutViewsProps = {
  id: string;
};

const CheckoutViews = ({ id }: CheckoutViewsProps) => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderItem, setOrderItem] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        router.push("/auth/login");
        return;
      }

      const json = await res.json();
      if (json.user === "admin") {
        router.push("/dashboard");
        return;
      }

      setUser(json.user);

      const addressList = await getAddressByUserId(json.user.id);
      setAddresses(addressList);

      if (addressList.length === 0) {
        setShowModal(true);
      }

      if (id) {
        setOrderId(id);
        await getOrderItem(id);
      }
    };

    init();
  }, [id, router]);

  const getOrderItem = async (checkoutId: string) => {
    try {
      const res = await fetch(`/api/checkout?id=${checkoutId}`);
      if (!res.ok) {
        const errData = await res.json();
        console.log(errData.message);
        throw new Error("Failed to fetch order item");
      }

      const data = await res.json();
      console.log("Order ID:", data.data.id);
      setOrderItem(data.data);
    } catch (error) {
      console.error("Error fetching order item:", error);
    }
  };


  const getAddressByUserId = async (userId: string) => {
    try {
      const res = await fetch(`/api/address?user_id=${userId}`);
      if (!res.ok) {
        const errData = await res.json();
        console.log(errData.message);
        throw new Error("Failed to fetch address");
      }
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching address:", error);
      return [];
    }
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddress(id);
  };

  const handleOrder = async () => {
    if (!orderItem || !selectedAddress) return;

    try {
      const res = await fetch(`/api/checkout`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderItem.id,
          stock_id : orderItem.cart_items.stock_id , 
          cart_item_id: orderItem.cart_items.id,
          address_id: selectedAddress,
          status: "diproses",
        }),
      });


      if (!res.ok) {
        const errData = await res.json();
        console.error(errData.message || "Failed to update order");
        throw new Error("Failed to update order");
      }

      const result = await res.json();
      console.log("✅ Order updated:", result);

      alert("Pesanan berhasil dibuat!");
      // misalnya arahkan ke halaman sukses
      router.push(`/products`);
    } catch (error) {
      console.error("❌ Error saat membuat pesanan:", error);
    }
  };

  console.log(orderItem)


  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        Checkout {orderId && `(Order ID: ${orderId})`}
      </h1>

      {/* 🛍️ Produk yang diorder */}
      {orderItem && (
        <div className="flex gap-4 border p-4 rounded-md shadow-sm">
          <img
            src={orderItem.cart_items.products.image_url}
            alt={orderItem.cart_items.products.name}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {orderItem.cart_items.products.name}
            </h2>
            <p className="text-gray-600 text-sm">Ukuran: {orderItem.cart_items.stocks.size}</p>
            <p className="text-gray-600 text-sm">Qty: {orderItem.cart_items.qty}</p>
            <p className="text-blue-600 font-semibold mt-2">
              Rp {orderItem.total.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      )}

      {/* 🏠 Alamat Pengiriman */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Alamat Pengiriman</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
          >
            Tambah Alamat
          </button>
        </div>

        {addresses.length > 0 ? (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => handleSelectAddress(addr.id)}
                className={`border p-3 rounded cursor-pointer transition ${
                  selectedAddress === addr.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <p className="font-medium">{addr.street}</p>
                <p className="text-sm text-gray-600">
                  {addr.city}, {addr.province} {addr.zip_code}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-2">Belum ada alamat pengiriman.</p>
        )}
      </div>

      {/* 🧾 Ringkasan Order */}
      {orderItem && (
        <div className="border-t pt-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>Rp {orderItem.total.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Ongkos Kirim</span>
            <span>Rp 0</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mt-2">
            <span>Total</span>
            <span>Rp {orderItem.total.toLocaleString("id-ID")}</span>
          </div>
        </div>
      )}

      {/* 🟦 Tombol Order */}
      <div className="mt-4">
        <button
          disabled={!selectedAddress}
          onClick={() => handleOrder()}
          className={`w-full py-3 rounded text-white text-lg ${
            selectedAddress ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Buat Pesanan
        </button>
      </div>

      {/* Modal Tambah Alamat */}
      {showModal && (
        <AddressModal
          userId={user?.id}
          onClose={() => setShowModal(false)}
          onSuccess={async () => {
            const updatedAddresses = await getAddressByUserId(user.id);
            setAddresses(updatedAddresses);
          }}
        />
      )}
    </div>
  );
};

export default CheckoutViews;
