import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Product from "@/components/types/product";

const currency = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

type ProductCardProps = {
  p: Product;
};

const ProductCard = ({ p }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${p.id}`}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition hover:shadow-xl"
    >
      {/* Gambar Produk */}
      <div className="relative aspect-[4/3] bg-gray-50">
        <Image
          src={p.image_url}
          alt={p.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Konten Produk */}
      <div className="px-4 pb-4 pt-3">
        <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
          {p.name}
        </h3>

        <p className="mt-2 text-lg font-bold text-gray-900">
          {currency(Number(p.price))}
        </p>

        <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
          View <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
