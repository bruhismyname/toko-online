import React, { useEffect, useState } from "react";
import { useNotification } from "@/components/context/NotificationContext";

type EditProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
  onProductUpdated?: () => void;
};

type ProductFormData = {
  name: string;
  price: number;
  category_id: number;
  category_name: string;
  is_active: boolean;
  image_url: string;
  stocks: { size: string; quantity: number }[];
};

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  productId,
  onProductUpdated,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    category_id: 1,
    category_name: "",
    is_active: true,
    image_url: "",
    stocks: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { showNotification } = useNotification();

  const getDetailProductByID = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error("Gagal fetch data produk:", res.statusText);
        showNotification("Gagal memuat data produk", "error"); 
        return null;
      }

      const json = await res.json();
      return json[0];
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("Terjadi kesalahan saat memuat data produk", "error"); 
      return null;
    }
  };

  useEffect(() => {
    if (!isOpen || !productId) return;

    let isMounted = true;
    setLoading(true);

    getDetailProductByID(productId).then((data) => {
      if (isMounted && data) {
        setFormData({
          name: data.name || "",
          price: data.price || 0,
          category_id: data.category?.id || 1,
          category_name: data.category?.name || "",
          is_active: data.is_active ?? true,
          image_url: data.image_url || "",
          stocks:
            data.stocks?.map((s: any) => ({
              size: s.size,
              quantity: s.quantity,
            })) || [],
        });
        setImagePreview(data.image_url || "");
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, productId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStockChange = (
    index: number,
    field: "size" | "quantity",
    value: string
  ) => {
    const newStocks = [...formData.stocks];
    if (field === "size") {
      newStocks[index].size = value;
    } else {
      newStocks[index].quantity = parseInt(value) || 0;
    }
    setFormData({ ...formData, stocks: newStocks });
  };

  const addStock = () => {
    setFormData({
      ...formData,
      stocks: [...formData.stocks, { size: "", quantity: 0 }],
    });
  };

  const removeStock = (index: number) => {
    const newStocks = formData.stocks.filter((_, i) => i !== index);
    setFormData({ ...formData, stocks: newStocks });
  };

  const handleSubmit = async () => {
    setSaving(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", String(formData.price));
    formDataToSend.append("category_id", String(formData.category_id));
    formDataToSend.append("is_active", String(formData.is_active));
    formDataToSend.append("stocks", JSON.stringify(formData.stocks));

    if (imageFile) {
        formDataToSend.append("image", imageFile);
    }

    try {
        const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: "PUT",
        body: formDataToSend, 
        });

        if (res.ok) {
        showNotification("Produk berhasil diperbarui!", "success"); 
        onProductUpdated?.();
        onClose();
        } else {
        showNotification("Gagal memperbarui produk", "error"); 
        }
    } catch (error) {
        console.error("Error updating product:", error);
        showNotification("Terjadi kesalahan saat memperbarui produk", "error"); 
    } finally {
        setSaving(false);
    }
    };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg my-8">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="p-6">
            <p className="text-sm text-gray-500">Loading product details...</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Name (read only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category_name}
                readOnly
                className="w-full bg-gray-100 rounded-lg border border-gray-300 px-3 py-2 text-gray-600"
              />
            </div>

            {/* Active Status (Dropdown) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Status
              </label>
              <select
                value={formData.is_active ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "true",
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Image
                </label>
                <img
                  src={imagePreview}
                  alt="Product"
                  className="h-32 w-32 rounded-lg object-cover border border-gray-200"
                />
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Change Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Stocks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Stock Sizes
                </label>
                <button
                  type="button"
                  onClick={addStock}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Size
                </button>
              </div>
              <div className="space-y-2">
                {formData.stocks.map((stock, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Size"
                      value={stock.size}
                      onChange={(e) =>
                        handleStockChange(index, "size", e.target.value)
                      }
                      className="w-24 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={stock.quantity}
                      onChange={(e) =>
                        handleStockChange(index, "quantity", e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeStock(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {formData.stocks.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No stock sizes added yet
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProductModal;
