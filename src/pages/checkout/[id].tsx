import CheckoutViews from "@/components/views/checkout";
import { useRouter } from "next/router";

const CheckoutPage = () => {

  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  if (!id) return <p>Loading...</p>;


  return <CheckoutViews id={id as string} />;
}

export default CheckoutPage;