import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchCategories,
  resetFilters,
  searchProducts,
  selectCategory,
} from "@/src/store/slices/menuSlice";
import { useEffect } from "react";

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

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  return {
    categories,
    filteredCategories,
    selectedCategoryId,
    searchQuery,
    isLoading,
    error,

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
