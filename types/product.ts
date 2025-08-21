// types/product.ts
export interface ProductPayload {
    name: string
    description: string
    price: number
    offerPrice?: number
    brand?: string
    sku?: string
    inStock?: boolean
    stockQty?: number
    images: string[]          // at least one image URL
    category: string
    color?: string
    gender: 'Male' | 'Female' | 'Unisex'
    frameShape?: string
    material?: string
}
