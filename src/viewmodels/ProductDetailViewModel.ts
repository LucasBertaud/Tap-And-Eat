import type { ProductWithOptions, SelectedOption } from "@/src/models";
import { menuService } from "@/src/services";
import { useCallback, useEffect, useMemo, useState } from "react";

export class ProductDetailViewModel {
  async loadProductDetails(
    productId: string
  ): Promise<ProductWithOptions | null> {
    try {
      return await menuService.getProductWithOptions(productId);
    } catch (error) {
      console.error("Error loading product details:", error);
      throw error;
    }
  }

  /**
   * Gère la sélection/désélection d'une option
   */
  toggleOption(
    selectedOptions: Record<string, string[]>,
    groupId: string,
    optionId: string,
    product: ProductWithOptions
  ): { newSelections: Record<string, string[]>; error?: string } {
    const group = product.option_groups?.find((g) => g.id === groupId);
    if (!group) return { newSelections: selectedOptions };

    const currentSelections = selectedOptions[groupId] || [];

    if (group.allow_multiple) {
      // Sélection multiple
      if (currentSelections.includes(optionId)) {
        // Désélectionner
        return {
          newSelections: {
            ...selectedOptions,
            [groupId]: currentSelections.filter((id) => id !== optionId),
          },
        };
      } else {
        // Vérifier max_selections
        if (
          group.max_selections &&
          currentSelections.length >= group.max_selections
        ) {
          return {
            newSelections: selectedOptions,
            error: `Vous ne pouvez sélectionner que ${group.max_selections} option(s) maximum`,
          };
        }
        return {
          newSelections: {
            ...selectedOptions,
            [groupId]: [...currentSelections, optionId],
          },
        };
      }
    } else {
      // Sélection unique
      return {
        newSelections: {
          ...selectedOptions,
          [groupId]: [optionId],
        },
      };
    }
  }

  /**
   * Calcule le prix total avec options et quantité
   */
  calculateTotalPrice(
    product: ProductWithOptions,
    selectedOptions: Record<string, string[]>,
    quantity: number
  ): number {
    let price = product.base_price;

    // Ajouter les modificateurs de prix des options sélectionnées
    product.option_groups?.forEach((group) => {
      const groupSelections = selectedOptions[group.id] || [];
      groupSelections.forEach((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        if (option) {
          price += option.price_modifier;
        }
      });
    });

    return price * quantity;
  }

  /**
   * Valide que toutes les options requises sont sélectionnées
   */
  validateRequiredOptions(
    product: ProductWithOptions,
    selectedOptions: Record<string, string[]>
  ): boolean {
    if (!product.option_groups) return true;

    return product.option_groups.every((group) => {
      if (!group.is_required) return true;

      const selections = selectedOptions[group.id] || [];
      return (
        selections.length >= group.min_selections &&
        (group.max_selections === null ||
          selections.length <= group.max_selections)
      );
    });
  }

  /**
   * Convertit les sélections en liste de SelectedOption
   */
  buildSelectedOptionsList(
    product: ProductWithOptions,
    selectedOptions: Record<string, string[]>
  ): SelectedOption[] {
    const selectedOptionsList: SelectedOption[] = [];

    product.option_groups?.forEach((group) => {
      const groupSelections = selectedOptions[group.id] || [];
      groupSelections.forEach((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        if (option) {
          selectedOptionsList.push({
            optionId: option.id,
            optionGroupId: group.id,
            name: option.name,
            priceModifier: option.price_modifier,
          });
        }
      });
    });

    return selectedOptionsList;
  }
}

export function useProductDetailViewModel(productId: string) {
  const [product, setProduct] = useState<ProductWithOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});
  const [quantity, setQuantity] = useState(1);

  const viewModel = useMemo(() => new ProductDetailViewModel(), []);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await viewModel.loadProductDetails(productId);
        setProduct(data);
      } catch (err) {
        setError("Impossible de charger le produit");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId, viewModel]);

  const reload = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await viewModel.loadProductDetails(productId);
      setProduct(data);
    } catch (err) {
      setError("Impossible de charger le produit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la sélection d'options via ViewModel
  const handleOptionToggle = useCallback(
    (groupId: string, optionId: string) => {
      if (!product) return;

      const result = viewModel.toggleOption(
        selectedOptions,
        groupId,
        optionId,
        product
      );

      if (result.error) {
        // L'erreur sera gérée dans la View
        return result.error;
      }

      setSelectedOptions(result.newSelections);
      return null;
    },
    [product, selectedOptions, viewModel]
  );

  // Calcul du prix total via ViewModel
  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return viewModel.calculateTotalPrice(product, selectedOptions, quantity);
  }, [product, selectedOptions, quantity, viewModel]);

  // Validation via ViewModel
  const canAddToCart = useMemo(() => {
    if (!product) return false;
    return viewModel.validateRequiredOptions(product, selectedOptions);
  }, [product, selectedOptions, viewModel]);

  // Construction de la liste des options sélectionnées
  const getSelectedOptionsList = useCallback(() => {
    if (!product) return [];
    return viewModel.buildSelectedOptionsList(product, selectedOptions);
  }, [product, selectedOptions, viewModel]);

  return {
    product,
    loading,
    error,
    reload,
    selectedOptions,
    quantity,
    setQuantity,
    handleOptionToggle,
    totalPrice,
    canAddToCart,
    getSelectedOptionsList,
  };
}
