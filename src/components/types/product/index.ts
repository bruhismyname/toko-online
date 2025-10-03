import Category from "../category";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  is_active: boolean;
  created_at: string;
  category_id?: number;
  image_url: string; 
  categories?: Category;
};

export default Product
