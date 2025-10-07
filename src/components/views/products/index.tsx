import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Store, Search, Filter, Plus } from "lucide-react";
import Product from "@/components/types/product";
import Category from "@/components/types/category";
import ProductCard from "@/components/fragment/product-card";
import Navbar from "@/components/fragment/navbar";

const ProductsView = () => {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [sort, setSort] = useState<"Name A-Z" | "Name Z-A" | "Lowest Price" | "Highest Price">("Name A-Z");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

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
      data = data.filter((p) => p.name.toLowerCase().includes(s));
    }
    if (categoryId !== "all") {
      data = data.filter((p) => p.categories?.id === categoryId);
    }

    switch (sort) {
      case "Name Z-A":      data.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "Lowest Price":  data.sort((a, b) => a.price - b.price); break;
      case "Highest Price": data.sort((a, b) => b.price - a.price); break;
      default:              data.sort((a, b) => a.name.localeCompare(b.name));
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
  

  const handleAddToCart = async ( product_id : number) => {
    if (user === null) {
      router.push("/auth/login");
    } else {
        try {
        const res = await fetch("/api/cart", {
          method : "POST" , 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id }),
          credentials: "include",
        })

        if (res.ok) {
          const json = await res.json()
          alert(json.message)
        }
      } catch (error) {
        console.log("Error adding to cart:", error);
      }
    }
  }

  console.log(user)

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-12">
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Filter className="h-5 w-5 text-gray-900" /> Filter Shoes
            </h2>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shoes..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-gray-700">Category</p>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                  <input
                    type="radio"
                    name="category"
                    checked={categoryId === "all"}
                    onChange={() => setCategoryId("all")}
                    className="h-4 w-4 accent-black"
                  />
                  All Shoes
                </label>
                {categories.map((c) => (
                  <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                    <input
                      type="radio"
                      name="category"
                      checked={categoryId === c.id}
                      onChange={() => setCategoryId(c.id)}
                      className="h-4 w-4 accent-black"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-gray-700">Sort By</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
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
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">All Shoes</h1>
            <p className="text-sm text-gray-600">Find your next pair: running, basketball, lifestyle, and more.</p>
          </div>

          {loading && <p>Loading products...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard 
                key={p.id} 
                p={p} 
                onAddToCart={(productId) => handleAddToCart( productId)} 
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductsView;
