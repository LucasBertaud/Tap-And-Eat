import type { Product } from "./Menu";

/**
 * Option sélectionnée avec ses détails
 */
export interface SelectedOption {
  optionId: string;
  optionGroupId: string;
  name: string;
  priceModifier: number;
}

/**
 * Article dans le panier avec options personnalisées
 */
export interface CartItem {
  id: string; // ID unique pour l'article dans le panier
  product: Product;
  selectedOptions: SelectedOption[];
  quantity: number;
  notes?: string;
}

/**
 * État du panier
 */
export interface CartState {
  items: CartItem[];
  lastUpdated: string | null;
}

/**
 * Calcule le prix unitaire d'un article avec ses options
 */
export function calculateItemPrice(item: CartItem): number {
  const optionsTotal = item.selectedOptions.reduce(
    (sum, opt) => sum + opt.priceModifier,
    0
  );
  return item.product.base_price + optionsTotal;
}

/**
 * Calcule le prix total d'un article (prix unitaire × quantité)
 */
export function calculateItemTotal(item: CartItem): number {
  return calculateItemPrice(item) * item.quantity;
}

/**
 * Calcule le total du panier
 */
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}
