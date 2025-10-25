// axios.defaults.baseURL = "https://tire-store-server.onrender.com";

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000" //бекенд локально
    : "https://tire-store-server.onrender.com"; // бекенд на Render

//працюємо через окремо створенний axios (уникаємо 'конфлікту')
export const tireApi = axios.create({
  // baseURL: "https://tire-store-server.onrender.com",
  baseURL: BASE_URL,
  withCredentials: true, // Дозволяє відправляти та отримувати кукі, забезпечить передачу кукі з фронтенду на бекенд.
});

console.log("🔧 👀 Environment check:", {
  MODE: import.meta.env.MODE, //"development" або "production"
  BASE_URL: BASE_URL,
});

//(збереження токену) приймає token
//в місця де логінемось/реєструємся
const setAuthHeader = (token) => {
  if (token) {
    tireApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log("setAuthHeader called with token:", token); // Детальний дебаг
  } else {
    console.warn("setAuthHeader called with no token");
  }
};

//при logout; очищаємо сторінку
const clearAuthHeader = () => {
  tireApi.defaults.headers.common.Authorization = "";
  console.log("clearAuthHeader called");
};

//REGISTER - Create a new user
//credential - дані входу //name, email, password
export const register = createAsyncThunk(
  "auth/register",
  async (credential, thunkAPI) => {
    try {
      const response = await tireApi.post("/auth/register", credential);

      setAuthHeader(response.data.token); //запам'ятовуємо token
      return response.data; // { user: { name, email, role }, token }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credential, thunkAPI) => {
    try {
      const response = await tireApi.post("/auth/login", credential); // //token, user: email. password = response.data
      setAuthHeader(response.data.data.accessToken); //запам'ятовуємо token (для виходу і т.д)
      console.log("Login-operations_response", response.data);

      return response.data; // { user: { name, email, role }, token }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//LOGOUT
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const userId = state.auth.user?._id; // Використовуй userId замість sessionId
    await tireApi.post("/auth/logout", { userId });
    clearAuthHeader(); //очищаємо header при виході
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }

  //   // 2
  //   try {
  //     await tireApi.post("/auth/logout");
  //     clearAuthHeader(); //очищаємо header при виході
  //   } catch (error) {
  //     return thunkAPI.rejectWithValue(error.message);
  //   }
});

//REFRESH
export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    //thunkAPI.getState() - поверне весь store(auth(isLoggedIn, token), user, ...)
    const savedToken = thunkAPI.getState().auth.token; //отримуємо рядок token
    console.log("Attempting refresh with saved token:", savedToken);

    if (!savedToken) {
      console.warn("⚠️ No token found in store");
      return thunkAPI.rejectWithValue("Token is not exist!");
    }

    try {
      // // Не ставимо старий токен у заголовок — бекенд сам прочитає refreshToken з cookie
      // setAuthHeader(savedToken); //може бути старим або простроченим.

      const { data } = await tireApi.post(
        "/auth/refresh",
        {},
        {
          withCredentials: true, // відправляємо кукі
        }
      );

      console.log("✅ Refresh response:", data);
      setAuthHeader(data.data.accessToken); // Оновлюємо заголовок із новим токеном (зберігаємо новий accessToken у axios)
      return data.data; // Повертаємо { accessToken, user }
    } catch (err) {
      console.error("❌ Refresh error:", err.response?.data || err.message);
      // return thunkAPI.rejectWithValue(err.message);
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// // === REFRESH === оновлення сторінки
// export const refreshUser = createAsyncThunk(
//   "auth/refresh",
//   async (_, thunkAPI) => {
//     //thunkAPI.getState() - поверне весь store(auth(isLoggedIn, token), user, ...)
//     const savedToken = thunkAPI.getState().auth.token; //отримуємо рядок token
//     console.log("Attempting refresh with saved token:", savedToken);
//     if (!savedToken) {
//       return thunkAPI.rejectWithValue("Token is not exist!");
//     }

//     try {
//       setAuthHeader(savedToken); // token
//       const { data } = await tireApi.get("/users/refresh"); //запит за токеном
//       console.log("Refresh response:", data);
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );
