import { useEffect, useState } from "react";

type ProductViewProps = {
  id: string;
};

const DetailProductView = ({ id }: ProductViewProps) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/product?id=${id}`);
        if (!res.ok) {
          const errData = await res.json();
          console.log(errData.message);
          throw new Error( "Failed to fetch product");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  console.log(product)

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-600">{product.categories?.name}</p>
      <p className="text-gray-600">{product.stock}</p>
      <p className="text-blue-600 font-bold">Rp {product.price}</p>
    </div>
  );
};

export default DetailProductView;
