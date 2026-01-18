import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/axios";
import { User } from "@/lib/types";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UsersState {
  users: User[];
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const { data } = await apiClient.get(`/users?${queryParams.toString()}`);
    return data;
  },
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: any) => {
    const { data } = await apiClient.post<User>("/users", userData);
    return data;
  },
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data: userData }: { id: number; data: any }) => {
    const { data } = await apiClient.patch<User>(`/users/${id}`, userData);
    return data;
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number) => {
    await apiClient.delete(`/users/${id}`);
    return id;
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
