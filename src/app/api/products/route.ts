import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isNew = searchParams.get('isNew')
    const isFeatured = searchParams.get('isFeatured')
    const search = searchParams.get('search')
    
    const where: Record<string, unknown> = {}
    
    if (category) {
      where.category = category
    }
    
    if (isNew === 'true') {
      where.isNew = true
    }
    
    if (isFeatured === 'true') {
      where.isFeatured = true
    }
    
    if (search) {
      where.name = {
        contains: search,
      }
    }
    
    const products = await db.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    const formattedProducts = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images),
      sizes: JSON.parse(product.sizes),
      colors: product.colors ? JSON.parse(product.colors) : null,
      price: Number(product.price),
    }))
    
    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
