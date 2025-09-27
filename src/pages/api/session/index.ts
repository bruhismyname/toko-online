import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const SECRET = process.env.JWT_SECRET

export default async function handler (req : NextApiRequest, res : NextApiResponse){
    console.log("jalan")
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });  

    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    } else {
        try {
            const decoded = jwt.verify(token, SECRET!);
            return res.status(200).json({ user : decoded });
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    }

}