import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useNotification } from "@/components/context/NotificationContext"; // ✅ pakai context global notif

type ProductViewProps = {
  id: string;
};

const DetailProductView = ({ id }: ProductViewProps) => {
  const router = useRouter();
  const { showNotification } = useNotification(); // ✅ context notifikasi
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{ id: number; size: string } | null>(null);

  // ✅ Cek status login
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(!!data.user);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // ✅ Fetch data produk
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product?id=${id}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Gagal memuat produk");
        }
        const data = await res.json();
        setProduct(data.product);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message);
        showNotification("Gagal memuat produk. Silakan coba lagi.", "error"); // ✅ notif error
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, showNotification]);

  // ✅ Handle tambah ke keranjang
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    if (!isLoggedIn) {
      // Simpan data sementara untuk login redirect
      localStorage.setItem(
        "pendingCartItem",
        JSON.stringify({
          product_id: product.id,
          stock_id: selectedStock.id,
          product_name: product.name,
          size: selectedStock.size,
          redirect_url: `/products/${id}`,
        })
      );

      showNotification("Silakan login terlebih dahulu untuk menambahkan ke keranjang.", "info"); // ✅ notif login
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          stock_id: selectedStock.id,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Gagal menambahkan ke keranjang");
      }

      showNotification(`${product.name} (size ${selectedStock.size}) berhasil ditambahkan ke keranjang!`, "success"); // ✅ notif sukses
      setSelectedStock(null);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification("Gagal menambahkan produk ke keranjang.", "error"); // ✅ notif error
    }
  };

  // ✅ Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-lg">Product not found</p>
      </div>
    );
  }

  const availableSizes = product.stocks?.filter((s: any) => s.quantity > 0) || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Gambar Produk */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Detail Produk */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-gray-600">{product.categories?.name || "Uncategorized"}</p>
            </div>

            <div className="text-3xl font-bold">
              Rp {product.price?.toLocaleString("id-ID")}
            </div>

            {/* Pilih Ukuran */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold">Pilih Ukuran</label>
                <Link href="/size-guide" className="text-sm underline">
                  Panduan Ukuran
                </Link>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map((stock: any) => (
                  <button
                    key={stock.id}
                    onClick={() => setSelectedStock({ id: stock.id, size: stock.size })}
                    className={`py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                      selectedStock?.id === stock.id
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {stock.size}
                  </button>
                ))}
              </div>

              {selectedStock && (
                <p className="text-sm text-gray-600">
                  Stok tersedia:{" "}
                  {availableSizes.find((s: any) => s.id === selectedStock.id)?.quantity} pasang
                </p>
              )}
            </div>

            {/* Tombol Aksi */}
            <div className="space-y-3">
              <button
                className="w-full bg-black text-white py-4 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!selectedStock}
                onClick={handleSubmit}
              >
                <ShoppingCart className="inline w-5 h-5 mr-2" />
                {isLoggedIn ? "Tambah ke Keranjang" : "Login untuk Menambahkan"}
              </button>
            </div>

            {/* Info Tambahan */}
            <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Kode Produk</span>
                <span className="font-medium">#{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium ${
                    availableSizes.length > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {availableSizes.length > 0 ? "Tersedia" : "Stok Habis"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProductView;
