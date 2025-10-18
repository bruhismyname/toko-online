import { useEffect, useState } from "react";
import AddCategoryModal from "@/components/fragment/modal/add-category-modal";
import AddProductModal from "@/components/fragment/modal/add-product-modal";
import AdminLayout from "@/components/views/admin/layout";
import { useRouter } from "next/router";
import EditProductModal from "@/components/fragment/modal/edit-product";
import { useNotification } from "@/components/context/NotificationContext";
import { get } from "http";

const AdminProductView = () => {
  const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const { showNotification } = useNotification();

  
  const categories = Array.from(
    new Map(
      products
        .filter(p => p.category)
        .map(p => [p.category.id, p.category])
    ).values()
  ).sort((a, b) => a.id - b.id);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const getAllProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");

      if (res.status === 401 || res.status === 403) {
        router.push("/404"); 
        return [];
      }

      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };


  const currency = (val: number) => 
    new Intl.NumberFormat("id-ID", { 
      style: "currency", 
      currency: "IDR",
      minimumFractionDigits: 0 
    }).format(val);

  const totalStock = (product: any) => {
    return product.stocks?.reduce((sum: number, s: any) => sum + s.quantity, 0) || 0;
  };

  const handleEdit = (product: any) => {
    setSelectedProductId(product.id);
    setIsEditProductOpen(true);
  };

  const handleDelete = async (productId: number) => {
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        showNotification("Produk berhasil dihapus!", "success");
        const data = await getAllProducts();
        setProducts(data); 
      } else {
        showNotification("Gagal menghapus produk", "error");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Terjadi kesalahan saat menghapus produk", "error");
    }
  };

  const handleAddProduct = () => {
    setIsAddProductOpen(true);
  };

    const handleAddCategory = () => {
      setIsAddCategoryOpen(true);
    };

    


  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && product.is_active) || 
      (statusFilter === "inactive" && !product.is_active);
    const matchesCategory = categoryFilter === "all" || 
      product.category?.id === Number(categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  console.log(products);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
          <p className="mt-4 text-sm font-medium text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Total {products.length} products
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddCategory}
                className="flex items-center gap-2 rounded-lg border-2 border-black bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Add Category
              </button>
              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </button>
            </div>
          </div>

          {/* Filters */}
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
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-black">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white">
                      Sizes
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredProducts.map((product, idx) => (
                    <tr 
                      key={product.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        #{product.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover object-center"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                NO IMAGE
                              </div>
                            )}
                          </div>
                          <div className="max-w-xs">
                            <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                              {product.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                        {product.category?.name || '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                        {currency(product.price)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                          {totalStock(product)} units
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {product.is_active ? (
                          <span className="inline-flex items-center rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-300 px-3 py-1 text-xs font-semibold text-gray-700">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {product.stocks?.map((stock: any) => (
                            <div
                              key={stock.id}
                              className="inline-flex items-center gap-1.5 rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                            >
                              <span className="font-semibold text-gray-900">
                                {stock.size}
                              </span>
                              <span className="text-gray-500">:</span>
                              <span className={stock.quantity > 5 ? "text-gray-700" : "text-red-600 font-medium"}>
                                {stock.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="rounded-lg border border-gray-300 p-2 text-gray-700 transition-colors hover:border-black hover:bg-black hover:text-white"
                            title="Edit Product"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-lg border border-red-300 p-2 text-red-600 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white"
                            title="Delete Product"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-sm font-medium">No products found</p>
                          <p className="mt-1 text-xs">
                            {searchQuery || statusFilter !== "all" || categoryFilter !== "all" 
                              ? "Try adjusting your filters" 
                              : "Start by adding your first product"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
                Total Products
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {products.length}
              </p>
              {filteredProducts.length !== products.length && (
                <p className="mt-1 text-xs text-gray-500">
                  Showing {filteredProducts.length}
                </p>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
                Active Products
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {products.filter(p => p.is_active).length}
              </p>
              {filteredProducts.length !== products.length && (
                <p className="mt-1 text-xs text-gray-500">
                  Filtered: {filteredProducts.filter(p => p.is_active).length}
                </p>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-600">
                Total Stock
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {products.reduce((sum, p) => sum + totalStock(p), 0)}
              </p>
              {filteredProducts.length !== products.length && (
                <p className="mt-1 text-xs text-gray-500">
                  Filtered: {filteredProducts.reduce((sum, p) => sum + totalStock(p), 0)}
                </p>
              )}
            </div>
          </div>
        </div>
          <AddCategoryModal isOpen={isAddCategoryOpen} onClose={() => setIsAddCategoryOpen(false)} onCategoryAdded={() => {getAllProducts().then(setProducts)}} />
          <AddProductModal isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)}  onProductAdded={() => {getAllProducts().then(setProducts)}} />
      </div>
      <EditProductModal
        isOpen={isEditProductOpen}
        onClose={() => setIsEditProductOpen(false)}
        productId={selectedProductId}
      />
    </AdminLayout>
  );
};

export default AdminProductView;