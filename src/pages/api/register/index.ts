import { NextApiRequest, NextApiResponse } from "next";
import { addData, RetrieveDataByField } from "@/lib/supabase/service";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  };

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ message: "Email harus menggunakan Gmail yang valid." });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan simbol.",
      });
    }

    const existing = await RetrieveDataByField("users", { email });
    if (existing.error) {
      console.error("Supabase error:", existing.error);
      return res.status(500).json({ message: "Gagal mengecek email" });
    }
    if (existing.data.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await addData("users", {
      name,
      email,
      password: hashPassword,
      role: "user",
    });

    if (user.error) {
      console.error("Supabase error:", user.error);
      return res.status(400).json({ message: user.error.message || "Gagal register user" });
    }

    return res.status(201).json({
      message: "Registrasi berhasil",
      data: user.data[0],
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan server",
      details: error.message,
    });
  }
}
