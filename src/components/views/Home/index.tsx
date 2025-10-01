import Link from "next/link";
import Image from "next/image";
import { Store, ArrowRight } from "lucide-react";

/** --- Mock data (DB-shaped) just for the landing showcase --- */
type Category = { id: number; name: string; image_url: string };
type Product = {
  id: number;
  name: string;
  price: number;
  category_id: number;
  image_url: string;
};

const CATEGORIES: Category[] = [
  { id: 1, name: "Running",    image_url: "/images/cat-running.jpg" },
  { id: 2, name: "Basketball", image_url: "/images/cat-basketball.jpg" },
  { id: 3, name: "Lifestyle",  image_url: "/images/cat-lifestyle.jpg" },
];

const FEATURED: Product[] = [
  { id: 101, name: "Nike Air Zoom Pegasus 41", price: 1899000, category_id: 1, image_url: "/images/pegasus41.jpg" },
  { id: 102, name: "Nike KD16",                price: 2100000, category_id: 2, image_url: "/images/kd16.jpg" },
  { id: 103, name: "Nike Air Force 1 '07",     price: 1599000, category_id: 3, image_url: "/images/af1.jpg" },
];

const catName = (id: number) => CATEGORIES.find(c => c.id === id)?.name ?? "-";
const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

/** --- Minimal product card (Category · Name · Price) --- */
const ProductCard = ({ p }: { p: Product }) => (
  <Link
    href={`/products/${p.id}`}
    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition hover:shadow-xl"
  >
    <div className="relative aspect-[4/3] bg-gray-50">
      <Image src={p.image_url} alt={p.name} fill className="object-cover" />
    </div>
    <div className="px-4 pb-4 pt-3">
      <p className="text-xs text-gray-500">{catName(p.category_id)}</p>
      <h3 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900">{p.name}</h3>
      <p className="mt-2 text-lg font-bold text-gray-900">{currency(p.price)}</p>
      <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
        View <ArrowRight className="h-4 w-4" />
      </span>
    </div>
  </Link>
);

const HomePage = () => {
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
            <Link href="/" className="text-gray-900">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-black">Products</Link>
          </nav>

          <div className="flex gap-3 text-sm">
            <Link
              href="/auth/login"
              className="rounded-lg bg-black px-3 py-2 font-semibold text-white hover:bg-gray-800"
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

      {/* HERO */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              Shoes that go the distance.<br />
              <span className="underline decoration-black">Style that comes closer.</span>
            </h1>
            <p className="mt-4 max-w-xl text-gray-600">
              Premium running, basketball, and lifestyle sneakers. Lightweight materials, responsive cushioning,
              modern and minimal look.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-lg bg-black px-4 py-2 font-semibold text-white hover:bg-gray-800"
              >
                Shop now
              </Link>
              <Link
                href="/products?sort=Highest%20Price"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-100"
              >
                Explore collection
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-lg">
              <Image
                src="/images/hero-shoe.jpg"
                alt="Featured shoe"
                width={900}
                height={700}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
          <Link href="/products" className="text-sm text-gray-700 hover:text-black">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/products?category_id=${c.id}`}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={c.image_url}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-semibold text-gray-900">{c.name}</span>
                <ArrowRight className="h-4 w-4 text-gray-900" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Featured</h2>
          <Link href="/products" className="text-sm text-gray-700 hover:text-black">
            See more
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-gray-600 md:flex-row">
          <p>© {new Date().getFullYear()} ShoeStore. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-black">Privacy</Link>
            <Link href="/terms" className="hover:text-black">Terms</Link>
            <Link href="/contact" className="hover:text-black">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
