"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
    product: {
        id: string;
        name: string;
        brand?: string;
        price: number;
        offerPrice?: number | null;
        images: string[];
        rating: number;
        reviewsCount: number;
        inStock: boolean;
    };
};

const ProductCard: React.FC<{ product: ProductCardProps["product"] }> = ({ product }) => {
    const {
        id,
        name,
        brand,
        price,
        offerPrice,
        images,
        rating,
        reviewsCount,
        inStock,
    } = product;

    return (
        <Link href={`/products/${id}`} className="group relative bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition duration-300 block">
            {/* Image */}
            <div className="relative w-full aspect-[1/1] overflow-hidden rounded-xl bg-gray-100">
                <Image
                    src={images[0]}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {offerPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
                        -{Math.round(((price - offerPrice) / price) * 100)}%
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="mt-4 space-y-1">
                {brand && <p className="text-sm text-gray-500">{brand}</p>}
                <h3 className="text-base font-medium text-gray-900 line-clamp-2">{name}</h3>

                <div className="flex items-center gap-2">
                    {offerPrice ? (
                        <>
                            <span className="text-lg font-bold text-red-500">${offerPrice.toFixed(2)}</span>
                            <span className="text-sm line-through text-gray-400">${price.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
                    )}
                </div>

            </div>

            {/* Add to Cart */}
            <div className="mt-4 pointer-events-none">
                <Button
                    className="w-full flex items-center justify-center gap-2 text-white bg-black hover:bg-gray-900"
                    disabled={!inStock}
                >
                    <ShoppingCart size={18} />
                    {inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
            </div>
        </Link>
    );
};

export default ProductCard;
