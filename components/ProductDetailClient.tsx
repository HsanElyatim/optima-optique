"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import toast from "react-hot-toast";

type Product = {
    id: string;
    name: string;
    brand?: string;
    price: number;
    offerPrice?: number | null;
    images: string[];
    rating: number;
    reviewsCount: number;
    inStock: boolean;
    description: string;
};

interface Props {
    product: Product;
}

export default function ProductDetailClient({ product }: Props) {
    const { dispatch } = useCart();

    const addToCart = () => {
        dispatch({ type: "ADD_ITEM", productId: product.id, quantity: 1 });
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
            {/* Images */}
            <div className="space-y-4">
                <Carousel>
                    <CarouselContent>
                        {product.images.map((img, i) => (
                            <CarouselItem key={i}>
                                <div className="relative w-full aspect-[1/1] rounded-xl overflow-hidden">
                                    <Image
                                        src={img}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover object-center"
                                        priority={i === 0}
                                    />
                                    {product.offerPrice && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
                                            -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
                                        </div>
                                    )}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70" />
                </Carousel>
            </div>

            {/* Details */}
            <div className="space-y-6">
                <div>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                </div>

                <div className="flex items-center gap-3">
                    {product.offerPrice ? (
                        <>
                            <span className="text-2xl font-bold text-red-500">${product.offerPrice.toFixed(2)}</span>
                            <span className="text-base line-through text-gray-400">${product.price.toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    )}
                </div>

                <div className="text-yellow-500 text-sm">
                    {"★".repeat(Math.floor(product.rating))}{" "}
                    <span className="text-gray-600">({product.reviewsCount} avis)</span>
                </div>

                <p className="text-gray-700 leading-relaxed">{product.description}</p>

                <Button
                    className="w-full bg-black hover:bg-gray-900 text-white text-lg py-6"
                    disabled={!product.inStock}
                    onClick={addToCart}
                >
                    <ShoppingCart className="mr-2" size={20} />
                    {product.inStock ? "Ajouter au panier" : "Rupture de stock"}
                </Button>
            </div>
        </div>
    );
}