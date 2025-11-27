/**
 * Models for Menu entities (Categories, Products, Options)
 */

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  ingredients: string[] | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface OptionGroup {
  id: string;
  name: string;
  description: string | null;
  is_required: boolean;
  allow_multiple: boolean;
  min_selections: number;
  max_selections: number | null;
  created_at: string;
}

export interface Option {
  id: string;
  option_group_id: string;
  name: string;
  price_modifier: number;
  is_available: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductOptionGroup {
  id: string;
  product_id: string;
  option_group_id: string;
  display_order: number;
}

export interface ProductWithOptions extends Product {
  option_groups?: (OptionGroup & { options: Option[] })[];
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}
