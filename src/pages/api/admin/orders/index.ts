// /pages/api/orders.ts
import supabase from "@/lib/supabase/init";
import { withAuth } from "@/utils/withAuth";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  const userId = req.user?.id;
  console.log("Authenticated user ID:", userId);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {

    const { orderId } = req.query;
    console.log("User API accessed: /api/orders");

    if (!orderId) {
      try {
        const { data, error } = await supabase
          .from("order_items")
          .select(`
            id,
            order_id,
            price,
            total,
            address:address_id (
              id,
              city,
              province,
              street,
              postal_code
            ),
            created_at,
            status,
            cart_item:cart_item_id (
              id,
              qty,
              status,
              product:product_id (
                id,
                name,
                price,
                image_url
              )
            ),
            order:order_id (
              id,
              user:user_id (
                id,
                name,
                email
              )
            )
          `)
          .eq("order.user_id", userId) 
          .in("status", ["diproses", "dikirim", "selesai", "pending", "batal"])
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          return res.status(500).json({ message: "Internal Server Error", error });
        }

        console.log("Orders fetched for user:", data);
        return res.status(200).json(data);
      } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ message: "Unexpected error occurred", err });
      }

    } else if (orderId) {
      console.log("Fetching details for orderId:", orderId);
      try {
        const { data, error } = await supabase
          .from("order_items")
          .select(`
            id,
            order_id,
            price,
            total,
            address:address_id (
              id,
              city,
              province,
              street,
              postal_code
            ),
            created_at,
            status,
            cart_item:cart_item_id (
              id,
              qty,
              status,
              product:product_id (
                id,
                name,
                price,
                image_url
              )
            ),
            order:order_id (
              id,
              user:user_id (
                id,
                name,
                email
              )
            )
          `)
          .eq("id", orderId)
          .eq("order.user_id", userId) 
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          return res.status(500).json({ message: "Internal Server Error", error });
        }

        console.log("Order details fetched:", data);
        return res.status(200).json(data);
      } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ message: "Unexpected error occurred", err });
      }
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

export default withAuth(handler, ["user"]);
