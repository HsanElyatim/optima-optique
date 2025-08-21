'use client';

import React, { createContext, useReducer, useContext, ReactNode, useEffect } from "react";

type CartItem = {
    productId: string;
    quantity: number;
};

type CartState = {
    items: CartItem[];
};

type CartAction =
    | { type: "ADD_ITEM"; productId: string; quantity?: number }
    | { type: "REMOVE_ITEM"; productId: string }
    | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
    | { type: "CLEAR_CART" };

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
} | null>(null);

const initialState: CartState = {
    items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
    console.log("Reducer received action:", action);
    switch (action.type) {
        case "ADD_ITEM": {
            const existing = state.items.find((i) => i.productId === action.productId);
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.productId === action.productId
                            ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
                            : i
                    ),
                };
            }
            return {
                items: [...state.items, { productId: action.productId, quantity: action.quantity ?? 1 }],
            };
        }

        case "REMOVE_ITEM":
            return {
                items: state.items.filter((i) => i.productId !== action.productId),
            };

        case "CLEAR_CART":
            return { items: [] };

        default:
            return state;
    }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState, () => {
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem("cart");
                const parsed = stored ? JSON.parse(stored) : null;

                // Ensure parsed is a valid CartState
                if (parsed && Array.isArray(parsed.items)) {
                    return parsed;
                }
            } catch (err) {
                console.warn("Failed to parse cart from localStorage:", err);
            }
        }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state));
    }, [state]);

    return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};


export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
