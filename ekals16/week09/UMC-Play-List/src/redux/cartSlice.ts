import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import cartItems, { type CartItem } from '../constants/cartItems'

type CartState = {
  cartItems: CartItem[]
  amount: number
  total: number
}

const getCartTotals = (items: CartItem[]) =>
  items.reduce(
    (acc, item) => {
      acc.amount += item.amount
      acc.total += Number(item.price) * item.amount
      return acc
    },
    { amount: 0, total: 0 },
  )

const updateTotals = (state: CartState) => {
  const totals = getCartTotals(state.cartItems)

  state.amount = totals.amount
  state.total = totals.total
}

const totals = getCartTotals(cartItems)

const initialState: CartState = {
  cartItems,
  amount: totals.amount,
  total: totals.total,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = []
      state.amount = 0
      state.total = 0
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload)
      updateTotals(state)
    },
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)

      if (item) {
        item.amount += 1
      }

      updateTotals(state)
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)

      if (item) {
        item.amount -= 1

        if (item.amount < 1) {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem.id !== action.payload,
          )
        }
      }

      updateTotals(state)
    },
    calculateTotals: (state) => {
      updateTotals(state)
    },
  },
})

export const { calculateTotals, clearCart, decrease, increase, removeItem } =
  cartSlice.actions

export default cartSlice.reducer
