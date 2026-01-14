import type {
  CartItem,
  CartState,
  Product,
  SelectedOption,
} from "@/src/models";
import { calculateCartTotal } from "@/src/models/Cart";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CartState = {
  items: [],
  lastUpdated: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        selectedOptions: SelectedOption[];
        quantity: number;
      }>
    ) => {
      const { product, selectedOptions, quantity } = action.payload;

      const existingItemIndex = state.items.findIndex((item) => {
        if (item.product.id !== product.id) return false;

        if (item.selectedOptions.length !== selectedOptions.length)
          return false;

        const itemOptionIds = item.selectedOptions
          .map((o) => o.optionId)
          .sort();
        const newOptionIds = selectedOptions.map((o) => o.optionId).sort();

        return itemOptionIds.every((id, index) => id === newOptionIds[index]);
      });

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          selectedOptions,
          quantity,
        };
        state.items.push(newItem);
      }

      state.lastUpdated = new Date().toISOString();
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((i) => i.id === itemId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== itemId);
        } else {
          item.quantity = quantity;
        }
        state.lastUpdated = new Date().toISOString();
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    clearCart: (state) => {
      state.items = [];
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state: { cart: CartState }) =>
  calculateCartTotal(state.cart.items);

export default cartSlice.reducer;
