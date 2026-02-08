import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, setTokens } from "../app/api.js";

const initialState = {
  user: null,
  status: "idle",
  error: null
};

export const registerUser = createAsyncThunk("auth/register", async (payload) => {
  const res = await api.post("/auth/register", payload);
  setTokens(res.data);
  return res.data;
});

export const loginUser = createAsyncThunk("auth/login", async (payload) => {
  const res = await api.post("/auth/login", payload);
  setTokens(res.data);
  return res.data;
});

export const fetchMe = createAsyncThunk("auth/me", async () => {
  const res = await api.get("/users/me");
  return res.data;
});

export const updateMe = createAsyncThunk("auth/updateMe", async (payload) => {
  const res = await api.put("/users/me", payload);
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("fulfilled"),
        (state) => {
          state.status = "succeeded";
        }
      );
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
