import { RetrieveData } from "@/lib/supabase/service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler (req : NextApiRequest , res : NextApiResponse){
    if (req.method === "GET"){
        const {data,error} = await RetrieveData("categories");
        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ message: "Terjadi kesalahan" });
        }
        return res.status(200).json(data);
    }
}