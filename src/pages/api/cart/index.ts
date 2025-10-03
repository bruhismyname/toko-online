import { addData, RetrieveDataByField, RetrieveDataWithJoin, updateData, deleteData } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  if (req.method === "GET") {
    let { id } = req.query;
    if (Array.isArray(id)) id = id[0];
    if (!id) return res.status(400).json({ message: "id is required" });

    const userId = parseInt(id as string, 10);
    if (isNaN(userId)) return res.status(400).json({ message: "id must be a number" });

    try {
      const cartsRes = await RetrieveDataWithJoin(
        "carts",
        "cart_items",
        ["id", "user_id", "created_at"],
        ["id", "product_id", "qty", "products(*)"],
        { user_id: userId }
      );

      if (cartsRes.error) throw cartsRes.error;

      const cartsWithImages = await Promise.all(
        cartsRes.data.map(async (cart: any) => {
          const itemsWithImages = await Promise.all(
            cart.cart_items.map(async (item: any) => {
              const imageRes = await RetrieveDataByField("product_images", {
                product_id: item.product_id,
                isPriority: true,
              });

              const image = imageRes.data.length > 0 ? imageRes.data[0].image_url : "";

              return {
                id: item.id,
                qty: item.qty,
                product: item.products,
                image,
              };
            })
          );

          return {
            id: cart.id,
            user_id: cart.user_id,
            created_at: cart.created_at,
            cart_items: itemsWithImages,
          };
        })
      );

      return res.status(200).json({ data: cartsWithImages });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching cart" });
    }
  } else if (req.method === "POST") {
    const { product_id } = req.body;
    const user_id = req.user.id;

    const isCartExist = await RetrieveDataByField("carts", { user_id });

    if (isCartExist.error) {
      return res.status(500).json({ message: "Error checking cart" });
    }

    let cartId: number;

    if (isCartExist.data.length > 0) {
      cartId = isCartExist.data[0].id;
    } else {
      const { data, error } = await addData("carts", { user_id });
      if (error) {
        return res.status(500).json({ message: "Error creating cart" });
      }
      cartId = data[0].id;
    }

    const { data: existingItem, error: itemError } = await RetrieveDataByField("cart_items", {
      cart_id: cartId,
      product_id,
    });

    if (itemError) {
      return res.status(500).json({ message: "Error checking cart items" });
    }

    if (existingItem.length > 0) {
      const item = existingItem[0];
      const { error: updateError } = await updateData("cart_items", item.id, {
        qty: item.qty + 1,
      });

      if (updateError) {
        return res.status(500).json({ message: "Error updating item qty" });
      }
    } else {
      const { error: addError } = await addData("cart_items", {
        cart_id: cartId,
        product_id,
        qty: 1,
      });

      if (addError) {
        return res.status(500).json({ message: "Error adding product to cart" });
      }
    }

    return res.status(200).json({ message: "Success adding to cart" });
  } else if (req.method === "PUT") {
    console.log(req.body);

    if (req.body.action === "increase") {
      const { cart_id, product_id } = req.body;
      const { data: existingItem, error: itemError } = await RetrieveDataByField("cart_items", {
        cart_id,
        product_id,
      });

      if (itemError) {
        return res.status(500).json({ message: "Error checking cart items" });
      }

      if (existingItem.length > 0) {
        const item = existingItem[0];
        const { error: updateError } = await updateData("cart_items", item.id, {
          qty: item.qty + 1,
        });

        if (updateError) {
          return res.status(500).json({ message: "Error updating item qty" });
        }

        const cartsRes = await RetrieveDataWithJoin(
          "carts",
          "cart_items",
          ["id", "user_id", "created_at"],
          ["id", "product_id", "qty", "products(*)"],
          { id: cart_id }
        );

        if (cartsRes.error) {
          return res.status(500).json({ message: "Error fetching updated cart" });
        }

        const cartsWithImages = await Promise.all(
          cartsRes.data.map(async (cart: any) => {
            const itemsWithImages = await Promise.all(
              cart.cart_items.map(async (item: any) => {
                const imageRes = await RetrieveDataByField("product_images", {
                  product_id: item.product_id,
                  isPriority: true,
                });
                const image = imageRes.data.length > 0 ? imageRes.data[0].image_url : "";
                return {
                  id: item.id,
                  qty: item.qty,
                  product: item.products,
                  image,
                };
              })
            );

            return {
              id: cart.id,
              user_id: cart.user_id,
              created_at: cart.created_at,
              cart_items: itemsWithImages,
            };
          })
        );

        return res.status(200).json({ message: "Success updating item qty", data: cartsWithImages });
      } else {
        return res.status(404).json({ message: "Item not found in cart" });
      }
    } else if (req.body.action === "decrease") {
      const { cart_id, product_id } = req.body;
      const { data: existingItem, error: itemError } = await RetrieveDataByField("cart_items", {
        cart_id,
        product_id,
      });

      if (itemError) {
        return res.status(500).json({ message: "Error checking cart items" });
      }

      if (existingItem.length > 0) {
        const item = existingItem[0];
        if (item.qty > 1) {
          const { error: updateError } = await updateData("cart_items", item.id, {
            qty: item.qty - 1,
          });

          if (updateError) {
            return res.status(500).json({ message: "Error updating item qty" });
          }
        } else {
          const { error: deleteError } = await deleteData("cart_items", item.id);
          if (deleteError) {
            return res.status(500).json({ message: "Error deleting item" });
          }
        }

        const cartsRes = await RetrieveDataWithJoin(
          "carts",
          "cart_items",
          ["id", "user_id", "created_at"],
          ["id", "product_id", "qty", "products(*)"],
          { id: cart_id }
        );

        if (cartsRes.error) {
          return res.status(500).json({ message: "Error fetching updated cart" });
        }

        const cartsWithImages = await Promise.all(
          cartsRes.data.map(async (cart: any) => {
            const itemsWithImages = await Promise.all(
              cart.cart_items.map(async (item: any) => {
                const imageRes = await RetrieveDataByField("product_images", {
                  product_id: item.product_id,
                  isPriority: true,
                });
                const image = imageRes.data.length > 0 ? imageRes.data[0].image_url : "";
                return {
                  id: item.id,
                  qty: item.qty,
                  product: item.products,
                  image,
                };
              })
            );

            return {
              id: cart.id,
              user_id: cart.user_id,
              created_at: cart.created_at,
              cart_items: itemsWithImages,
            };
          })
        );

        return res.status(200).json({ message: "Success updating item qty", data: cartsWithImages });
      } else {
        return res.status(404).json({ message: "Item not found in cart" });
      }
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } else if (req.method === "DELETE") {
    const { cart_id, product_id } = req.body;
    console.log(cart_id, product_id);

    const { data: existingItem, error: itemError } = await RetrieveDataByField("cart_items", {
      cart_id,
      product_id,
    });

    if (itemError) {
      return res.status(500).json({ message: "Error checking cart items" });
    } else if (existingItem.length > 0) {
      const item = existingItem[0];
      const { error: deleteError } = await deleteData("cart_items", item.id);
      if (deleteError) {
        return res.status(500).json({ message: "Error deleting item" });
      }

      const cartsRes = await RetrieveDataWithJoin(
        "carts",
        "cart_items",
        ["id", "user_id", "created_at"],
        ["id", "product_id", "qty", "products(*)"],
        { id: cart_id }
      );

      if (cartsRes.error) {
        return res.status(500).json({ message: "Error fetching updated cart" });
      }

      const cartsWithImages = await Promise.all(
        cartsRes.data.map(async (cart: any) => {
          const itemsWithImages = await Promise.all(
            cart.cart_items.map(async (item: any) => {
              const imageRes = await RetrieveDataByField("product_images", {
                product_id: item.product_id,
                isPriority: true,
              });
              const image = imageRes.data.length > 0 ? imageRes.data[0].image_url : "";
              return {
                id: item.id,
                qty: item.qty,
                product: item.products,
                image,
              };
            })
          );

          return {
            id: cart.id,
            user_id: cart.user_id,
            created_at: cart.created_at,
            cart_items: itemsWithImages,
          };
        })
      );

      return res.status(200).json({ message: "Success deleting item", data: cartsWithImages });
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

export default withAuth(handler, ["user", "admin"]);
