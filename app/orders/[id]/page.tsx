'use client';

import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";

type OrderItem = {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product?: {
        name: string;
    };
};

type Order = {
    id: string;
    totalAmount: number;
    status: string;
    items: OrderItem[];
};

export default function UserOrders() {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const id = params?.id;

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);

        fetch(`/api/orders/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch order');
                return res.json();
            })
            .then((data: Order) => setOrder(data))
            .catch(err => {
                setError(err.message);
                setOrder(null);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Loading order details...</div>;

    if (error) return <div className="text-red-500">Error: {error}</div>;

    if (!order) return <div>No order found.</div>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Order Details</h1>

            <div className="border rounded p-4 mb-6">
                <div><strong>Order ID:</strong> {order.id}</div>
                <div><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</div>
                <div><strong>Status:</strong> {order.status}</div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Items</h2>
            <ul className="space-y-3">
                {order.items.map(item => (
                    <li key={item.id} className="flex justify-between border-b pb-2">
                        <div>
                            <div className="font-medium">
                                {item.product?.name ?? `Product ID: ${item.productId}`}
                            </div>
                            <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                        </div>
                        <div className="font-semibold">${item.price.toFixed(2)}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
