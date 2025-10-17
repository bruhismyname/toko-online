import { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/utils/withAuth";
import supabase from "@/lib/supabase/init";
import { RetrieveDataByField } from "@/lib/supabase/service";

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  if (req.method === "GET") {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    console.log("API accessed: /api/orders with id:", id);

    const {data : dataOrders, error : errorOrders} = await RetrieveDataByField("orders", { user_id: String(id) });

    console.log(dataOrders);

    if (errorOrders) {
      console.error("Error fetching orders:", errorOrders);
      return res.status(500).json({ message: "Failed to retrieve orders" });
    }

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
        .eq("order_id", dataOrders.map(order => order.id))
        .in("status", ["diproses", "dikirim", "selesai", "pending", "batal"])
        .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }

    console.log("Orders fetched for user:", data);
    return res.status(200).json(data);


  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default withAuth(handler, ["user"]);
