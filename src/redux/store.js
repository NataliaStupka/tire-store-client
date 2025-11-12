import { configureStore } from "@reduxjs/toolkit";
import { tiresReducer } from "./tire/slice";
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

const tirePersistConfig = {
  key: "tire",
  storage,
  whitelist: ["favoriteTires"], // зберігаємо тільки обране
};
const persistedTireReducer = persistReducer(tirePersistConfig, tiresReducer);
// ---

export const store = configureStore({
  reducer: {
    tire: persistedTireReducer,
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
