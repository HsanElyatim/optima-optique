import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {
            userId,
            items,
            totalAmount,
            fullName,
            email,
            phone,
            address,
            city,
            postalCode,
            country,
        } = await req.json();

        // Build payload for Konnect
        const konnectPayload = {
            merchantCode: process.env.KONNECT_MERCHANT_CODE,
            merchantReference: `order-${Date.now()}`,
            amount: totalAmount,
            currency: "USD",
            returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/orders/confirmation`,
            customer: {
                name: fullName,
                email,
                phone,
                address,
                city,
                postalCode,
                country,
            },
            items: items.map((i: any) => ({
                name: i.name,
                quantity: i.quantity,
                price: i.price,
            })),
        };

        // Call Konnect API
        const res = await fetch(
            "https://api.sandbox.konnect.network/api/v2/payments/init-payment",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.KONNECT_API_KEY}`,
                },
                body: JSON.stringify(konnectPayload),
            }
        );

        if (!res.ok) {
            const err = await res.json();
            return NextResponse.json({ error: err }, { status: 400 });
        }

        const data = await res.json();

        // Return Konnect payment URL to frontend
        return NextResponse.json({ paymentUrl: data.paymentUrl });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Failed to initiate Konnect payment" },
            { status: 500 }
        );
    }
}
