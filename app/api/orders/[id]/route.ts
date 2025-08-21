import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const id = params.id;

    try {
        const order = await prisma.order.findUnique({
            where: { id: id },
            include: {
                items: {
                    include: {
                        product: true,  // Include product details inside each item
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400 }
            );
        }

        const updatedOrder = await prisma.order.update({
            where: { id: params.id },
            data: { status },
        });

        return NextResponse.json(updatedOrder);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to update order status" },
            { status: 500 }
        );
    }
}
