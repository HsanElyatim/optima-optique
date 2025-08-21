"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Product = {
    id: string;
    name: string;
    price: number;
    offerPrice?: number;
    image?: string;
};

export default function CartPage() {
    const { state: cart, dispatch } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch product details for cart items
    useEffect(() => {
        const fetchProducts = async () => {
            if (!cart.items.length) {
                setProducts([]);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const ids = cart.items.map((i) => i.productId).join(",");
                const res = await fetch(`/api/products?ids=${ids}`);
                if (!res.ok) throw new Error("Failed to fetch products");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError("Error loading cart products");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [cart.items]);

    const total = products.reduce((sum, product) => {
        const item = cart.items.find((i) => i.productId === product.id);
        if (!item) return sum;
        const price = product.offerPrice ?? product.price;
        return sum + price * item.quantity;
    }, 0);

    const handleCheckout = () => {
        if (cart.items.length === 0) return;
        // Redirect to checkout page
        router.push("/checkout");
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading cart...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

            {cart.items.length === 0 ? (
                <div className="text-center text-gray-600">Your cart is empty.</div>
            ) : (
                <>
                    {/* Cart Items List */}
                    <ul className="divide-y divide-gray-200">
                        {products.map((product) => {
                            const item = cart.items.find((i) => i.productId === product.id);
                            if (!item) return null;
                            const price = product.offerPrice ?? product.price;
                            return (
                                <li key={product.id} className="flex items-center justify-between py-4">
                                    <div className="flex items-center space-x-4">
                                        {product.image && (
                                            <img src={product.image} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
                                        )}
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} × ${price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold">${(price * item.quantity).toFixed(2)}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: product.id })}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Cart Summary */}
                    <div className="mt-8 flex justify-between items-center text-xl font-bold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    {/* Checkout Button */}
                    <div className="mt-8">
                        <Button className="w-full" disabled={cart.items.length === 0} onClick={handleCheckout}>
                            Proceed to Checkout
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}