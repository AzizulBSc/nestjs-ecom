import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/axios";
import { Category } from "@/lib/types";

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const { data } = await apiClient.get<Category[]>("/categories");
    return data;
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData: any) => {
    const { data } = await apiClient.post<Category>(
      "/categories",
      categoryData
    );
    return data;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, data: categoryData }: { id: number; data: any }) => {
    const { data } = await apiClient.patch<Category>(
      `/categories/${id}`,
      categoryData
    );
    return data;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id: number) => {
    await apiClient.delete(`/categories/${id}`);
    return id;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          c => c.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          c => c.id !== action.payload
        );
      });
  },
});

export default categoriesSlice.reducer;
