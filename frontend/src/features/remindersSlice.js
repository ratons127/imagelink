import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../app/api.js";

const initialState = { items: [], status: "idle" };

export const fetchReminders = createAsyncThunk("reminders/fetch", async () => {
  const res = await api.get("/reminders");
  return res.data;
});

const remindersSlice = createSlice({
  name: "reminders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReminders.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = "succeeded";
    });
  }
});

export default remindersSlice.reducer;
