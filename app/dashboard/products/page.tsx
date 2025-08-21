"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    offerPrice?: number;
    inStock: boolean;
    createdAt: string;
}

export default function ProductManagementPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Products</h1>
                <Button onClick={() => router.push("/dashboard/products/create")}>+ Add Product</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="border p-4 rounded-xl shadow-sm">
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col justify-between">
                                <div>
                                    <div className="font-medium text-lg">{product.name}</div>
                                    <div className="text-sm text-gray-600">
                                        Price: ${product.offerPrice ?? product.price}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Status: {product.inStock ? "In Stock" : "Out of Stock"}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/dashboard/products/edit/${product.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="relative w-40 h-40 aspect-squar mb-4 rounded-lg overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center bg-gray-100 text-gray-400 h-full">
                                        No image
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        setProducts((prev) => prev.filter((p) => p.id !== id));
    }
}
