import { useRouter } from "next/router";
import DetailProductView from "@/components/views/product";

const DetailProductPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  return <DetailProductView id={id as string} />;
};

export default DetailProductPage;
