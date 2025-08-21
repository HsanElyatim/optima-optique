'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';

export default function OrderDetailsPage() {
    const {id} = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/orders/${id}`);
                const data = await res.json();
                setOrder(data);
                setStatus(data.status);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id]);

    const handleStatusUpdate = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({status}),
            });

            if (!res.ok) throw new Error('Failed to update status');

            const updated = await res.json();
            setOrder(updated);
            alert('Status updated successfully ✅');
        } catch (err) {
            console.error(err);
            alert('Error updating status ❌');
        }
    };

    if (loading) return <div className="p-6">Loading order details...</div>;
    if (!order) return <div className="p-6">Order not found</div>;

    return (<div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => router.push('/dashboard/orders')}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← Back to Orders
            </button>

            <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>

            {/* Customer Info */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h2 className="font-semibold mb-2">Customer Info</h2>
                <p><strong>Name:</strong> {order.fullName}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p>
                    <strong>Address:</strong> {order.address},{' '}
                    {order.city}
                </p>
                <p><strong>Payment Type:</strong> {order.paymentType}</p>
            </div>

            {/* Items */}
            <div className="mb-6">
                <h2 className="font-semibold mb-2">Items</h2>
                <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Product</th>
                        <th className="p-2 border">Qty</th>
                        <th className="p-2 border">Price</th>
                        <th className="p-2 border">Subtotal</th>
                    </tr>
                    </thead>
                    <tbody>
                    {order.items?.map((item: any, i: number) => (<tr key={i}>
                            <td className="p-2 border">{item.product.name}</td>
                            <td className="p-2 border">{item.quantity}</td>
                            <td className="p-2 border">${item.price.toFixed(2)}</td>
                            <td className="p-2 border">
                                ${(item.price * item.quantity).toFixed(2)}
                            </td>
                        </tr>))}
                    </tbody>
                </table>
            </div>
            <div className="font-bold text-right">
                Total: ${order.totalAmount.toFixed(2)}
            </div>
            {/* Status Update */}
            <div className="mb-6">
                <h2 className="font-semibold mb-2">Order Status</h2>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 rounded bg-white"
                >
                    {['PENDING' ,'PROCESSING' ,'SHIPPED' ,'DELIVERED' ,'CANCELLED'].map((item: any, i: number) => (
                        <option key={i} value={item}>{item}</option>
                    ))
                    }
                </select>
                <button
                    onClick={handleStatusUpdate}
                    className="ml-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Update
                </button>
            </div>
        </div>);
}
