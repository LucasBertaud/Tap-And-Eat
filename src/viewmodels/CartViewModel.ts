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

/**
 * CartViewModel - Gère la logique métier du panier
 * Architecture MVVM : extrait toute la logique de la vue
 */
export const useCartViewModel = () => {
  const dispatch = useAppDispatch();

  // Récupération des données du panier depuis Redux
  const cartItems = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const totalPrice = useAppSelector(selectCartTotal);

  /**
   * Augmenter la quantité d'un article
   */
  const handleIncreaseQuantity = useCallback(
    (itemId: string) => {
      const item = cartItems.find((i) => i.id === itemId);
      if (item) {
        dispatch(updateQuantity({ itemId, quantity: item.quantity + 1 }));
      }
    },
    [cartItems, dispatch]
  );

  /**
   * Diminuer la quantité d'un article (supprime si quantité = 1)
   */
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

  /**
   * Supprimer un article du panier
   */
  const handleRemoveItem = useCallback(
    (itemId: string) => {
      dispatch(removeFromCart(itemId));
    },
    [dispatch]
  );

  /**
   * Vider complètement le panier
   */
  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  // État dérivé : le panier est-il vide ?
  const isEmpty = itemCount === 0;

  return {
    // Données
    cartItems,
    itemCount,
    totalPrice,
    isEmpty,

    // Handlers
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleClearCart,
  };
};
