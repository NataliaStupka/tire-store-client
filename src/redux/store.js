import { configureStore } from "@reduxjs/toolkit";
import { catalogReducer } from "./catalog/slice";
import { filterReducer } from "./filter/slice";
import { authReducer } from "./auth/slice";

//-- persist
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Локальне сховище

const authPersistConfig = {
  key: "auth",
  version: 1,
  storage,
  whitelist: ["token", "user", "isLoggedIn"], //зберігаємо, для оновлення сторінки
};
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
// ---

const catalogPersistConfig = {
  key: "catalog",
  storage,
  whitelist: ["favoriteProducts"], // зберігаємо тільки обране
};
const persistedCatalogReducer = persistReducer(
  catalogPersistConfig,
  catalogReducer,
);
// ---

export const store = configureStore({
  reducer: {
    catalog: persistedCatalogReducer,
    filter: filterReducer,
    auth: persistedAuthReducer,
  },
  //--persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  //--
});

//--persist
export const persistor = persistStore(store);
