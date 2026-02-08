import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") || "light",
  drawerTask: null
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },
    openDrawer(state, action) {
      state.drawerTask = action.payload;
    },
    closeDrawer(state) {
      state.drawerTask = null;
    }
  }
});

export const { toggleTheme, openDrawer, closeDrawer } = uiSlice.actions;
export default uiSlice.reducer;
