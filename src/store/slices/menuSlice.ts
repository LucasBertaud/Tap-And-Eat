import type { CategoryWithProducts } from "@/src/models";
import { menuService } from "@/src/services";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  categories: CategoryWithProducts[];
  filteredCategories: CategoryWithProducts[];
  selectedCategoryId: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  categories: [],
  filteredCategories: [],
  selectedCategoryId: null,
  searchQuery: "",
  isLoading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "menu/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await menuService.getCategoriesWithProducts();
      return categories;
    } catch (error: any) {
      return rejectWithValue(error.message || "Impossible de charger le menu");
    }
  }
);

const applyFilters = (state: MenuState) => {
  let filtered = state.categories;

  if (state.selectedCategoryId) {
    filtered = filtered.filter((cat) => cat.id === state.selectedCategoryId);
  }

  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered
      .map((category) => ({
        ...category,
        products: category.products.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.products.length > 0);
  }

  state.filteredCategories = filtered;
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    selectCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryId = action.payload;
      applyFilters(state);
    },
    searchProducts: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      applyFilters(state);
    },
    resetFilters: (state) => {
      state.selectedCategoryId = null;
      state.searchQuery = "";
      state.filteredCategories = state.categories;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.filteredCategories = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export const { selectCategory, searchProducts, resetFilters, clearError } =
  menuSlice.actions;
export default menuSlice.reducer;
