import { supabase } from "@/src/lib/supabase";
import type {
  Category,
  CategoryWithProducts,
  Product,
  ProductWithOptions,
} from "@/src/models";

/**
 * MenuService - Gère les appels API pour le menu
 */
export class MenuService {
  /**
   * Récupère toutes les catégories actives
   */
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

  /**
   * Récupère tous les produits disponibles d'une catégorie
   */
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

  /**
   * Récupère toutes les catégories avec leurs produits
   */
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

    // Filtrer les produits disponibles et trier après récupération
    const categoriesWithProducts = (data || []).map((category) => ({
      ...category,
      products: (category.products || [])
        .filter((product: any) => product.is_available)
        .sort((a: any, b: any) => a.display_order - b.display_order),
    }));

    return categoriesWithProducts as CategoryWithProducts[];
  }

  /**
   * Récupère un produit avec ses options
   */
  async getProductWithOptions(
    productId: string
  ): Promise<ProductWithOptions | null> {
    // Récupère le produit
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      console.error("Error fetching product:", productError);
      return null;
    }

    // Récupère les groupes d'options liés au produit
    const { data: productOptionGroups, error: pogError } = await supabase
      .from("product_option_groups")
      .select("option_group_id, display_order")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (pogError || !productOptionGroups) {
      return product as ProductWithOptions;
    }

    // Récupère les détails des groupes d'options et leurs options
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

    // Récupère toutes les options pour ces groupes
    const { data: options, error: optionsError } = await supabase
      .from("options")
      .select("*")
      .in("option_group_id", optionGroupIds)
      .eq("is_available", true)
      .order("display_order", { ascending: true });

    if (optionsError) {
      return product as ProductWithOptions;
    }

    // Associe les options à leurs groupes
    const optionGroupsWithOptions = optionGroups.map((og) => ({
      ...og,
      options: (options || []).filter((opt) => opt.option_group_id === og.id),
    }));

    // Trie les groupes selon l'ordre défini dans product_option_groups
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

  /**
   * Recherche de produits par nom
   */
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
