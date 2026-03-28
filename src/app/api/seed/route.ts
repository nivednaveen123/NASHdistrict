import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

const products = [
  {
    id: 'prod_1',
    name: 'MACH Sneakers',
    price: 129.00,
    description: 'Premium white sneakers with clean design',
    images: JSON.stringify(['/products/sneakers-1.png']),
    category: 'Sneakers',
    sizes: JSON.stringify(['36', '37', '38', '39', '40', '41', '42', '43', '44']),
    isNew: true,
    isFeatured: true,
    stock: 50,
  },
  {
    id: 'prod_2',
    name: 'Urban High-Tops',
    price: 149.00,
    description: 'Black high-top sneakers with white sole',
    images: JSON.stringify(['/products/sneakers-2.png']),
    category: 'Sneakers',
    sizes: JSON.stringify(['36', '37', '38', '39', '40', '41', '42', '43', '44']),
    isNew: true,
    isFeatured: true,
    stock: 35,
  },
  {
    id: 'prod_3',
    name: 'Oversized Hoodie',
    price: 89.00,
    description: 'Beige oversized hoodie for ultimate comfort',
    images: JSON.stringify(['/products/hoodie-1.png']),
    category: 'Hoodies',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    isNew: true,
    isFeatured: true,
    stock: 100,
  },
  {
    id: 'prod_4',
    name: 'Graphic Tee',
    price: 45.00,
    description: 'Black oversized t-shirt with graphic print',
    images: JSON.stringify(['/products/tshirt-1.png']),
    category: 'T-Shirts',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    isNew: false,
    isFeatured: true,
    stock: 80,
  },
  {
    id: 'prod_5',
    name: 'Vintage Denim',
    price: 98.00,
    description: 'Vintage wash denim jeans with perfect fit',
    images: JSON.stringify(['/products/jeans-1.png']),
    category: 'Jeans',
    sizes: JSON.stringify(['28', '29', '30', '31', '32', '33', '34', '36']),
    isNew: true,
    isFeatured: false,
    stock: 60,
  },
  {
    id: 'prod_6',
    name: 'Leather Jacket',
    price: 249.00,
    description: 'Classic black leather jacket',
    images: JSON.stringify(['/products/jacket-1.png']),
    category: 'Jackets',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    isNew: false,
    isFeatured: true,
    stock: 25,
  },
  {
    id: 'prod_7',
    name: 'Cargo Pants',
    price: 79.00,
    description: 'Navy blue cargo pants with utility pockets',
    images: JSON.stringify(['/products/cargo-1.png']),
    category: 'Pants',
    sizes: JSON.stringify(['28', '29', '30', '31', '32', '33', '34', '36']),
    isNew: false,
    isFeatured: false,
    stock: 45,
  },
  {
    id: 'prod_8',
    name: 'Essential Sweatshirt',
    price: 69.00,
    description: 'Grey oversized sweatshirt',
    images: JSON.stringify(['/products/sweatshirt-1.png']),
    category: 'Sweatshirts',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    isNew: false,
    isFeatured: false,
    stock: 70,
  },
  {
    id: 'prod_9',
    name: 'Chunky Runners',
    price: 159.00,
    description: 'Red chunky sneakers for bold style',
    images: JSON.stringify(['/products/sneakers-3.png']),
    category: 'Sneakers',
    sizes: JSON.stringify(['36', '37', '38', '39', '40', '41', '42', '43', '44']),
    isNew: true,
    isFeatured: false,
    stock: 30,
  },
  {
    id: 'prod_10',
    name: 'Bomber Jacket',
    price: 179.00,
    description: 'Cream bomber jacket with ribbed cuffs',
    images: JSON.stringify(['/products/bomber-1.png']),
    category: 'Jackets',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    isNew: false,
    isFeatured: true,
    stock: 40,
  },
  {
    id: 'prod_11',
    name: 'Classic Hoodie',
    price: 85.00,
    description: 'White oversized hoodie',
    images: JSON.stringify(['/products/hoodie-2.png']),
    category: 'Hoodies',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    isNew: false,
    isFeatured: false,
    stock: 55,
  },
  {
    id: 'prod_12',
    name: 'Ripped Skinny Jeans',
    price: 89.00,
    description: 'Black ripped skinny jeans',
    images: JSON.stringify(['/products/jeans-2.png']),
    category: 'Jeans',
    sizes: JSON.stringify(['28', '29', '30', '31', '32', '33', '34', '36']),
    isNew: true,
    isFeatured: false,
    stock: 65,
  },
  {
    id: 'prod_13',
    name: 'Olive Graphic Tee',
    price: 49.00,
    description: 'Olive green graphic print oversized t-shirt',
    images: JSON.stringify(['/products/tshirt-2.png']),
    category: 'T-Shirts',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    isNew: false,
    isFeatured: false,
    stock: 90,
  },
  {
    id: 'prod_14',
    name: 'Utility Vest',
    price: 119.00,
    description: 'Beige utility vest for layering',
    images: JSON.stringify(['/products/vest-1.png']),
    category: 'Jackets',
    sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
    isNew: true,
    isFeatured: true,
    stock: 35,
  },
]

export async function GET() {
  try {
    // Clear existing products
    await db.product.deleteMany()
    
    // Insert seed products
    await db.product.createMany({
      data: products,
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully',
      count: products.length 
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed database' 
    }, { status: 500 })
  }
}
