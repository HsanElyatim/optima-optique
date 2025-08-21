import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { userId, items, fullName, email, phone, address, city, postalCode, country, paymentType } = await request.json();

        if (!userId || !items?.length) {
            return NextResponse.json({ error: "Missing userId, items, or checkout info" }, { status: 400 });
        }

        // Fetch product details for price calculation
        const productIds = items.map((item: any) => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
        });

        let totalAmount = 0;
        const orderItems = items.map((item: any) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) throw new Error(`Product not found: ${item.productId}`);
            const price = product.offerPrice ?? product.price;
            totalAmount += price * item.quantity;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price,
            };
        });

        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                fullName,
                email,
                phone,
                address,
                city,
                postalCode,
                country,
                paymentType: paymentType.toUpperCase(),
                items: { create: orderItems },
            },
            include: { items: true },
        });

        let paymentUrl = null;

        const konnectPayload = {
            "receiverWalletId": "68342529d9dd82b88595addc",
            "token": "TND",
            "amount": totalAmount * 1000,
            "type": "immediate",
            "description": "Payment Test",
            "acceptedPaymentMethods": [
                "bank_card",
                "e-DINAR"
            ],
            "lifespan": 30,
            "checkoutForm": false,
            "addPaymentFeesToAmount": false,
            "firstName": fullName.split("")[0],
            "lastName": fullName.split("")[1],
            "phoneNumber": phone,
            "email": email,
            "orderId": `order-${order.id}`,
            "webhook": "https://merchant.tech/api/notification_payment",
            "theme": "light"
        }

        const res = await fetch(
            "https://api.sandbox.konnect.network/api/v2/payments/init-payment",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.KONNECT_API_KEY,
                },
                body: JSON.stringify(konnectPayload),
            }
        );
        if (!res.ok) {
            const err = await res.json();
            console.error("Konnect init-payment error:", err);
        } else {
            const data = await res.json();
            paymentUrl = data.payUrl;
        }

        return NextResponse.json({ order, paymentUrl });

        //return NextResponse.json(order);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { items: true },
    });

    return NextResponse.json(orders);
}