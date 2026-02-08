import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../app/api.js";

const initialState = {
  items: [],
  status: "idle",
  error: null
};

export const fetchLists = createAsyncThunk("lists/fetch", async () => {
  const res = await api.get("/task-lists");
  return res.data;
});

export const createList = createAsyncThunk("lists/create", async (payload) => {
  const res = await api.post("/task-lists", payload);
  return res.data;
});

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith("lists/") && action.type.endsWith("pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("lists/") && action.type.endsWith("rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  }
});

export default listsSlice.reducer;
