import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchCategories,
  resetFilters,
  searchProducts,
  selectCategory,
} from "@/src/store/slices/menuSlice";
import { useEffect } from "react";

/**
 * Hook personnalisé pour accéder au state Redux du menu
 */
export function useMenu() {
  const dispatch = useAppDispatch();
  const {
    categories,
    filteredCategories,
    selectedCategoryId,
    searchQuery,
    isLoading,
    error,
  } = useAppSelector((state) => state.menu);

  // Charger les catégories au montage
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  return {
    // State
    categories,
    filteredCategories,
    selectedCategoryId,
    searchQuery,
    isLoading,
    error,

    // Actions
    filterByCategory: (categoryId: string | null) => {
      dispatch(selectCategory(categoryId));
    },
    searchProducts: (query: string) => {
      dispatch(searchProducts(query));
    },
    resetFilters: () => {
      dispatch(resetFilters());
    },
    reload: () => {
      dispatch(fetchCategories());
    },
  };
}
