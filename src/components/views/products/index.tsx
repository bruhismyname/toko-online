import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Store, Search, Filter, Plus } from "lucide-react";
import Product from "@/components/types/product";
import Category from "@/components/types/category";
import ProductCard from "@/components/fragment/product-card";

const ProductsView = () => {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [sort, setSort] = useState<
    "Name A-Z" | "Name Z-A" | "Lowest Price" | "Highest Price"
  >("Name A-Z");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  console.log(allProducts);

  const getAllProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch products");
      }
      const data = await res.json();
      setAllProducts(data);
      setProducts(data);

      const cats = Array.from(
        new Map(
          data.map((p: Product) => [p.categories?.id, p.categories])
        ).values()
      ).filter(Boolean) as Category[];
      setCategories(cats);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
    checkSession();
  }, []);

  const filtered = useMemo(() => {
    let data = allProducts.filter((p) => p.is_active);

    if (query.trim()) {
      const s = query.toLowerCase();
      data = data.filter(
        (p) =>
          // Cari berdasarkan nama produk
          p.name.toLowerCase().includes(s) ||
          // ATAU berdasarkan nama kategori
          p.categories?.name.toLowerCase().includes(s)
      );
    }
    if (categoryId !== "all") {
      data = data.filter((p) => p.categories?.id === categoryId);
    }

    switch (sort) {
      case "Name Z-A":
        data.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Lowest Price":
        data.sort((a, b) => a.price - b.price);
        break;
      case "Highest Price":
        data.sort((a, b) => b.price - a.price);
        break;
      default:
        data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [allProducts, query, categoryId, sort]);

  const checkSession = async () => {
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      if (!res.ok) {
        setUser(null);
      } else {
        setUser(json.user);
      }
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-12">
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Filter className="h-5 w-5 text-converse-red" /> Filter Sepatu
            </h2>

            <div className="relative mb-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nama atau kategori..."
                  className="w-full rounded-lg border-2 border-gray-200 py-2.5 pl-10 pr-3 text-sm focus:border-converse-red focus:outline-none focus:ring-1 focus:ring-converse-red"
                />
              </div>
              {query && (
                <p className="mt-1 text-xs text-gray-500">
                  Mencari: <span className="font-medium">{query}</span>
                </p>
              )}
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Kategori
              </p>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-50 text-sm text-gray-800">
                  <input
                    type="radio"
                    name="category"
                    checked={categoryId === "all"}
                    onChange={() => setCategoryId("all")}
                    className="h-4 w-4 accent-converse-red"
                  />
                  Semua Sepatu
                </label>
                {categories.map((c) => (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-50 text-sm text-gray-800"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={categoryId === c.id}
                      onChange={() => setCategoryId(c.id)}
                      className="h-4 w-4 accent-converse-red"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-5">
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Urutkan
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="w-full rounded-lg border-2 border-gray-200 px-3 py-2.5 text-sm focus:border-converse-red focus:outline-none focus:ring-1 focus:ring-converse-red"
              >
                <option>Name A-Z</option>
                <option>Name Z-A</option>
                <option>Lowest Price</option>
                <option>Highest Price</option>
              </select>
            </div>
          </div>
        </aside>

        <section className="md:col-span-8 lg:col-span-9">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Koleksi Sepatu</h1>
            <p className="text-sm text-gray-600">
              Temukan sepatu Converse favoritmu!!!
            </p>

            {/* Hasil Pencarian Info */}
            {query && (
              <div className="mt-2 rounded-lg bg-gray-50 p-3 text-sm">
                <p>
                  Hasil pencarian untuk "{query}": {filtered.length} produk
                  ditemukan
                </p>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-converse-red"></div>
            </div>
          )}

          {error && <p className="text-red-500">Error: {error}</p>}

          {!loading && filtered.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-500">Tidak ada produk yang ditemukan.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategoryId("all");
                }}
                className="mt-4 rounded-lg bg-converse-red px-4 py-2 text-sm text-white hover:bg-converse-black transition-colors"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProductsView;
