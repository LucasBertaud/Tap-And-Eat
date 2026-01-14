import type { Product } from "./Menu";

export interface SelectedOption {
  optionId: string;
  optionGroupId: string;
  name: string;
  priceModifier: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedOptions: SelectedOption[];
  quantity: number;
  notes?: string;
}

export interface CartState {
  items: CartItem[];
  lastUpdated: string | null;
}

export function calculateItemPrice(item: CartItem): number {
  const optionsTotal = item.selectedOptions.reduce(
    (sum, opt) => sum + opt.priceModifier,
    0
  );
  return item.product.base_price + optionsTotal;
}

export function calculateItemTotal(item: CartItem): number {
  return calculateItemPrice(item) * item.quantity;
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}
