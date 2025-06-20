import { configureStore } from "@reduxjs/toolkit";
import { tiresReducer } from "./tire/slice";
import { filterReducer } from "./filter/slice";

export const store = configureStore({
  reducer: {
    tire: tiresReducer,
    filter: filterReducer,
  },
});
