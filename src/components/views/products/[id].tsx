import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Store, ArrowLeft, ArrowRight, Plus, Minus } from "lucide-react";
import { useState } from "react";

/** ---- Mock data (DB-shaped) ---- */
type Category = { id: number; name: string };
type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category_id: number;
  image_url: string;
  is_active: boolean;
  description?: string;
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
  { id: 101, name: "Nike Air Zoom Pegasus 41", price: 1899000, stock: 15, category_id: 1, is_active: true,  image_url: "/images/pegasus41.jpg", description: "Lightweight daily trainer with responsive cushioning for long miles." },
  { id: 102, name: "Nike KD16",                price: 2100000, stock: 8,  category_id: 2, is_active: true,  image_url: "/images/kd16.jpg",       description: "Court-ready agility and cushioning for explosive play." },
  { id: 103, name: "Nike Air Force 1 '07",     price: 1599000, stock: 25, category_id: 3, is_active: true,  image_url: "/images/af1.jpg",       description: "Iconic lifestyle sneaker with clean, timeless style." },
  { id: 104, name: "Converse Chuck Taylor High", price: 899000, stock: 30, category_id: 3, is_active: true, image_url: "/images/converse.jpg",  description: "Classic high-top canvas with modern comfort tweaks." },
];

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

/** ---- Page ---- */
const ProductDetailPage = () => {
  const router = useRouter();
  const idParam = router.query.id as string | undefined;

  const product = useMemo(() => {
    const idNum = idParam ? Number(idParam) : NaN;
    return PRODUCTS.find(p => p.id === idNum);
  }, [idParam]);

  const categoryName = useMemo(() => {
    if (!product) return "-";
    const cat = CATEGORIES.find(c => c.id === product.category_id);
    return cat ? cat.name : "-";
  }, [product]);

  const [qty, setQty] = useState(1);

  if (!product || !product.is_active) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Store className="h-6 w-6" />
              ShoeStore
            </Link>
            <nav className="hidden gap-6 text-sm md:flex">
              <Link href="/" className="text-gray-600 hover:text-black">Home</Link>
              <Link href="/products" className="text-gray-600 hover:text-black">Products</Link>
            </nav>
            <div className="flex gap-3 text-sm">
              <Link href="/auth/login" className="rounded-lg bg-black px-3 py-2 font-semibold text-white hover:bg-gray-800">Login</Link>
              <Link href="/auth/register" className="rounded-lg bg-black px-3 py-2 font-semibold text-white hover:bg-gray-800">Register</Link>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
            <p className="text-lg font-semibold text-gray-900">Product not found</p>
            <p className="mt-2 text-gray-600">It may be unavailable or inactive.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/products" className="rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white">
                Back to Products
              </Link>
              <Link href="/" className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Store className="h-6 w-6" />
            ShoeStore
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            <Link href="/" className="text-gray-600 hover:text-black">Home</Link>
            <Link href="/products" className="text-gray-600 hover:text-black">Products</Link>
          </nav>
          <div className="flex gap-3 text-sm">
            <Link href="/auth/login" className="rounded-lg bg-black px-3 py-2 font-semibold text-white hover:bg-gray-800">Login</Link>
            <Link href="/auth/register" className="rounded-lg bg-black px-3 py-2 font-semibold text-white hover:bg-gray-800">Register</Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb / Back */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
          <div className="text-sm text-gray-600">
            Home <span className="mx-1">/</span> Products <span className="mx-1">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Image */}
          <div className="md:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
              <div className="relative aspect-[4/3] bg-gray-50">
                <Image src={product.image_url} alt={product.name} fill className="object-cover" priority />
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="md:col-span-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <p className="text-xs text-gray-500">{categoryName}</p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="mt-3 text-xl font-extrabold text-gray-900">{currency(product.price)}</p>

              {/* Optional description */}
              {product.description && (
                <p className="mt-4 text-sm leading-relaxed text-gray-600">{product.description}</p>
              )}

              {/* Qty + Actions */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(99, q + 1))}
                    className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button className="rounded-lg bg-black px-4 py-2 font-semibold text-white hover:bg-gray-800">
                  Add to Cart
                </button>
                <button className="rounded-lg border border-gray-900 px-4 py-2 font-semibold text-gray-900 hover:bg-gray-900 hover:text-white">
                  Buy Now
                </button>
              </div>

              {/* Meta (stock/info) — optional, subtle */}
              <div className="mt-4 text-sm text-gray-600">
                In stock: <span className="font-semibold text-gray-900">{product.stock}</span>
              </div>
            </div>

            {/* Simple “You may also like” */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">You may also like</h3>
                <Link href="/products" className="text-sm text-gray-700 hover:text-black inline-flex items-center gap-1">
                  Browse all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {PRODUCTS.filter(p => p.category_id === product.category_id && p.id !== product.id)
                  .slice(0, 2)
                  .map((rec) => (
                  <Link key={rec.id} href={`/products/${rec.id}`} className="group overflow-hidden rounded-xl border border-gray-200">
                    <div className="relative aspect-[16/10] bg-gray-50">
                      <Image src={rec.image_url} alt={rec.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="px-3 pb-3 pt-2">
                      <p className="text-xs text-gray-500">{CATEGORIES.find(c => c.id === rec.category_id)?.name}</p>
                      <p className="line-clamp-1 text-sm font-semibold text-gray-900">{rec.name}</p>
                      <p className="text-sm font-bold text-gray-900">{currency(rec.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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

export default ProductDetailPage;
