import supabase from "@/lib/supabase/init";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, stock, is_active, created_at, categories (id, name), image_url");

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ message: "Terjadi kesalahan" });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
