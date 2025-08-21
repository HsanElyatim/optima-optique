import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import type { ProductPayload } from '@/types/product'

export async function GET(req: Request, context: { params: { id: string } }) {
    const { id } = context.params
    const product = await prisma.product.findUnique({ where: { id: id } })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
}

/**
 * PATCH /api/products/:id  →  partial update
 * Allows any subset of ProductPayload
 */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const body = (await req.json()) as Partial<ProductPayload>

    try {
        const updated = await prisma.product.update({
            where: { id: params.id },
            data: body,
        })
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
}

/**
 * DELETE /api/products/:id
 */
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.product.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
}
