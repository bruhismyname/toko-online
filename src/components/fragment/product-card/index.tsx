import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import Product from "@/components/types/product";

type ProductCardProps = {
  p: Product;
  onAddToCart?: (productId: number) => void; 
};

const ProductCard = ({ p, onAddToCart }: ProductCardProps) => {
  console.log(p);
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="relative aspect-[4/3] bg-gray-50">
        <Image
          src={p.image_url}
          alt={p.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="px-4 pb-4 pt-3">
        <p className="text-xs text-gray-500">{p.categories?.name}</p>
        <p className="text-xs text-gray-500">{p.id}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900">
          {p.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-gray-900">
          Rp {Number(p.price).toLocaleString("id-ID")}
        </p>

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
            onClick={() => onAddToCart?.(p.id)} 
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
