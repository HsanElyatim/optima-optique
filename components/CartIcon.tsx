"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartButton = () => {
    const { state: cart } = useCart();

    return (
            <>
                <ShoppingCart className="w-6 h-6" />
                {cart.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
          {cart.items.length}
        </span>
                )}
            </>
    );
};

export default CartButton;
