'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from "@/components/ProductCard"

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

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const gender = searchParams.get('gender')
                const category = searchParams.get('category')
                const query = new URLSearchParams()

                if (gender) query.set('gender', gender)
                if (category) query.set('category', category)

                const res = await fetch(`/api/products?${query.toString()}`)
                const data = await res.json()
                setProducts(data)
            } catch (err) {
                console.error('Failed to fetch products:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [searchParams.toString()])

    if (loading) {
        return (
            <div className="px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Chargement des produits...</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse rounded-xl border border-gray-200 p-5 shadow-sm bg-white">
                            <div className="h-52 w-full rounded-lg bg-gray-300 mb-4" />
                            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
                            <div className="h-4 w-1/2 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="px-6 py-12">
            <div className="relative bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 mb-10 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Découvrez Nos Produits</h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Explorez notre collection soigneusement sélectionnée adaptée à vos besoins.
                        </p>
                    </div>

                    {searchParams.get('gender') && (
                        <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
                            <span className="text-sm text-gray-500">Filtré par :</span>
                            <span className="text-sm bg-gray-800 text-white px-4 py-1.5 rounded-full font-medium capitalize">
          {searchParams.get('gender')}
        </span>
                        </div>
                    )}
                </div>
            </div>


            {products.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    <p className="text-lg">Aucun produit trouvé pour cette sélection.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}