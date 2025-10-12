import {
  addData,
  RetrieveDataByField,
  RetrieveDataWithJoin,
  updateData,
  deleteData,
} from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest & { user?: any },
  res: NextApiResponse
) {
  // Pastikan pengguna sudah login
  if (!req.user?.id) {
    return res
      .status(401)
      .json({ message: "Login diperlukan untuk mengakses keranjang" });
  }

  if (req.method === "GET") {
    let { id } = req.query;
    console.log("GET cart for user:", id);

    if (Array.isArray(id)) id = id[0];
    if (!id) return res.status(400).json({ message: "id is required" });

    const userId = parseInt(id as string, 10);
    if (isNaN(userId))
      return res.status(400).json({ message: "id must be a number" });

    try {
      const cartsRes = await RetrieveDataWithJoin(
        "carts",
        "cart_items",
        ["id", "user_id", "created_at"],
        ["id", "product_id", "stock_id", "qty", "products(*) , stocks(*)"],
        { user_id: userId }
      );

      if (cartsRes.error) throw cartsRes.error;

      const cartsWithImages = cartsRes.data.map((cart: any) => ({
        id: cart.id,
        user_id: cart.user_id,
        created_at: cart.created_at,
        cart_items: cart.cart_items.map((item: any) => ({
          id: item.id,
          qty: item.qty,
          product: item.products,
          stock: item.stocks,
          image: item.products.image_url,
        })),
      }));

      return res.status(200).json({ data: cartsWithImages });
    } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({ message: "Error fetching cart" });
    }
  } else if (req.method === "POST") {
    const { product_id, stock_id } = req.body;
    const user_id = req.user.id;

    console.log("Adding product to cart:", { user_id, product_id, stock_id });

    // Validasi input
    if (!product_id || !stock_id) {
      return res.status(400).json({ message: "Data produk tidak lengkap" });
    }

    try {
      // Validasi stok tersedia
      const stockResult = await RetrieveDataByField("stocks", { id: stock_id });
      if (stockResult.error) {
        console.error("Error checking stock:", stockResult.error);
        return res
          .status(500)
          .json({ message: "Gagal memeriksa ketersediaan stok" });
      }

      if (stockResult.data.length === 0) {
        return res
          .status(404)
          .json({ message: "Ukuran produk tidak ditemukan" });
      }

      const stock = stockResult.data[0];
      if (stock.quantity < 1) {
        return res.status(400).json({ message: "Stok produk tidak tersedia" });
      }

      // Cek apakah cart sudah ada
      const isCartExist = await RetrieveDataByField("carts", { user_id });
      if (isCartExist.error) {
        console.error("Error checking cart:", isCartExist.error);
        return res.status(500).json({ message: "Gagal memeriksa keranjang" });
      }

      let cartId: number;
      if (isCartExist.data.length > 0) {
        cartId = isCartExist.data[0].id;
      } else {
        const { data, error } = await addData("carts", { user_id });
        if (error) {
          console.error("Error creating cart:", error);
          return res
            .status(500)
            .json({ message: "Gagal membuat keranjang baru" });
        }
        cartId = data[0].id;
      }

      const { data: existingItem, error: itemError } =
        await RetrieveDataByField("cart_items", {
          cart_id: cartId,
          product_id,
          stock_id,
          status: "in_cart",
        });

      if (itemError) {
        console.error("Error checking cart items:", itemError);
        return res
          .status(500)
          .json({ message: "Gagal memeriksa item di keranjang" });
      }

      let result;
      if (existingItem.length > 0) {
        // Update quantity jika item sudah ada
        const item = existingItem[0];
        result = await updateData("cart_items", item.id, {
          qty: item.qty + 1,
        });

        if (result.error) {
          console.error("Error updating item qty:", result.error);
          return res
            .status(500)
            .json({ message: "Gagal menambah jumlah item di keranjang" });
        }
      } else {
        // Tambahkan item baru ke keranjang
        result = await addData("cart_items", {
          cart_id: cartId,
          product_id,
          stock_id,
          qty: 1,
        });

        if (result.error) {
          console.error("Error adding product to cart:", result.error);
          return res
            .status(500)
            .json({ message: "Gagal menambahkan produk ke keranjang" });
        }
      }

      return res.status(200).json({
        message: "Produk berhasil ditambahkan ke keranjang",
        data: result.data,
      });
    } catch (error) {
      console.error("Cart API error:", error);
      return res.status(500).json({
        message:
          "Terjadi kesalahan server saat menambahkan produk ke keranjang",
      });
    }
  }

  // Kode untuk PUT, DELETE dll yang sudah ada...
  else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

export default withAuth(handler, ["user", "admin"]);
