import supabase from "@/lib/supabase/init";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Mengambil 3 produk dengan harga tertinggi sebagai produk unggulan
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, category_id, image_url, stock")
        .eq("is_active", true)
        .order("price", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Supabase error:", error);
        return res
          .status(500)
          .json({ message: "Terjadi kesalahan saat mengambil data" });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
