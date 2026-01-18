import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/axios";
import { User } from "@/lib/types";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const { data } = await apiClient.get<User[]>("/users");
  return data;
});

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: any) => {
    const { data } = await apiClient.post<User>("/users", userData);
    return data;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data: userData }: { id: number; data: any }) => {
    const { data } = await apiClient.patch<User>(`/users/${id}`, userData);
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number) => {
    await apiClient.delete(`/users/${id}`);
    return id;
  }
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
        state.users = action.payload;
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
