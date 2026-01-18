import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/axios";
import { Order } from "@/lib/types";

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const { data } = await apiClient.get<Order[]>("/orders");
  return data;
});

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }: { id: number; status: string }) => {
    const { data } = await apiClient.patch<Order>(`/orders/${id}`, { status });
    return data;
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id: number) => {
    await apiClient.delete(`/orders/${id}`);
    return id;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(o => o.id !== action.payload);
      });
  },
});

export default ordersSlice.reducer;
