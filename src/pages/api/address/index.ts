import { addData, RetrieveDataByField } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
  if (req.method === "GET") {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "user_id is required" });

    const { data, error } = await RetrieveDataByField("addresses", { user_id: user_id as string });
    if (error) return res.status(500).json({ message: "Error retrieving addresses" });
    return res.status(200).json({ message: "Addresses retrieved successfully", data });
  }

  else if (req.method === "POST") {
    const { user_id, street, city, province, postal_code } = req.body;
    if (!user_id || !street) return res.status(400).json({ message: "Incomplete address data" });

    const { data, error } = await addData("addresses", { user_id, street, city, province, postal_code });
    if (error) return res.status(500).json({ message: "Error adding address" });
    return res.status(201).json({ message: "Address added successfully", data });
  }

  
}

export default withAuth(handler, ["user"]);
