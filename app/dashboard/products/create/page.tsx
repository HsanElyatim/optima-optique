"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/ImageUploader";

export default function AddProductPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        offerPrice: "",
        images: [] as string[], // now an array of URLs
        category: "",
        gender: "",
        inStock: true,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleStock = () => {
        setForm((prev) => ({ ...prev, inStock: !prev.inStock }));
    };

    // Receive uploaded image URLs from ImageUploader
    const handleImagesUpload = (urls: string[]) => {
        setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/products", {
                method: "POST",
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price),
                    offerPrice: form.offerPrice ? parseFloat(form.offerPrice) : null,
                    // images are already an array of strings
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Failed to create product");

            router.push("/dashboard/products");
        } catch (err) {
            console.error("Add product error:", err);
            alert("Erreur lors de l'ajout du produit.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Ajouter un produit</h1>
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
                                <img
                                    key={i}
                                    src={url}
                                    alt={`Uploaded ${i + 1}`}
                                    className="w-full h-28 object-cover rounded"
                                />
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

                <Button type="submit" disabled={loading}>
                    {loading ? "Ajout en cours..." : "Ajouter le produit"}
                </Button>
            </form>
        </div>
    );
}