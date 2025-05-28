import { configureStore } from "@reduxjs/toolkit";
import { tiresReducer } from "./tire/slice";

export const store = configureStore({
  reducer: {
    tire: tiresReducer,
    // filter,
  },
});
