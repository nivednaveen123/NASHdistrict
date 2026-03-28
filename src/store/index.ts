import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  price: number
  images: string[]
  category: string
  sizes: string[]
  colors?: string[]
  isNew?: boolean
  isFeatured?: boolean
  stock?: number
}

export interface CartItem {
  product: Product
  size: string
  quantity: number
}

interface StoreState {
  cart: CartItem[]
  wishlist: string[]
  sessionId: string
  
  // Cart actions
  addToCart: (product: Product, size: string) => void
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  
  // Wishlist actions
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      sessionId: '',
      
      addToCart: (product, size) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id && item.size === size
          )
          
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          
          return {
            cart: [...state.cart, { product, size, quantity: 1 }],
          }
        })
      },
      
      removeFromCart: (productId, size) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.product.id === productId && item.size === size)
          ),
        }))
      },
      
      updateQuantity: (productId, size, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        }))
      },
      
      clearCart: () => set({ cart: [] }),
      
      getCartTotal: () => {
        const state = get()
        return state.cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },
      
      getCartCount: () => {
        const state = get()
        return state.cart.reduce((count, item) => count + item.quantity, 0)
      },
      
      addToWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist
            : [...state.wishlist, productId],
        }))
      },
      
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        }))
      },
      
      isInWishlist: (productId) => {
        const state = get()
        return state.wishlist.includes(productId)
      },
    }),
    {
      name: 'clothing-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
)
