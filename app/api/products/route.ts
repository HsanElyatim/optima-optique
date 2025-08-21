import { NextResponse } from 'next/server'
//import { createClient } from "@/lib/supabase/client";
import prisma from '@/lib/prisma'
import type { ProductPayload } from '@/types/product'

/**
 * GET /api/products  →  list products
 * Supports query params:  ?page=1&limit=20&category=Sunglasses
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const page   = Number(searchParams.get('page')   ?? '1')
    const limit  = Number(searchParams.get('limit')  ?? '20')
    const skip   = (page - 1) * limit
    const where: any = {}

    const category = searchParams.get('category')
    const gender = searchParams.get('gender')
    if (category) where.category = category
    if (gender) where.gender = gender

    const products = await prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
}

/**
 * POST /api/products  →  create product
 * Body: ProductPayload
 */
export async function POST(req: Request) {
    //const supabase = createClient()
    //const {
    //    data: { user },
    //} = await supabase.auth.getUser()

    //if (!user) {
    //    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    //}
    console.log('POST Test')
    const body = (await req.json()) as ProductPayload

    // basic validation – production apps should use zod or yup
    if (!body.name || !body.description || !body.price || !body.images?.length || !body.category) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await prisma.product.create({ data: body })
    return NextResponse.json(product, { status: 201 })
}
