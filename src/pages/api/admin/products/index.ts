import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File as FormidableFile } from "formidable";
import fs from "fs";
import supabase from "@/lib/supabase/init";
import { addData, deleteData, updateData, uploadImage } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";

export const config = {
  api: {
    bodyParser: false, // penting supaya formidable bisa baca multipart
  },
};

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  // =======================
  // 🔹 GET: list / detail produk
  // =======================
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const query = supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          is_active,
          created_at,
          image_url,
          category:category_id ( id, name ),
          stocks ( id, size, quantity, created_at )
        `)
        .order("created_at", { ascending: false });

      if (id) query.eq("id", id);

      const { data, error } = await query;

      if (error) throw error;
      return res.status(200).json(data);
    } catch (error) {
      console.error("GET error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }


  else if (req.method === "POST") {
    try {
      const form = formidable({ multiples: false });

      form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ error: "Gagal parsing form data" });

        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name || "";
        const price = Array.isArray(fields.price) ? fields.price[0] : fields.price || "";
        const category_id = Array.isArray(fields.category_id)
          ? fields.category_id[0]
          : fields.category_id || "";
        const stocksRaw = Array.isArray(fields.stocks) ? fields.stocks[0] : fields.stocks || "[]";
        const stocks = JSON.parse(stocksRaw);

        const file = (Array.isArray(files.image) ? files.image[0] : files.image) as FormidableFile;

        if (!file) return res.status(400).json({ error: "File gambar tidak ditemukan" });

        const buffer = fs.readFileSync(file.filepath);
        const fileName = file.originalFilename || `product-${Date.now()}.png`;
        const mimeType = file.mimetype || "image/png";

        const { publicUrl } = await uploadImage(
          buffer,
          "product-images",
          `${name}-${Date.now()}`,
          mimeType
        );

        const { data: productData, error: productError } = await addData("products", {
          name,
          price: parseFloat(price),
          category_id,
          image_url: publicUrl,
        });

        if (productError) throw productError;

        const productId = productData[0].id;

        const { error: stockError } = await addData(
          "stocks",
          stocks.map((s: { size: string; quantity: string }) => ({
            product_id: productId,
            size: s.size,
            quantity: parseInt(s.quantity, 10),
          }))
        );

        if (stockError) throw stockError;

        return res.status(200).json({ message: "Produk berhasil ditambahkan" });
      });
    } catch (error) {
      console.error("POST error:", error);
      return res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }

  
  else if (req.method === "PUT") {
    const { id } = req.query;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    console.log(id)

    try {
      const form = formidable({ multiples: false });
      console.log(form)

      form.parse(req, async (err, fields, files) => {
        console.log(fields)
        if (err) return res.status(500).json({ error: "Gagal parsing form data" });

        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name || "";
        const price = Array.isArray(fields.price) ? fields.price[0] : fields.price || "";
        const category_id = Array.isArray(fields.category_id)
          ? fields.category_id[0]
          : fields.category_id || "";
        const stocksRaw = Array.isArray(fields.stocks) ? fields.stocks[0] : fields.stocks || "[]";
        const stocks = JSON.parse(stocksRaw);

        console.log(name, price, category_id, stocks)

        const file = (Array.isArray(files.image) ? files.image[0] : files.image) as
          | FormidableFile
          | undefined;

          console.log(file)

        let imageUrl: string | undefined;

        if (file) {
          console.log("jalan")
          const buffer = fs.readFileSync(file.filepath);
          const fileName = file.originalFilename || `product-${Date.now()}.png`;
          const mimeType = file.mimetype || "image/png";

          const { publicUrl } = await uploadImage(
            buffer,
            "product-images",
            `${name}-${Date.now()}`,
            mimeType
          );

          imageUrl = publicUrl;
          console.log(imageUrl)
        } else {
          console.log("jalan")
          const { data: old } = await supabase
            .from("products")
            .select("image_url")
            .eq("id", id)
            .single();

          imageUrl = old?.image_url || "";
        }

        const { error: productError } = await updateData("products", id, {
          name,
          price: parseFloat(price),
          category_id,
          image_url: imageUrl,
        });

        console.log(productError)

        if (productError) throw productError;

        await supabase.from("stocks").delete().eq("product_id", id);

        const { error: stockError } = await addData(
          "stocks",
          stocks.map((s: { size: string; quantity: string }) => ({
            product_id: id,
            size: s.size,
            quantity: parseInt(s.quantity, 10),
          }))
        );

        console.log(stockError)

        if (stockError) throw stockError;

        return res.status(200).json({ message: "Produk berhasil diperbarui" });
      });
    } catch (error) {
      console.error("PUT error:", error);
      return res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "ID produk tidak valid" });
    }

    try {
      const { error: productError } = await deleteData("products", id);

      if (productError) throw productError;

      return res.status(200).json({ message: "Produk berhasil dihapus" });
    } catch (error) {
      console.error("DELETE error:", error);
      return res.status(500).json({ error: "Terjadi kesalahan server" });
    }
  }
  else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default withAuth(handler, ["admin"]);
