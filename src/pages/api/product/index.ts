import supabase from "@/lib/supabase/init";
import { RetrieveDataById } from "@/lib/supabase/service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler (req : NextApiRequest , res : NextApiResponse){
    if (req.method === "GET"){
        const { id } = req.query;
        const { data, error } = await supabase
            .from("products")
            .select("id, name, price, stock, is_active, created_at, categories (id, name)")
            .eq("id", id)   
            .single();      
        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ message: "Terjadi kesalahan" });
        }
        if (!data ) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }
        return res.status(200).json(data);
    }
}