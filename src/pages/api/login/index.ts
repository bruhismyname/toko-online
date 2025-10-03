import { RetrieveDataByField } from "@/lib/supabase/service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req : NextApiRequest, res : NextApiResponse){
    if(req.method !== "POST"){
        return res.status(405).json({ message: "Method not allowed" });
    } else {
        const { email, password } = req.body;
        console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({ message: "Semua field wajib diisi" });
        } else {
            const data = await RetrieveDataByField("users", { email });
            console.log(data)
            if (data.error) {
                console.error("Supabase error:", data.error);
                return res.status(500).json({ message: "Terjadi kesalahan" });
            }
            if (data.data.length > 0) {
                const user = data.data[0];

                console.log(user) 

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Password salah" });
                } else {
                    const token = jwt.sign({ id: user.id , role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
                    res.setHeader(
                        "Set-Cookie",
                        serialize("token", token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                            maxAge: 60 * 60 * 24,
                            path: "/",
                        })
                    )
                }

                return res.status(200).json( { message: "Login berhasil" });
            } else {
                return res.status(404).json({ message: "Email tidak ditemukan" });
            }
        }
    }
}