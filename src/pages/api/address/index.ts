import {
  addData,
  deleteData,
  RetrieveDataByField,
} from "@/lib/supabase/service";
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

  // GET: Mengambil alamat berdasarkan user_id
  if (req.method === "GET") {
    try {
      // Ambil user_id dari query parameter
      const { user_id } = req.query;

      // Konversi ID ke string untuk perbandingan yang konsisten
      const queryUserId = user_id ? String(user_id) : null;
      const currentUserId = String(userId);

      // Jika user_id diberikan, validasi bahwa user saat ini memiliki akses
      if (queryUserId && queryUserId !== currentUserId) {
        // Jika pengguna mencoba mengakses alamat pengguna lain dan bukan admin
        if (req.user.role !== "admin") {
          console.log("Permission denied:", {
            requestedId: queryUserId,
            currentUserId,
            role: req.user.role,
          });
          return res.status(403).json({
            message: "Tidak diizinkan mengakses alamat pengguna lain",
          });
        }
      }

      // Ambil alamat untuk user yang diminta atau user saat ini
      const targetUserId = queryUserId || currentUserId;

      console.log("Fetching addresses for user:", targetUserId);

      // Ambil data alamat
      const result = await RetrieveDataByField("addresses", {
        user_id: targetUserId,
      });

      if (result.error) {
        console.error("Error fetching addresses:", result.error);
        return res.status(500).json({ message: "Gagal mengambil data alamat" });
      }

      // Kembalikan data alamat
      return res.status(200).json({
        data: result.data || [],
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  // POST: Menambahkan alamat baru
  // POST: Menambahkan alamat baru
  if (req.method === "POST") {
    try {
      const { user_id, street, city, province, postal_code } = req.body;

      // Konversi user_id dan userId ke string untuk memastikan perbandingan konsisten
      const requestUserId = String(user_id);
      const currentUserId = String(userId);

      console.log("Adding address:", {
        requestUserId,
        currentUserId,
        isAdmin: req.user?.role === "admin",
      });

      // Validasi user_id - hanya jika admin yang menambahkan alamat untuk pengguna lain
      if (requestUserId !== currentUserId && req.user?.role !== "admin") {
        console.error("Permission denied when adding address:", {
          requestUserId,
          currentUserId,
          userRole: req.user?.role,
        });

        // Tambahkan fallback: jika user_id tidak valid, gunakan ID pengguna yang login
        // Ini lebih user-friendly daripada menolak request
        const correctedUserId = currentUserId;
        console.log("Using corrected user ID instead:", correctedUserId);

        // Lanjutkan dengan ID yang benar
        const result = await addData("addresses", {
          user_id: correctedUserId,
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
      }

      if (!street || !city || !province || !postal_code) {
        return res.status(400).json({ message: "Data alamat tidak lengkap" });
      }

      const result = await addData("addresses", {
        user_id: requestUserId, // Gunakan ID yang sudah dikonversi ke string
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
