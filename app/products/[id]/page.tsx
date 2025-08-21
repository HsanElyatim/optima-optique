import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

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

async function fetchProduct(id: string): Promise<Product | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await fetchProduct(params.id);
    if (!product) return notFound();

    return <ProductDetailClient product={product} />;
}