import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../app/api.js";

const initialState = {
  items: [],
  total: 0,
  status: "idle",
  error: null,
  currentView: "all"
};

export const fetchTasks = createAsyncThunk("tasks/fetch", async (params = {}) => {
  const res = await api.get("/tasks", { params });
  return res.data;
});

export const createTask = createAsyncThunk("tasks/create", async (payload) => {
  const res = await api.post("/tasks", payload);
  return res.data;
});

export const updateTask = createAsyncThunk("tasks/update", async ({ id, data }) => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setView(state, action) {
      state.currentView = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.status = "succeeded";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload.id);
      })
      .addMatcher(
        (action) => action.type.startsWith("tasks/") && action.type.endsWith("pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("tasks/") && action.type.endsWith("rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  }
});

export const { setView } = tasksSlice.actions;
export default tasksSlice.reducer;
