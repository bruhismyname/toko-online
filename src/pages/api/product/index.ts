import { NextApiRequest, NextApiResponse } from "next";
import { RetrieveDataWithJoin } from "@/lib/supabase/service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query;

    const productId = Array.isArray(id) ? id[0] : id;

    if (!productId) {
      return res.status(400).json({ message: "ID produk harus disertakan." });
    }

    const { data, error } = await RetrieveDataWithJoin(
      "products", 
      "stocks",   
      [
        "id",
        "name",
        "price",
        "is_active",
        "image_url",
        "created_at",
        "categories(id, name)" 
      ],
      ["id", "size", "quantity", "created_at"], 
      { id: productId }
    );

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan mengambil data produk." });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan." });
    }

    const product = data[0];

    console.log(product)

    return res.status(200).json({ product });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
