import supabase from "@/lib/supabase/init";
import { addData, deleteData, RetrieveData, RetrieveDataByField, RetrieveDataById, RetrieveDataWithJoin, updateData } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest & { user?: any }, res: NextApiResponse) {
    if (req.method === "POST") {
        const { cart_item_id, user_id } = req.body;
        console.log(cart_item_id, user_id);

        if (!cart_item_id || !user_id) 
            return res.status(400).json({ message: "Semua field wajib diisi" });

        const { data: cartItem, error: cartItemError } = await RetrieveDataByField("cart_items", { id: cart_item_id, status : "in_cart" });
        if (cartItemError) return res.status(500).json({ message: "Error retrieving cart item" });
        if (cartItem.length === 0) return res.status(404).json({ message: "Cart item not found" });

        const { data: existingOrders, error: orderError } = await RetrieveDataByField("orders", { user_id });
        if (orderError) return res.status(500).json({ message: "Error checking existing order" });

        let checkoutId: number;

        if (existingOrders.length > 0) {
            checkoutId = existingOrders[0].id;
        } else {
            const { data: newOrder, error: createOrderError } = await addData("orders", { user_id });
            if (createOrderError) return res.status(500).json({ message: "Error creating order" });
            checkoutId = newOrder[0].id;
        }

        const { data: productData, error: productError } = await RetrieveDataByField("products", { id: cartItem[0].product_id });
        if (productError) return res.status(500).json({ message: "Error retrieving product" });
        if (productData.length === 0) return res.status(404).json({ message: "Product not found" });

        const { data: stockData, error: stockError } = await RetrieveDataByField("stocks", { id: cartItem[0].stock_id });
        if (stockError) return res.status(500).json({ message: "Error retrieving stock" });
        if (stockData.length === 0) return res.status(404).json({ message: "Stock not found" });

        if (stockData[0].quantity === 0) 
            return res.status(404).json({ message: "Stok habis" });
        if (stockData[0].quantity < cartItem[0].qty) 
            return res.status(400).json({ message: "Stok tidak mencukupi" });

        const totalPrice = productData[0].price * cartItem[0].qty;
        const { data: newOrderItem, error: orderItemError } = await addData("order_items", {
            order_id: checkoutId,
            cart_item_id, 
            price: productData[0].price,
            total: totalPrice,
            address_id: null,
            status: "pending"               
        });

        if (orderItemError) 
            return res.status(500).json({ message: "Error adding item to checkout" });

        console.log("✅ Order item ditambahkan:", newOrderItem);

        return res.status(200).json({
            message: "Item added to checkout successfully",
            data: newOrderItem
        });
    }
    else if (req.method === "GET") {
    const { id } = req.query;
    console.log("🟦 Checkout ID:", id);

    if (!id) return res.status(400).json({ message: "ID wajib diisi" });

    const { data: orderItems, error } = await supabase
    .from("order_items")
    .select(`
        id,
        order_id,
        price,
        total,
        address_id,
        status,
        cart_items:cart_item_id (
        id,
        qty,
        product_id,
        stock_id,
        products (
            id,
            name,
            price,
            image_url
        ),
        stocks (
            id,
            product_id,
            size,
            quantity
        )
        )
    `)
    .eq("id", id)
    .single();

    if (error) {
        console.error("❌ Error retrieving order items:", error);
        return res.status(500).json({ message: "Error retrieving order items" });
    }

    if (!orderItems)
        return res.status(404).json({ message: "Order item not found" });

    return res.status(200).json({
        data: orderItems,
    });
    }
    else if (req.method === "PUT") {
        const { id, stock_id, cart_item_id, address_id, status } = req.body;
        console.log("PUT /api/checkout", id, stock_id, address_id, status, cart_item_id);

        if (!id || !address_id || !status) {
            return res.status(400).json({ message: "ID, address_id, dan status wajib diisi" });
        }

        // 1. Ambil cart item untuk qty
        const { data: cartItem, error: cartItemError } = await RetrieveDataById("cart_items", cart_item_id);
        if (cartItemError) return res.status(500).json({ message: "Error mengambil cart item" });
        if (!cartItem || cartItem.length === 0) return res.status(404).json({ message: "Cart item tidak ditemukan" });
        const qty = cartItem[0].qty;

        // 2. Ambil stok saat ini
        const { data: stockData, error: stockError } = await RetrieveDataById("stocks", stock_id);
        if (stockError) return res.status(500).json({ message: "Error mengambil stok" });
        if (!stockData || stockData.length === 0) return res.status(404).json({ message: "Stock tidak ditemukan" });

        const currentQuantity = stockData[0].quantity;
        const newQuantity = currentQuantity - qty;

        if (newQuantity < 0) {
            return res.status(400).json({ message: "Stok tidak mencukupi untuk update" });
        }

        // 3. Update order_items (alamat & status)
        const { data: updatedOrder, error: updateError } = await updateData("order_items", id as string, { address_id, status });
        if (updateError) return res.status(500).json({ message: "Error updating order item" });
        console.log("✅ Order item updated:", updatedOrder);

        // 4. Update stok
        const { data: updatedStock, error: stockUpdateError } = await updateData("stocks", stock_id as string, { quantity: newQuantity });
        if (stockUpdateError) return res.status(500).json({ message: "Error mengupdate stok" });
        console.log("✅ Stock updated:", updatedStock);

        // 5. Jangan hapus cart item — ubah status jadi 'checked_out'
        const { data: updatedCartItem, error: cartUpdateError } = await updateData("cart_items", cart_item_id as string, { status: "checked_out" });
        if (cartUpdateError) return res.status(500).json({ message: "Error mengupdate cart item status" });
        console.log("✅ Cart item updated status:", updatedCartItem);

        return res.status(200).json({
            message: "Order item updated, stok berkurang, cart item ditandai checked_out",
            data: {
                updatedOrder,
                updatedStock,
                updatedCartItem,
            },
        });
    }
    else {
        res.setHeader("Allow", ["POST" , "GET" , "PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default withAuth(handler , ["user"] );