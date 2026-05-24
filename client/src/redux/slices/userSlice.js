import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await userService.getAll(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateUserRole = createAsyncThunk('users/updateRole', async ({ id, role }, { rejectWithValue }) => {
  try {
    const res = await userService.updateRole(id, role);
    toast.success('Role updated!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try {
    await userService.delete(id);
    toast.success('User removed!');
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.items = action.payload.data; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.items.findIndex(u => u._id === action.payload.data._id);
        if (idx !== -1) state.items[idx] = action.payload.data;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.items = state.items.filter(u => u._id !== action.payload);
      });
  }
});

export default userSlice.reducer;
