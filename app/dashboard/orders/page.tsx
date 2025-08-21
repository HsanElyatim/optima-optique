'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAllOrders = async (pageNum: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/orders?page=${pageNum}&limit=10`);
            const data = await res.json();
            setOrders(data.orders);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders(page);
    }, [page]);

    if (loading) return <div className="p-6">Loading orders...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">All Orders (Admin)</h1>
            <div className="overflow-x-auto border rounded-lg shadow">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 text-left text-gray-700">
                    <tr>
                        <th className="p-3 border">Order ID</th>
                        <th className="p-3 border">Customer</th>
                        <th className="p-3 border">Email</th>
                        <th className="p-3 border">Address</th>
                        <th className="p-3 border">Payment</th>
                        <th className="p-3 border">Total</th>
                        <th className="p-3 border">Status</th>
                        <th className="p-3 border">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-3 border font-mono">{order.id}</td>
                            <td className="p-3 border">{order.fullName}</td>
                            <td className="p-3 border">{order.email}</td>
                            <td className="p-3 border">{order.address}, {order.city}</td>
                            <td className="p-3 border">{order.paymentType}</td>
                            <td className="p-3 border font-semibold">${order.totalAmount.toFixed(2)}</td>
                            <td className="p-3 border">
                  <span className={`px-2 py-1 text-xs rounded ${
                      order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                            </td>
                            <td className="p-3 border space-x-2">
                                <Link
                                    href={`./orders/${order.id}`}
                                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    View / Edit
                                </Link>
                            </td>
                        </tr>
                    ))}

                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={8} className="p-6 text-center text-gray-500">
                                No orders found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm">Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}