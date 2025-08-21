'use client';

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
    const { state: cart, dispatch } = useCart();
    const router = useRouter();
    const supabase = createClient();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        zip: "",
        paymentType: "cod", // default
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cart.items.length) return;

        setLoading(true);
        setError(null);

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();


            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.id,
                    items: cart.items,
                    fullName: form.name,
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    postalCode: form.zip,
                    country: form.country, // if you have a country field
                    paymentType: form.paymentType,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to place order");
            }

            const { order, paymentUrl } = await res.json();

            dispatch({ type: "CLEAR_CART" });

            if (paymentUrl) {
                // Redirect user to Konnect
                window.location.href = paymentUrl;
            } else {
                router.push(`/orders/${order.id}`);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Name</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Phone</Label>
                    <Input name="phone" value={form.phone} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Address</Label>
                    <Input name="address" value={form.address} onChange={handleChange} required />
                </div>
                <div>
                    <Label>City</Label>
                    <Input name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div>
                    <Label>ZIP Code</Label>
                    <Input name="zip" value={form.zip} onChange={handleChange} required />
                </div>

                <div>
                    <Label>Payment Method</Label>
                    <select
                        name="paymentType"
                        value={form.paymentType}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                    >
                        <option value="cod">Cash on Delivery</option>
                        <option value="card">Credit Card</option>
                    </select>
                </div>

                {error && <p className="text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Placing order..." : "Place Order"}
                </Button>
            </form>
        </div>
    );
}
