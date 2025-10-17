import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File as FormidableFile } from "formidable";
import fs from "fs";
import supabase from "@/lib/supabase/init";
import { addData, uploadImage } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";

export const config = {
  api: {
    bodyParser: false, 
  },
};

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  if (req.method === "GET") {
    console.log("Admin API accessed: /api/admin/products");

    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          is_active,
          created_at,
          image_url,
          category:category_id (
            id,
            name
          ),
          stocks (
            id,
            size,
            quantity,
            created_at
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ message: "Internal Server Error", error });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "POST"){
    try {
      const form = formidable({ multiples: false }); // hanya 1 file
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err);
          return res.status(500).json({ error: "Gagal parsing form data" });
        }

        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name || "";
        const price = Array.isArray(fields.price) ? fields.price[0] : fields.price || "";
        const category_id = Array.isArray(fields.category_id) ? fields.category_id[0] : fields.category_id || "";
        const stocksRaw = Array.isArray(fields.stocks) ? fields.stocks[0] : fields.stocks || "[]";

        const stocks = JSON.parse(stocksRaw);


        const file = (Array.isArray(files.image) ? files.image[0] : files.image) as FormidableFile;

        if (!file) {
          return res.status(400).json({ error: "File gambar tidak ditemukan" });
        }

        console.log("Received fields:", { name, price, category_id, stocks });
        console.log("Received file:", file);

        const filePath = file.filepath;
        const buffer = fs.readFileSync(filePath);
        const fileName = file.originalFilename || `product-${Date.now()}.png`;
        const mimeType = file.mimetype || "image/png";

        const storagePath = `products/${Date.now()}-${fileName}`;
        const { publicUrl } = await uploadImage(
        buffer,
        "product-images",
        `${name}-${Date.now()}`,
        mimeType
        );

        const imageUrl = publicUrl;
        console.log("Image uploaded to:", imageUrl);


        const { data: productData, error: productError } = await addData("products", {
          name,
          price: parseFloat(price),
          category_id,
          image_url: imageUrl,
        });

        if (productError) {
          console.error("Error adding product:", productError);
          return res.status(500).json({ error: "Gagal menambahkan produk" });
        }

        const productId = productData[0].id;
        console.log("Product added with ID:", productId);

        const {data : stockData, error: stockError} = await addData("stocks", stocks.map((s: { size: string; quantity: string }) => ({
          product_id: productId,
          size: s.size,
          quantity: parseInt(s.quantity, 10),
        })));

        if (stockError) {
          console.error("Error adding stock:", stockError);
          return res.status(500).json({ error: "Gagal menambahkan stock" });
        }

        return res.status(200).json({
          message: "Produk dan stok berhasil ditambahkan",
          image_url: imageUrl,
        });
      });
    } catch (error) {
      console.error("POST error:", error);
      return res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default withAuth(handler, ["admin", "user"]);
