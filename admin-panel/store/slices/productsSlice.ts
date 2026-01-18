import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/axios";
import { Product } from "@/lib/types";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const { data } = await apiClient.get<Product[]>("/products");
    return data;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: any) => {
    const { data } = await apiClient.post<Product>("/products", productData);
    return data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data: productData }: { id: number; data: any }) => {
    const { data } = await apiClient.patch<Product>(
      `/products/${id}`,
      productData
    );
    return data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number) => {
    await apiClient.delete(`/products/${id}`);
    return id;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
