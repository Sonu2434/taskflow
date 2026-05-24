import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';
import toast from 'react-hot-toast';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await projectService.getAll(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchProject = createAsyncThunk('projects/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await projectService.getOne(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createProject = createAsyncThunk('projects/create', async (data, { rejectWithValue }) => {
  try {
    const res = await projectService.create(data);
    toast.success('Project created!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await projectService.update(id, data);
    toast.success('Project updated!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, { rejectWithValue }) => {
  try {
    await projectService.delete(id);
    toast.success('Project deleted!');
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: { items: [], current: null, loading: false, error: null, pagination: {} },
  reducers: {
    clearCurrentProject: (state) => { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProject.pending, (state) => { state.loading = true; })
      .addCase(fetchProject.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.data; })
      .addCase(fetchProject.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createProject.fulfilled, (state, action) => { state.items.unshift(action.payload.data); })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.items.findIndex(p => p._id === action.payload.data._id);
        if (idx !== -1) state.items[idx] = action.payload.data;
        if (state.current?._id === action.payload.data._id) state.current = { ...state.current, ...action.payload.data };
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload);
      });
  }
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
