import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import cartItems, { type CartItem } from '../../constants/cartItems'

type CartState = {
  cartItems: CartItem[]
  amount: number
  total: number
}

const getTotals = (items: CartItem[]) =>
  items.reduce(
    (acc, item) => {
      acc.amount += item.amount
      acc.total += Number(item.price) * item.amount
      return acc
    },
    { amount: 0, total: 0 },
  )

const totals = getTotals(cartItems)

const initialState: CartState = {
  cartItems,
  amount: totals.amount,
  total: totals.total,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)

      if (item) {
        item.amount += 1
      }
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)

      if (!item) {
        return
      }

      if (item.amount === 1) {
        state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload)
        return
      }

      item.amount -= 1
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload)
    },
    clearCart: (state) => {
      state.cartItems = []
      state.amount = 0
      state.total = 0
    },
    calculateTotals: (state) => {
      const totals = getTotals(state.cartItems)
      state.amount = totals.amount
      state.total = totals.total
    },
  },
})

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions

export default cartSlice.reducer
