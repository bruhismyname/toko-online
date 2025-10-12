import { addData, deleteData } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // POST: Menambahkan alamat baru
  if (req.method === "POST") {
    try {
      const { user_id, street, city, province, postal_code } = req.body;

      // Validasi user_id
      if (user_id !== userId) {
        return res
          .status(403)
          .json({ message: "Tidak diizinkan menambah alamat untuk user lain" });
      }

      if (!street || !city || !province || !postal_code) {
        return res.status(400).json({ message: "Data alamat tidak lengkap" });
      }

      const result = await addData("addresses", {
        user_id,
        street,
        city,
        province,
        postal_code,
      });

      if (result.error) {
        console.error("Error adding address:", result.error);
        return res.status(500).json({ message: "Gagal menambahkan alamat" });
      }

      return res.status(201).json({
        message: "Alamat berhasil ditambahkan",
        data: result.data,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  // DELETE: Menghapus alamat berdasarkan ID
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: "ID alamat diperlukan" });
      }

      const result = await deleteData("addresses", { id });

      if (result.error) {
        console.error("Error deleting address:", result.error);
        return res.status(500).json({ message: "Gagal menghapus alamat" });
      }

      return res.status(200).json({
        message: "Alamat berhasil dihapus",
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

export default withAuth(handler);
