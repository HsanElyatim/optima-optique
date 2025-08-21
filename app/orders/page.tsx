"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UserOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const supabase = createClient();
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                console.error(userError.message);
                setError("Failed to get user");
                setLoading(false);
                return;
            }

            if (!user) {
                setError("No user found");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/orders?userId=${user.id}`);
                if (!res.ok) throw new Error("Failed to fetch orders");
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                console.error(err);
                setError("Something went wrong while fetching orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!orders.length) return <div>No orders found</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
            {orders.map((order) => (
                <div key={order.id} className="border rounded p-4 mb-4">
                    <div><strong>Order ID:</strong> {order.id}</div>
                    <div><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</div>
                    <div><strong>Status:</strong> {order.status}</div>
                    <div className="mt-2">
                        <strong>Items:</strong>
                        <ul className="list-disc list-inside">
                            {order.items.map((item: any) => (
                                <li key={item.id}>
                                    Product: {item.productId} — Qty: {item.quantity} — Price: ${item.price.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}