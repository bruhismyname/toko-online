import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, Search, Filter, Plus } from "lucide-react";

/** ------------ Mock data shaped like your DB ------------ */
type Category = { id: number; name: string };
type Product = {
  id: number;
  name: string;
  price: number;      // DECIMAL on DB -> number on FE
  stock: number;
  category_id: number;
  is_active: boolean;
  image_url: string;  // add this column later in DB
};

const CATEGORIES: Category[] = [
  { id: 1, name: "Running" },
  { id: 2, name: "Basketball" },
  { id: 3, name: "Lifestyle" },
  { id: 4, name: "Football" },
  { id: 5, name: "Training" },
  { id: 6, name: "Kids" },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "Nike Air Zoom Pegasus 41", price: 1899000, stock: 15, category_id: 1, is_active: true,  image_url: "/images/pegasus41.jpg" },
  { id: 2, name: "Adidas Ultraboost Light",  price: 2200000, stock: 12, category_id: 1, is_active: true,  image_url: "/images/ultraboost.jpg" },
  { id: 3, name: "Nike Air Force 1 '07",     price: 1599000, stock: 25, category_id: 3, is_active: true,  image_url: "/images/af1.jpg" },
  { id: 4, name: "Converse Chuck Taylor High",price: 899000,  stock: 30, category_id: 3, is_active: true,  image_url: "/images/converse.jpg" },
  { id: 5, name: "Nike KD16",                price: 2100000, stock: 8,  category_id: 2, is_active: true,  image_url: "/images/kd16.jpg" },
  { id: 6, name: "Air Jordan 1 Mid",         price: 2300000, stock: 10, category_id: 2, is_active: true,  image_url: "/images/jordan1.jpg" },
  { id: 7, name: "Puma Future Z 1.4",        price: 1800000, stock: 20, category_id: 4, is_active: true,  image_url: "/images/puma-future.jpg" },
  { id: 8, name: "Nike Mercurial Vapor 15",  price: 2400000, stock: 15, category_id: 4, is_active: false, image_url: "/images/mercurial.jpg" }, // hidden (inactive)
];

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

/** ------------ UI components ------------ */
const ProductCard = ({ p, categoryName }: { p: Product; categoryName: string }) => (
  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
    <div className="relative aspect-[4/3] bg-gray-50">
      <Image src={p.image_url} alt={p.name} fill className="object-cover" />
    </div>
    <div className="px-4 pb-4 pt-3">
      <p className="text-xs text-gray-500">{categoryName}</p>
      <h3 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900">{p.name}</h3>
      <p className="mt-2 text-lg font-bold text-gray-900">{currency(p.price)}</p>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/products/${p.id}`}
          className="flex-1 rounded-lg border border-gray-900 px-4 py-2 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
        >
          View
        </Link>
        <button
          className="rounded-lg bg-black px-3 py-2 text-white transition hover:bg-gray-800"
          aria-label="Add to cart"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
);

/** ------------ Page ------------ */
const ProductsPage = () => {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | "all">("all");
  const [sort, setSort] = useState<"Name A-Z" | "Name Z-A" | "Lowest Price" | "Highest Price">("Name A-Z");

  const catMap = useMemo(() => Object.fromEntries(CATEGORIES.map(c => [c.id, c.name])), []);

  const filtered = useMemo(() => {
    let data = PRODUCTS.filter(p => p.is_active); // hide inactive

    if (query.trim()) {
      const s = query.toLowerCase();
      data = data.filter(p => p.name.toLowerCase().includes(s));
    }
    if (categoryId !== "all") {
      data = data.filter(p => p.category_id === categoryId);
    }

    switch (sort) {
      case "Name Z-A":      data.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "Lowest Price":  data.sort((a, b) => a.price - b.price); break;
      case "Highest Price": data.sort((a, b) => b.price - a.price); break;
      default:              data.sort((a, b) => a.name.localeCompare(b.name));
    }
    return data;
  }, [query, categoryId, sort]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header (same vibe as Register page) */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Store className="h-6 w-6" />
            ShoeStore
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            <Link href="/" className="text-gray-600 hover:text-black">Home</Link>
            <Link href="/products" className="text-gray-900">Products</Link>
          </nav>
          <div className="flex gap-3 text-sm">
            <Link
              href="/auth/login"
              className="rounded-lg bg-white px-3 py-2 font-semibold text-gray-900 border border-gray-300 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-black px-3 py-2 font-semibold text-white hover:bg-gray-800"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-12">
        {/* Filters */}
        <aside className="md:col-span-4 lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Filter className="h-5 w-5 text-gray-900" /> Filter Shoes
            </h2>

            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shoes..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Category */}
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
                {CATEGORIES.map((c) => (
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

            {/* Sort */}
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

        {/* Products */}
        <section className="md:col-span-8 lg:col-span-9">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">All Shoes</h1>
            <p className="text-sm text-gray-600">Find your next pair: running, basketball, lifestyle, and more.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} categoryName={catMap[p.category_id]} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductsPage;
