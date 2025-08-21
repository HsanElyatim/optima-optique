import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const skip = (page - 1) * limit;

        const [orders, totalOrders] = await Promise.all([
            prisma.order.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" }, // newest first
            }),
            prisma.order.count(),
        ]);

        return NextResponse.json({
            orders,
            totalOrders,
            page,
            totalPages: Math.ceil(totalOrders / limit),
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}
