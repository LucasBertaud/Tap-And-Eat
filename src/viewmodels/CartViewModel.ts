import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  clearCart,
  removeFromCart,
  selectCartItemCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "@/src/store/slices/cartSlice";
import { useCallback } from "react";

export const useCartViewModel = () => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const totalPrice = useAppSelector(selectCartTotal);

  const handleIncreaseQuantity = useCallback(
    (itemId: string) => {
      const item = cartItems.find((i) => i.id === itemId);
      if (item) {
        dispatch(updateQuantity({ itemId, quantity: item.quantity + 1 }));
      }
    },
    [cartItems, dispatch]
  );

  const handleDecreaseQuantity = useCallback(
    (itemId: string) => {
      const item = cartItems.find((i) => i.id === itemId);
      if (item) {
        if (item.quantity === 1) {
          dispatch(removeFromCart(itemId));
        } else {
          dispatch(updateQuantity({ itemId, quantity: item.quantity - 1 }));
        }
      }
    },
    [cartItems, dispatch]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      dispatch(removeFromCart(itemId));
    },
    [dispatch]
  );

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const isEmpty = itemCount === 0;

  return {
    cartItems,
    itemCount,
    totalPrice,
    isEmpty,

    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart,
  };
};
