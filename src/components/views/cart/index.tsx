import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

type ProductViewProps = {
  id: string;
};

const DetailProductView = ({ id }: ProductViewProps) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔧 ubah selectedSize jadi object berisi stock id & size
  const [selectedStock, setSelectedStock] = useState<{ id: number; size: string } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product?id=${id}`);
        if (!res.ok) {
          const errData = await res.json();
          console.log(errData.message);
          throw new Error("Failed to fetch product");
        }
        const data = await res.json();

        setProduct(data.product);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  const availableSizes = product.stocks?.filter((stock: any) => stock.quantity > 0) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    console.log("Added to cart:", {
      product_id: product.id,
      stock_id: selectedStock.id,
    });

    alert(`Added size ${selectedStock.size} (stock_id: ${selectedStock.id}) to cart!`);
    setSelectedStock(null);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          stock_id: selectedStock.id,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.log(errData.message);
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  console.log()
  console.log(selectedStock);

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
              <p className="text-xl text-gray-600">
                {product.categories?.name || "Uncategorized"}
              </p>
            </div>

            <div className="text-3xl font-bold">
              Rp {product.price?.toLocaleString("id-ID")}
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold">Select Size</label>
                <button className="text-sm underline">Size Guide</button>
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
                  Stock available:{" "}
                  {availableSizes.find((s: any) => s.id === selectedStock.id)?.quantity} pairs
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                className="w-full bg-black text-white py-4 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!selectedStock}
                onClick={handleSubmit}
              >
                <ShoppingCart className="inline w-5 h-5 mr-2" />
                Add to Bag
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product Code</span>
                <span className="font-medium">#{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium ${
                    availableSizes.length > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {availableSizes.length > 0 ? "In Stock" : "Out of Stock"}
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