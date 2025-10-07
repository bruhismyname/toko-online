import { addData, RetrieveDataByField, RetrieveDataWithJoin, updateData, deleteData } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  if (req.method === "GET") {
    let { id } = req.query;
    console.log(id);
    if (Array.isArray(id)) id = id[0];
    if (!id) return res.status(400).json({ message: "id is required" });

    const userId = parseInt(id as string, 10);
    if (isNaN(userId)) return res.status(400).json({ message: "id must be a number" });

    console.log(userId)

    try {
      const cartsRes = await RetrieveDataWithJoin(
        "carts",
        "cart_items",
        ["id", "user_id", "created_at"],
        ["id", "product_id", "stock_id" ,"qty", "products(*) , stocks(*)"], 
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
          image: item.products.image_url 
        })),
      }));

      console.log(cartsWithImages);

      return res.status(200).json({ data: cartsWithImages });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching cart" });
    }
  }

  else if (req.method === "POST") {
    const { product_id , stock_id } = req.body;
    const user_id = req.user.id;

    const isCartExist = await RetrieveDataByField("carts", { user_id });
    if (isCartExist.error) return res.status(500).json({ message: "Error checking cart" });

    let cartId: number;
    if (isCartExist.data.length > 0) {
      cartId = isCartExist.data[0].id;
    } else {
      const { data, error } = await addData("carts", { user_id });
      if (error) return res.status(500).json({ message: "Error creating cart" });
      cartId = data[0].id;
    }

    const { data: existingItem, error: itemError } = await RetrieveDataByField("cart_items", {
      cart_id: cartId,
      product_id,
      stock_id
    });
    if (itemError) return res.status(500).json({ message: "Error checking cart items" });

    if (existingItem.length > 0) {
      const item = existingItem[0];
      const { error: updateError } = await updateData("cart_items", item.id, {
        qty: item.qty + 1,
      });
      if (updateError) return res.status(500).json({ message: "Error updating item qty" });
    } else {
      const { error: addError } = await addData("cart_items", {
        cart_id: cartId,
        product_id,
        stock_id,
        qty: 1,
      });
      if (addError) return res.status(500).json({ message: "Error adding product to cart" });
    }

    return res.status(200).json({ message: "Success adding to cart" });
  }

  else if (req.method === "PUT") {
    const { cart_id, product_id, stock_id, action } = req.body;

    const { data: existingItem, error: itemError } = await RetrieveDataByField("cart_items", {
      cart_id,
      product_id,
      stock_id
    });
    if (itemError) return res.status(500).json({ message: "Error checking cart items" });
    if (existingItem.length === 0) return res.status(404).json({ message: "Item not found in cart" });

    const item = existingItem[0];

    if (action === "increase") {
      await updateData("cart_items", item.id, { qty: item.qty + 1 });
    } else if (action === "decrease") {
      if (item.qty > 1) {
        await updateData("cart_items", item.id, { qty: item.qty - 1 });
      } else {
        await deleteData("cart_items", item.id);
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    const cartsRes = await RetrieveDataWithJoin(
      "carts",
      "cart_items",
      ["id", "user_id", "created_at"],
      ["id", "product_id", "stock_id", "qty", "products(*), stocks(*)"],
      { id: cart_id }
    );
    if (cartsRes.error) return res.status(500).json({ message: "Error fetching updated cart" });

    const cartsWithImages = cartsRes.data.map((cart: any) => ({
      id: cart.id,
        user_id: cart.user_id,
        created_at: cart.created_at,
        cart_items: cart.cart_items.map((item: any) => ({
          id: item.id,
          qty: item.qty,
          product: item.products,
          stock: item.stocks,
          image: item.products.image_url || "",
      })),
    }));

    return res.status(200).json({ message: "Success updating item qty", data: cartsWithImages });
  }

  // ✅ Delete item
  else if (req.method === "DELETE") {
    const { cart_id, product_id , stock_id } = req.body;

    const { data: existingItem, error: itemError } = await RetrieveDataByField("cart_items", {
      cart_id,
      product_id,
      stock_id
    });
    if (itemError) return res.status(500).json({ message: "Error checking cart items" });
    if (existingItem.length === 0) return res.status(404).json({ message: "Item not found in cart" });

    const item = existingItem[0];
    const { error: deleteError } = await deleteData("cart_items", item.id);
    if (deleteError) return res.status(500).json({ message: "Error deleting item" });

    const cartsRes = await RetrieveDataWithJoin(
      "carts",
      "cart_items",
      ["id", "user_id", "created_at"],
      ["id", "product_id",  "stock_id", "qty", "products(*) , stocks(*)"],
      { id: cart_id }
    );
    if (cartsRes.error) return res.status(500).json({ message: "Error fetching updated cart" });

    const cartsWithImages = cartsRes.data.map((cart: any) => ({
      id: cart.id,
        user_id: cart.user_id,
        created_at: cart.created_at,
        cart_items: cart.cart_items.map((item: any) => ({
          id: item.id,
          qty: item.qty,
          product: item.products,
          stock: item.stocks,
          image: item.products.image_url 
      })),
    }));

    return res.status(200).json({ message: "Success deleting item", data: cartsWithImages });
  }

  else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

export default withAuth(handler, ["user", "admin"]);
