import { create } from 'zustand'
import cartItems, { type CartItem } from '../constants/cartItems'

type PlaylistState = {
  cartItems: CartItem[]
  amount: number
  total: number
  isOpen: boolean
}

type PlaylistActions = {
  increase: (id: string) => void
  decrease: (id: string) => void
  removeItem: (id: string) => void
  clearCart: () => void
  calculateTotals: () => void
  openModal: () => void
  closeModal: () => void
}

type PlaylistStore = PlaylistState & PlaylistActions

const getCartTotals = (items: CartItem[]) =>
  items.reduce(
    (acc, item) => {
      acc.amount += item.amount
      acc.total += Number(item.price) * item.amount
      return acc
    },
    { amount: 0, total: 0 },
  )

const initialTotals = getCartTotals(cartItems)

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  cartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
  isOpen: false,

  increase: (id) => {
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      )
      const totals = getCartTotals(updatedCartItems)

      return {
        cartItems: updatedCartItems,
        amount: totals.amount,
        total: totals.total,
      }
    })
  },

  decrease: (id) => {
    set((state) => {
      const updatedCartItems = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item,
        )
        .filter((item) => item.amount > 0)
      const totals = getCartTotals(updatedCartItems)

      return {
        cartItems: updatedCartItems,
        amount: totals.amount,
        total: totals.total,
      }
    })
  },

  removeItem: (id) => {
    set((state) => {
      const updatedCartItems = state.cartItems.filter((item) => item.id !== id)
      const totals = getCartTotals(updatedCartItems)

      return {
        cartItems: updatedCartItems,
        amount: totals.amount,
        total: totals.total,
      }
    })
  },

  clearCart: () => {
    set({
      cartItems: [],
      amount: 0,
      total: 0,
      isOpen: false,
    })
  },

  calculateTotals: () => {
    const totals = getCartTotals(get().cartItems)

    set({
      amount: totals.amount,
      total: totals.total,
    })
  },

  openModal: () => {
    set({ isOpen: true })
  },

  closeModal: () => {
    set({ isOpen: false })
  },
}))
