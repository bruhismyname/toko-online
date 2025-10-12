import { deleteData, RetrieveDataByField } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  const userId = req.user?.id;
  const { id } = req.query; // Next.js mengambil ID dari URL path

  console.log("Handling DELETE request for address:", { id, userId });

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Hanya menangani metode DELETE
  if (req.method === "DELETE") {
    try {
      // Validasi format ID
      if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: "ID alamat tidak valid" });
      }

      // Pastikan alamat milik user yang sedang login
      const addressData = await RetrieveDataByField("addresses", { id });

      if (addressData.error) {
        console.error("Error fetching address:", addressData.error);
        return res.status(500).json({ message: "Gagal memeriksa alamat" });
      }

      if (addressData.data.length === 0) {
        return res.status(404).json({ message: "Alamat tidak ditemukan" });
      }

      // Delete alamat
      console.log("Deleting address with ID:", id);
      const result = await deleteData("addresses", id);

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
