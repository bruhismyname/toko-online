import { RetrieveDataByField, updateData } from "@/lib/supabase/service";
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

  // GET: Ambil data profil dan alamat
  if (req.method === "GET") {
    try {
      // Ambil data user
      const userData = await RetrieveDataByField("users", { id: userId });

      if (userData.error) {
        console.error("Error fetching user:", userData.error);
        return res.status(500).json({ message: "Gagal mengambil data profil" });
      }

      if (userData.data.length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      // Hilangkan password dari response
      const user = userData.data[0];
      const { password, ...userWithoutPassword } = user;

      // Ambil data alamat user
      const addressData = await RetrieveDataByField("addresses", {
        user_id: userId,
      });

      let addresses = [];
      if (!addressData.error && addressData.data.length > 0) {
        addresses = addressData.data;
      }

      return res.status(200).json({
        user: userWithoutPassword,
        addresses,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan" });
    }
  }

  // PUT: Update data profil
  if (req.method === "PUT") {
    try {
      const { name } = req.body;

      console.log("Updating user profile:", { userId, name });

      if (!name) {
        return res.status(400).json({ message: "Nama harus diisi" });
      }

      const result = await updateData("users", userId, { name });

      console.log("Update result:", result);

      if (result.error) {
        console.error("Error updating user:", result.error);
        return res.status(500).json({ message: "Gagal memperbarui profil" });
      }

      // Ambil data user yang sudah diupdate
      const userData = await RetrieveDataByField("users", { id: userId });

      if (userData.error || userData.data.length === 0) {
        return res
          .status(500)
          .json({ message: "Gagal mengambil data profil setelah update" });
      }

      const user = userData.data[0];
      const { password, ...userWithoutPassword } = user;

      return res.status(200).json({
        message: "Profil berhasil diperbarui",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({
        message: "Terjadi kesalahan server",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

// Menggunakan middleware withAuth untuk proteksi API
export default withAuth(handler);