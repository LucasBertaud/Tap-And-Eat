import { supabase } from "@/src/lib/supabase";
import type {
  Category,
  CategoryWithProducts,
  Product,
  ProductWithOptions,
} from "@/src/models";

export class MenuService {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }

    return data || [];
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_available", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    return data || [];
  }

  async getCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        *,
        products!products_category_id_fkey (*)
      `
      )
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching categories with products:", error);
      throw error;
    }

    const categoriesWithProducts = (data || []).map((category) => ({
      ...category,
      products: (category.products || [])
        .filter((product: any) => product.is_available)
        .sort((a: any, b: any) => a.display_order - b.display_order),
    }));

    return categoriesWithProducts as CategoryWithProducts[];
  }

  async getProductWithOptions(
    productId: string
  ): Promise<ProductWithOptions | null> {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      console.error("Error fetching product:", productError);
      return null;
    }

    const { data: productOptionGroups, error: pogError } = await supabase
      .from("product_option_groups")
      .select("option_group_id, display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (pogError || !productOptionGroups) {
      return product as ProductWithOptions;
    }

    const optionGroupIds = productOptionGroups.map(
      (pog) => pog.option_group_id
    );

    const { data: optionGroups, error: ogError } = await supabase
      .from("option_groups")
      .select("*")
      .in("id", optionGroupIds);

    if (ogError || !optionGroups) {
      return product as ProductWithOptions;
    }

    const { data: options, error: optionsError } = await supabase
      .from("options")
      .select("*")
      .in("option_group_id", optionGroupIds)
      .eq("is_available", true)
      .order("display_order", { ascending: true });

    if (optionsError) {
      return product as ProductWithOptions;
    }

    const optionGroupsWithOptions = optionGroups.map((og) => ({
      ...og,
      options: (options || []).filter((opt) => opt.option_group_id === og.id),
    }));

    const sortedOptionGroups = optionGroupsWithOptions.sort((a, b) => {
      const orderA =
        productOptionGroups.find((pog) => pog.option_group_id === a.id)
          ?.display_order || 0;
      const orderB =
        productOptionGroups.find((pog) => pog.option_group_id === b.id)
          ?.display_order || 0;
      return orderA - orderB;
    });

    return {
      ...product,
      option_groups: sortedOptionGroups,
    } as ProductWithOptions;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_available", true)
      .ilike("name", `%${query}%`)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error searching products:", error);
      throw error;
    }

    return data || [];
  }
}

export const menuService = new MenuService();
