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
      if (currentSelections.includes(optionId)) {
        return {
          newSelections: {
            ...selectedOptions,
            [groupId]: currentSelections.filter((id) => id !== optionId),
          },
        };
      } else {
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
      return {
        newSelections: {
          ...selectedOptions,
          [groupId]: [optionId],
        },
      };
    }
  }

  calculateTotalPrice(
    product: ProductWithOptions,
    selectedOptions: Record<string, string[]>,
    quantity: number
  ): number {
    let price = product.base_price;

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
        return result.error;
      }

      setSelectedOptions(result.newSelections);
      return null;
    },
    [product, selectedOptions, viewModel]
  );

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    return viewModel.calculateTotalPrice(product, selectedOptions, quantity);
  }, [product, selectedOptions, quantity, viewModel]);

  const canAddToCart = useMemo(() => {
    if (!product) return false;
    return viewModel.validateRequiredOptions(product, selectedOptions);
  }, [product, selectedOptions, viewModel]);

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
