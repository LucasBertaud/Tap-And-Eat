import type { CategoryWithProducts } from "@/src/models";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchCategories,
  resetFilters,
  searchProducts,
  selectCategory,
} from "@/src/store/slices/menuSlice";
import { useEffect } from "react";

class MenuViewModel {
  constructor(
    private dispatch: any,
    private state: {
      categories: CategoryWithProducts[];
      filteredCategories: CategoryWithProducts[];
      selectedCategoryId: string | null;
      searchQuery: string;
      isLoading: boolean;
      error: string | null;
    }
  ) {}

  loadMenu(): void {
    if (this.state.categories.length === 0) {
      this.dispatch(fetchCategories());
    }
  }

  /**
   * Filtre les produits par catégorie
   */
  filterByCategory(categoryId: string | null): void {
    this.dispatch(selectCategory(categoryId));
  }

  /**
   * Recherche de produits par nom
   */
  searchProducts(query: string): void {
    this.dispatch(searchProducts(query));
  }

  resetFilters(): void {
    this.dispatch(resetFilters());
  }

  reload(): void {
    this.dispatch(fetchCategories());
  }

  get categories(): CategoryWithProducts[] {
    return this.state.categories;
  }

  get filteredCategories(): CategoryWithProducts[] {
    return this.state.filteredCategories;
  }

  get selectedCategoryId(): string | null {
    return this.state.selectedCategoryId;
  }

  get searchQuery(): string {
    return this.state.searchQuery;
  }

  get isLoading(): boolean {
    return this.state.isLoading;
  }

  get error(): string | null {
    return this.state.error;
  }
}

export function useMenuViewModel() {
  const dispatch = useAppDispatch();
  const menuState = useAppSelector((state) => state.menu);

  const viewModel = new MenuViewModel(dispatch, menuState);

  useEffect(() => {
    viewModel.loadMenu();
  }, []);

  return {
    viewModel,
    categories: viewModel.categories,
    filteredCategories: viewModel.filteredCategories,
    selectedCategoryId: viewModel.selectedCategoryId,
    searchQuery: viewModel.searchQuery,
    isLoading: viewModel.isLoading,
    error: viewModel.error,
    filterByCategory: (categoryId: string | null) =>
      viewModel.filterByCategory(categoryId),
    searchProducts: (query: string) => viewModel.searchProducts(query),
    resetFilters: () => viewModel.resetFilters(),
    reload: () => viewModel.reload(),
  };
}

export default useMenuViewModel;
