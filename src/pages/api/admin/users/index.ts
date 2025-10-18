import { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/utils/withAuth";
import { RetrieveData, updateData, deleteData } from "@/lib/supabase/service";

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  if (req.method === "GET") {
    // Ambil semua user
    console.log("API accessed: /api/admin/users");

    const { data, error } = await RetrieveData("users");
    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data" });
    }

    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    const { userId } = req.query;
    const { role } = req.body;

    console.log("API accessed: /api/admin/users");
    console.log(userId, role);

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const { data, error } = await updateData("users", userId.toString(), { role });
    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ message: "Gagal memperbarui role user" });
    }

    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { userId } = req.query;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const { data, error } = await deleteData("users", userId.toString());
    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ message: "Gagal menghapus user" });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ message: "Method not allowed" });
}

export default withAuth(handler, ["admin"]);
