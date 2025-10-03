import Link from "next/link";
import Image from "next/image";
import { Store, ArrowRight } from "lucide-react";
import Logo from "@/components/common/Logo";

/** --- Mock data (DB-shaped) untuk showcase Converse --- */
type Category = { id: number; name: string; image_url: string };
type Product = {
  id: number;
  name: string;
  price: number;
  category_id: number;
  image_url: string;
};

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Classic Chuck",
    image_url:
      "https://www.converse.co.th/en/media/wysiwyg/MB_classic-chuck-category.jpg",
  },
  {
    id: 2,
    name: "Chuck 70",
    image_url: "https://www.converse.co.th/en/media/wysiwyg/DT_chuck-70.jpg",
  },
  {
    id: 3,
    name: "Slip-On & Sandal",
    image_url: "https://www.converse.id/media/catalog/category/slip-on_1.jpg",
  },
  {
    id: 4,
    name: "Skateboarding",
    image_url:
      "https://www.converse.id/media/catalog/category/Skateboarding_3.jpg",
  },
  {
    id: 5,
    name: "Basketball",
    image_url:
      "https://www.converse.id/media/catalog/category/Basketball_1.jpg",
  },
];

const FEATURED: Product[] = [
  {
    id: 101,
    name: "Chuck Taylor All Star Classic High Top",
    price: 799000,
    category_id: 1,
    image_url:
      "https://www.converse.id/media/catalog/product/cache/9f24855fac20eb8d4a46102f0f20e4a1/0/8/0888-CONA18926CDGN09H-1.jpg",
  },
  {
    id: 102,
    name: "Converse CONS Louie Lopez Pro",
    price: 999000,
    category_id: 2,
    image_url: "/images/cons-louie-lopez.jpg",
  },
  {
    id: 103,
    name: "Converse All Star BB Prototype CX",
    price: 1299000,
    category_id: 3,
    image_url: "/images/bb-prototype-cx.jpg",
  },
];

const catName = (id: number) =>
  CATEGORIES.find((c) => c.id === id)?.name ?? "-";
const currency = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

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
      <h3 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900">
        {p.name}
      </h3>
      <p className="mt-2 text-lg font-bold text-gray-900">
        {currency(p.price)}
      </p>
      <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
        View <ArrowRight className="h-4 w-4" />
      </span>
    </div>
  </Link>
);

const HomeView = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="border-b border-gray-200 bg-black text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              THE ICON THAT
              <br />
              <span className="underline decoration-white">
                NEVER STOPS EVOLVING
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-gray-300">
              Temukan koleksi sepatu Converse premium dari Chuck Taylor, Chuck
              70, hingga One Star dengan kualitas terbaik dan gaya klasik yang
              tak lekang oleh waktu.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-lg bg-white px-4 py-2 font-semibold text-black hover:bg-gray-200"
              >
                Belanja Sekarang
              </Link>
              <Link
                href="/products?sort=Highest%20Price"
                className="rounded-lg border border-gray-500 bg-transparent px-4 py-2 text-white hover:bg-gray-900"
              >
                Lihat Koleksi
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-lg">
              <video
                src="https://www.converse.id/media/CON_SHAI-001-LAUNCH_FamilyLaunch_15sec_16x9_250923_v01A_H264.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">KOLEKSI CONVERSE</h2>
          <p className="mt-2 text-gray-600">
            Temukan gaya yang sesuai dengan kepribadian Anda
          </p>
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
          <h2 className="text-xl font-bold text-gray-900">PRODUK UNGGULAN</h2>
          <Link
            href="/products"
            className="text-sm text-gray-700 hover:text-black"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* CONVERSE STORY */}
      <section className="bg-gray-100 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                KENAPA MEMILIH CONVERSE?
              </h2>
              <p className="mt-4 text-gray-600">
                Sejak 1908, Converse telah menjadi bagian dari budaya populer
                selama lebih dari 100 tahun. Dengan desain klasik dan kualitas
                yang tahan lama, sepatu Converse adalah pilihan sempurna untuk
                ekspresi gaya pribadi Anda.
              </p>
              <p className="mt-4 text-gray-600">
                Di Bakul Converse, kami menawarkan koleksi sepatu Converse
                terlengkap dengan harga terbaik dan kualitas yang terjamin.
              </p>
            </div>
            <div className="relative h-64 overflow-hidden rounded-xl bg-gray-200 md:h-80">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <Image
                  src="https://i.ytimg.com/vi/mFzWEf-biCM/maxresdefault.jpg"
                  alt="Converse History"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeView;
