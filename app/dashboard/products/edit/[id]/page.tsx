"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/ImageUploader";

type ProductForm = {
    name: string;
    brand?: string;
    description: string;
    price: string;
    offerPrice?: string;
    images: string[];
    category: string;
    gender: string;
    inStock: boolean;
};

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id as string;

    const [form, setForm] = useState<ProductForm>({
        name: "",
        brand: "",
        description: "",
        price: "",
        offerPrice: "",
        images: [],
        category: "",
        gender: "",
        inStock: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${productId}`);
                if (!res.ok) throw new Error("Failed to load product");
                const data = await res.json();

                setForm({
                    name: data.name || "",
                    brand: data.brand || "",
                    description: data.description || "",
                    price: data.price?.toString() || "",
                    offerPrice: data.offerPrice?.toString() || "",
                    images: data.images || [],
                    category: data.category || "",
                    gender: data.gender || "",
                    inStock: data.inStock ?? true,
                });
            } catch (error) {
                console.error(error);
                alert("Erreur lors du chargement du produit.");
            } finally {
                setLoading(false);
            }
        }

        if (productId) fetchProduct();
    }, [productId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleStock = () => {
        setForm((prev) => ({ ...prev, inStock: !prev.inStock }));
    };

    const handleImagesUpload = (urls: string[]) => {
        setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    };

    const handleRemoveImage = (index: number) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price),
                    offerPrice: form.offerPrice ? parseFloat(form.offerPrice) : null,
                }),
            });

            if (!res.ok) throw new Error("Failed to update product");

            router.push("/dashboard/products");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour du produit.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Chargement du produit...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Modifier le produit</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <Label htmlFor="name">Nom du produit</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="brand">Marque</Label>
                    <Input name="brand" value={form.brand} onChange={handleChange} />
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="price">Prix</Label>
                        <Input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="offerPrice">Prix Promo</Label>
                        <Input
                            type="number"
                            name="offerPrice"
                            value={form.offerPrice}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <Label>Images</Label>
                    <ImageUploader onUpload={handleImagesUpload} />
                    {form.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {form.images.map((url, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Image ${i + 1}`}
                                        className="w-full h-28 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(i)}
                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-70 hover:opacity-100 transition"
                                        aria-label="Remove image"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="category">Catégorie</Label>
                        <Input name="category" value={form.category} onChange={handleChange} />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="gender">Genre</Label>
                        <Input name="gender" value={form.gender} onChange={handleChange} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Switch checked={form.inStock} onCheckedChange={handleToggleStock} />
                    <span>{form.inStock ? "En stock" : "Rupture de stock"}</span>
                </div>

                <Button type="submit" disabled={saving}>
                    {saving ? "Mise à jour en cours..." : "Mettre à jour le produit"}
                </Button>
            </form>
        </div>
    );
}
