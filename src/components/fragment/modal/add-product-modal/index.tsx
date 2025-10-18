"use client";

import { useEffect, useState } from "react";

type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
};

export default function AddProductModal({
  isOpen,
  onClose,
  onProductAdded,
}: AddProductModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [stocks, setStocks] = useState([{ size: "", quantity: "" }]);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAllCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddStock = () => {
    setStocks([...stocks, { size: "", quantity: "" }]);
  };

  const handleRemoveStock = (index: number) => {
    setStocks(stocks.filter((_, i) => i !== index));
  };

  const handleUpdateStock = (
    index: number,
    field: "size" | "quantity",
    value: string
  ) => {
    const newStocks = [...stocks];
    newStocks[index][field] = value;
    setStocks(newStocks);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", String(price));
      formData.append("category_id", categoryId);
      formData.append(
        "stocks",
        JSON.stringify(
          stocks.map((s) => ({
            size: s.size,
            quantity: Number(s.quantity),
          }))
        )
      );
      if (image) formData.append("image", image);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      setStocks([{ size: "", quantity: "" }]);
      setName("");
      setPrice("");
      setCategoryId("");
      setImage(null);
      setPreviewImage(null);
      onProductAdded();
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Tambah Produk</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          {/* Nama Produk */}
          <div>
            <label className="block text-sm font-medium">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md p-2 mt-1"
              placeholder="Contoh: Converse All Star"
              required
            />
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-medium">Harga</label>
            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value ? Number(e.target.value) : "")
              }
              className="w-full border rounded-md p-2 mt-1"
              placeholder="Contoh: 100000"
              required
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded-md p-2 mt-1"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium mb-1">Gambar Produk</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-md p-2"
            />
            {previewImage && (
              <div className="mt-2">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Stok Produk */}
          <div>
            <label className="block text-sm font-medium mb-2">Stok Produk</label>
            {stocks.map((stock, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Size"
                  value={stock.size}
                  onChange={(e) =>
                    handleUpdateStock(index, "size", e.target.value)
                  }
                  className="flex-1 border rounded-md p-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={stock.quantity}
                  onChange={(e) =>
                    handleUpdateStock(index, "quantity", e.target.value)
                  }
                  className="flex-1 border rounded-md p-2"
                  required
                />
                {stocks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStock(index)}
                    className="bg-red-500 text-white px-2 rounded-md"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddStock}
              className="text-black text-sm font-medium"
            >
              + Tambah Baris Stok
            </button>
          </div>

          {/* Tombol */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded-md disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Tambah Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
