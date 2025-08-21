import prisma from '@/lib/prisma';
import Link from 'next/link';
import {$Enums} from "@/lib/generated/prisma";
import OrderStatus = $Enums.OrderStatus;
import {createClient} from "@/lib/supabase/client";

// Format currency nicely
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);

// Fetch stats from DB
async function getDashboardStats() {
    const productsCount = await prisma.product.count();
    const ordersCount = await prisma.order.count();

    const revenue = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: OrderStatus.DELIVERED },
    });

    const recentOrders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
            id: true,
            status: true,
            totalAmount: true,
            createdAt: true,
            userId: true,
        },
    });

    return {
        productsCount,
        ordersCount,
        revenue: revenue._sum.totalAmount || 0,
        recentOrders,
    };
}

export default async function DashboardPage() {
    const { productsCount, ordersCount, revenue, recentOrders } = await getDashboardStats();

    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-white rounded shadow">
                    <h2 className="text-lg font-semibold">Products</h2>
                    <p className="mt-2 text-3xl">{productsCount}</p>
                </div>
                <div className="p-6 bg-white rounded shadow">
                    <h2 className="text-lg font-semibold">Orders</h2>
                    <p className="mt-2 text-3xl">{ordersCount}</p>
                </div>
                <div className="p-6 bg-white rounded shadow">
                    <h2 className="text-lg font-semibold">Revenue</h2>
                    <p className="mt-2 text-3xl">{formatCurrency(revenue)}</p>
                </div>
            </div>

            {/* Recent orders */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow overflow-hidden">
                        <thead className="bg-gray-100 text-sm font-medium text-gray-700">
                        <tr>
                            <th className="p-3 text-left">Order ID</th>
                            <th className="p-3 text-left">User Email</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Total</th>
                            <th className="p-3 text-left">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentOrders.map(order => (
                            <tr key={order.id} className="border-t text-sm">
                                <td className="p-3">{order.id.slice(0, 8)}</td>
                                <td className="p-3">{order.userId}</td>
                                <td className="p-3 capitalize">{order.status.toLowerCase()}</td>
                                <td className="p-3">{formatCurrency(order.totalAmount)}</td>
                                <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Products management */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
                <Link
                    href="/dashboard/products"
                    className="inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-900 transition"
                >
                    Go to Products Management
                </Link>
            </section>
        </div>
    );
}