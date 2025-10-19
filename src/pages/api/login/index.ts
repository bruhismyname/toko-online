import { RetrieveDataByField } from "@/lib/supabase/service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.log("jalan")
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, rememberMe = false } = req.body;
  console.log("Login attempt:", email, "RememberMe:", rememberMe);

  if (!email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  const data = await RetrieveDataByField("users", { email });
  if (data.error) {
    console.error("Supabase error:", data.error);
    return res.status(500).json({ message: "Terjadi kesalahan" });
  }

  if (data.data.length === 0) {
    return res.status(404).json({ message: "Email tidak ditemukan" });
  }

  const user = data.data[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Password salah" });
  }

  console.log(user)

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(rememberMe && { maxAge: 60 * 60 * 24 }), 
  };

  res.setHeader("Set-Cookie", serialize("token", token, cookieOptions));

  return res.status(200).json({ message: "Login berhasil" , role : user.role});
}
