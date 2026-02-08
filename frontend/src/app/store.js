import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import tasksReducer from "../features/tasksSlice.js";
import listsReducer from "../features/listsSlice.js";
import uiReducer from "../features/uiSlice.js";
import remindersReducer from "../features/remindersSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    lists: listsReducer,
    ui: uiReducer,
    reminders: remindersReducer
  }
});
