import Link from "next/link";
import Image from "next/image";
import { Store, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/fragment/navbar";
import ProductCard from "@/components/fragment/product-card";

const HomePage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const getAllProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.slice(0, 5)); // ambil 5 produk saja
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const getAllCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.slice(0, 3)); // ambil 3 kategori saja
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: scrollRef.current.clientWidth,
          behavior: "smooth",
        });
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [products]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <Navbar />

      {/* HERO */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              Shoes that go the distance.
              <br />
              <span className="underline decoration-black">Style that comes closer.</span>
            </h1>
            <p className="mt-4 max-w-xl text-gray-600">
              Premium running, basketball, and lifestyle sneakers. Lightweight materials,
              responsive cushioning, modern and minimal look.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="rounded-lg bg-black px-4 py-2 font-semibold text-white hover:bg-gray-800">Shop now</Link>
              <Link href="/products?sort=Highest%20Price" className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-100">Explore collection</Link>
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
          <Link href="/products" className="text-sm text-gray-700 hover:text-black">View all</Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.id} href={`/products?category_id=${c.id}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
              <div className="relative aspect-[16/10]">
                <Image
                  src={c.image_url || "/images/placeholder.jpg"}
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

      {/* FEATURED PRODUCTS CAROUSEL */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Featured</h2>
          <Link href="/products" className="text-sm text-gray-700 hover:text-black">See more</Link>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
        >
          {products.map((p) => (
            <div key={p.id} className="snap-start min-w-[300px] sm:min-w-[350px]">
              <ProductCard p={p} />
            </div>
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
