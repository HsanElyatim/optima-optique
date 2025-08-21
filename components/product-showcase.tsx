"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

type Product = {
    id: string;
    name: string;
    brand?: string;
    description: string;
    price: number;
    offerPrice?: number | null;
    images: string[];
    rating: number;
    reviewsCount: number;
    inStock: boolean;
};

export default function ProductCarousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`/api/products?limit=10`);
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading)
        return (
            <section className="container mx-auto py-16 md:py-24 text-center">
                <p>Loading products...</p>
            </section>
        );

    const scrollNext = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth, behavior: "smooth" });
        }
    };

    const scrollPrev = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: "smooth" });
        }
    };

    return (
        <section id="sunglasses" className="container mx-auto py-16 md:py-24 relative">
            <div className="mb-10 text-center">
                <h2 className="font-display text-3xl md:text-4xl">Featured Frames</h2>
                <p className="mt-2 text-muted-foreground">
                    Our best sellers, refined for everyday elegance.
                </p>
            </div>

            {/* Carousel wrapper */}
            <div className="relative">
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 scroll-smooth pb-4"
                >
                    {products.map((p) => (
                        <div key={p.id} className="snap-start flex-shrink-0 w-80">
                            <Card className="hover-scale overflow-hidden group">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center justify-between">
                                        <span>{p.name}</span>
                                        <span className="text-muted-foreground text-base">
                      {p.offerPrice ? `$${p.offerPrice.toFixed(2)}` : `$${p.price.toFixed(2)}`}
                    </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="relative aspect-[4/3] rounded-md overflow-hidden">
                                        <img
                                            src={p.images[0]}
                                            alt={p.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <Button variant="secondary" className="w-full" asChild>
                                            <a href="#shop" aria-label={`Shop ${p.name}`}>
                                                Shop now
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Carousel buttons */}
                <button
                    onClick={scrollPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full hover:bg-white z-10"
                >
                    ‹
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full hover:bg-white z-10"
                >
                    ›
                </button>
            </div>
        </section>
    );
}