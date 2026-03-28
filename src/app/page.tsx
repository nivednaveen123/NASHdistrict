'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  ShoppingBag, 
  Menu, 
  Heart, 
  Home, 
  Grid3X3, 
  User, 
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Star
} from 'lucide-react'
import { useStore, type Product, type CartItem } from '@/store'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet'
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Hero slides data
const heroSlides = [
  {
    id: 1,
    image: '/products/hero-1.png',
    title: 'MACH Sneakers',
    subtitle: 'Now Live',
  },
  {
    id: 2,
    image: '/products/hero-2.png',
    title: 'Oversized Collection',
    subtitle: 'New Season',
  },
  {
    id: 3,
    image: '/products/hero-3.png',
    title: 'Leather Edit',
    subtitle: 'Premium',
  },
  {
    id: 4,
    image: '/products/hero-4.png',
    title: 'Vintage Denim',
    subtitle: 'Just Dropped',
  },
]

// Categories data
const categories = [
  { id: 'oversized', name: 'Oversized Fit', image: '/products/category-oversized.png' },
  { id: 'sneakers', name: 'Sneakers', image: '/products/category-sneakers.png' },
  { id: 'streetwear', name: 'Streetwear', image: '/products/category-streetwear.png' },
  { id: 'denim', name: 'Denim', image: '/products/category-denim.png' },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [activeTab, setActiveTab] = useState('home')
  
  const { cart, wishlist, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount, addToWishlist, removeFromWishlist, isInWishlist } = useStore()
  
  const carouselRef = useRef<HTMLDivElement>(null)
  const latestDropsRef = useRef<HTMLDivElement>(null)

  // Fetch products on mount
  useEffect(() => {
    const init = async () => {
      // Seed database first
      await fetch('/api/seed')
      
      // Fetch products
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    }
    init()
  }, [])

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Search functionality - use useMemo instead of useEffect
  const searchResults = useMemo(() => {
    if (searchQuery.trim()) {
      return products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return []
  }, [searchQuery, products])

  // Latest drops (featured + new)
  const latestDrops = products.filter((p) => p.isFeatured || p.isNew).slice(0, 6)
  
  // New arrivals
  const newArrivals = products.filter((p) => p.isNew)

  const handleAddToCart = (product: Product) => {
    if (!selectedSize) {
      const firstSize = product.sizes[0]
      addToCart(product, firstSize)
    } else {
      addToCart(product, selectedSize)
    }
    setSelectedProduct(null)
    setSelectedSize('')
  }

  const scrollToSection = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const scrollAmount = 280
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-neutral-200 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-16">
      {/* Header - Sticky */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setMenuOpen(true)}
            className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h1 className="text-xl font-bold tracking-tighter">NASH District</h1>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 -mr-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 -mr-2 hover:bg-neutral-100 rounded-lg transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[56vw] max-h-[400px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-6 text-white">
                <p className="text-sm font-medium tracking-wider opacity-90">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <h2 className="text-3xl font-bold tracking-tight mt-1">
                  {heroSlides[currentSlide].title}
                </h2>
                <button className="mt-3 px-6 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-neutral-100 transition-colors">
                  Shop Now
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Slide indicators */}
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all',
                  idx === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                )}
              />
            ))}
          </div>
        </section>

        {/* Latest Drops Section */}
        <section className="mt-6">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-lg font-bold tracking-tight">Latest Drops</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollToSection('left', latestDropsRef)}
                className="p-1.5 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollToSection('right', latestDropsRef)}
                className="p-1.5 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div 
            ref={latestDropsRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {latestDrops.map((product) => (
              <motion.div
                key={product.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedProduct(product)
                  setSelectedSize('')
                }}
                className="flex-shrink-0 w-[160px] snap-start cursor-pointer group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-50">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded">
                      NEW
                    </span>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id)
                      } else {
                        addToWishlist(product.id)
                      }
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart className={cn('w-4 h-4', isInWishlist(product.id) && 'fill-red-500 text-red-500')} />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-neutral-500">{product.category}</p>
                  <h4 className="text-sm font-medium mt-0.5 truncate">{product.name}</h4>
                  <p className="text-sm font-bold mt-1">${product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* New Arrivals Grid */}
        <section className="mt-8 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold tracking-tight">New Arrivals</h3>
            <Badge variant="secondary" className="text-xs">
              {newArrivals.length} items
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {newArrivals.map((product) => (
              <motion.div
                key={product.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedProduct(product)
                  setSelectedSize('')
                }}
                className="cursor-pointer group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-50">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id)
                      } else {
                        addToWishlist(product.id)
                      }
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart className={cn('w-4 h-4', isInWishlist(product.id) && 'fill-red-500 text-red-500')} />
                  </button>
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium truncate">{product.name}</h4>
                  <p className="text-sm font-bold mt-0.5">${product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Category Highlights */}
        <section className="mt-8 px-4">
          <h3 className="text-lg font-bold tracking-tight mb-4">Shop by Style</h3>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                whileTap={{ scale: 0.98 }}
                className="relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer group"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-bold">{category.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* All Products */}
        <section className="mt-8 px-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold tracking-tight">All Products</h3>
            <Badge variant="secondary" className="text-xs">
              {products.length} items
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedProduct(product)
                  setSelectedSize('')
                }}
                className="cursor-pointer group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-50">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isNew && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded">
                      NEW
                    </span>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id)
                      } else {
                        addToWishlist(product.id)
                      }
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart className={cn('w-4 h-4', isInWishlist(product.id) && 'fill-red-500 text-red-500')} />
                  </button>
                </div>
                <div className="mt-2">
                  <h4 className="text-sm font-medium truncate">{product.name}</h4>
                  <p className="text-sm font-bold mt-0.5">${product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 z-50 safe-bottom">
        <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'wishlist', icon: Heart, label: 'Wishlist' },
            { id: 'categories', icon: Grid3X3, label: 'Categories' },
            { id: 'membership', icon: Star, label: 'Membership' },
            { id: 'profile', icon: User, label: 'Profile' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors',
                activeTab === item.id 
                  ? 'text-black' 
                  : 'text-neutral-400'
              )}
            >
              <item.icon className={cn('w-5 h-5', activeTab === item.id && item.id === 'wishlist' && wishlist.length > 0 && 'fill-red-500 text-red-500')} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.id === 'wishlist' && wishlist.length > 0 && (
                <span className="absolute -top-0.5 right-1/2 translate-x-3 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Search Sheet */}
      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent side="top" className="h-full">
          <SheetHeader>
            <SheetTitle className="text-left">Search</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10"
                autoFocus
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProduct(product)
                      setSelectedSize('')
                      setSearchOpen(false)
                      setSearchQuery('')
                    }}
                    className="cursor-pointer group"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-50">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="text-sm font-medium mt-2 truncate">{product.name}</h4>
                    <p className="text-sm font-bold">${product.price}</p>
                  </div>
                ))}
              </div>
            )}
            
            {searchQuery && searchResults.length === 0 && (
              <p className="mt-8 text-center text-neutral-500">No products found</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-left">Your Cart</SheetTitle>
          </SheetHeader>
          
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="w-16 h-16 text-neutral-200 mb-4" />
              <p className="text-neutral-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col h-full mt-4">
              <div className="flex-1 overflow-y-auto space-y-4">
                {cart.map((item: CartItem) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-white">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">Size: {item.size}</p>
                      <p className="text-sm font-bold mt-1">${item.product.price}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, Math.max(1, item.quantity - 1))}
                            className="p-1 rounded-full bg-white border border-neutral-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="p-1 rounded-full bg-white border border-neutral-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-neutral-200 pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
                <Button className="w-full bg-black hover:bg-neutral-800 text-white rounded-full py-6 text-sm font-bold">
                  Checkout • ${getCartTotal().toFixed(2)}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Menu Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[280px]">
          <SheetHeader>
            <SheetTitle className="text-left text-2xl font-bold tracking-tighter">NASH District</SheetTitle>
          </SheetHeader>
          <nav className="mt-8 space-y-1">
            {['Home', 'New Arrivals', 'Best Sellers', 'Collections', 'Sale', 'About'].map((item) => (
              <button
                key={item}
                onClick={() => setMenuOpen(false)}
                className="w-full text-left py-3 px-2 text-lg font-medium hover:bg-neutral-50 rounded-lg transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-lg w-full h-[90vh] max-h-[700px] p-0 gap-0">
          {selectedProduct && (
            <div className="flex flex-col h-full">
              {/* Product Images */}
              <div className="relative h-[45%] bg-neutral-50">
                <Image
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
                <button 
                  onClick={() => {
                    if (isInWishlist(selectedProduct.id)) {
                      removeFromWishlist(selectedProduct.id)
                    } else {
                      addToWishlist(selectedProduct.id)
                    }
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  <Heart className={cn('w-5 h-5', isInWishlist(selectedProduct.id) && 'fill-red-500 text-red-500')} />
                </button>
              </div>
              
              {/* Product Info */}
              <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">{selectedProduct.category}</p>
                    <h2 className="text-xl font-bold mt-1">{selectedProduct.name}</h2>
                    <p className="text-xl font-bold mt-2">${selectedProduct.price}</p>
                  </div>
                </div>
                
                {/* Size Selector */}
                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          'min-w-[44px] h-11 px-3 border rounded-lg text-sm font-medium transition-colors',
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : 'border-neutral-200 hover:border-neutral-400'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Add to Cart - Sticky */}
                <div className="mt-auto pt-4">
                  <Button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="w-full bg-black hover:bg-neutral-800 text-white rounded-full py-6 text-sm font-bold"
                  >
                    Add to Cart - ${selectedProduct.price}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
