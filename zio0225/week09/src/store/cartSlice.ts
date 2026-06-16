import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import cartItems from '../constants/cartItems'

export interface CartItem {
  id: string
  title: string
  singer: string
  price: string
  img: string
  amount: number
}

interface CartState {
  cartItems: CartItem[]
  amount: number
  total: number
}

const initialState: CartState = {
  cartItems,
  amount: 0,
  total: 0,
}

const updateTotals = (state: CartState) => {
  state.amount = state.cartItems.reduce((sum, item) => sum + item.amount, 0)
  state.total = state.cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.amount,
    0,
  )
}

updateTotals(initialState)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase(state, action: PayloadAction<string>) {
      const item = state.cartItems.find((item) => item.id === action.payload)
      if (item) {
        item.amount += 1
      }
    },
    decrease(state, action: PayloadAction<string>) {
      const item = state.cartItems.find((item) => item.id === action.payload)
      if (!item) return

      if (item.amount > 1) {
        item.amount -= 1
      } else {
        state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== action.payload)
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload)
    },
    clearCart(state) {
      state.cartItems = []
    },
    calculateTotals(state) {
      updateTotals(state)
    },
  },
})

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions
export default cartSlice.reducer
