import { createAsyncThunk } from "@reduxjs/toolkit";

import { tireApi } from "../auth/operations.js";
import { updateFavoriteTire } from "../../redux/tire/slice.js";

// axios.defaults.baseURL = "https://tire-store-server.onrender.com";

//fetch All Tires
export const fetchAllTires = createAsyncThunk(
  "tire/fetchAllTires",
  async (_, thunkAPI) => {
    try {
      const response = await tireApi.get("/tires");
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//fetch Tires By Category
export const fetchTiresByCategory = createAsyncThunk(
  "tire/fetchTiresByCategory",
  async ({ category, page = 1, append = false }, thunkAPI) => {
    try {
      // thunkAPI.dispatch(clearTiresByCategory()); // Скидаємо стан перед новим запитом

      const perPage = thunkAPI.getState().tire.perPage; // 1️⃣ поточний state із slice, витягуємо perPage

      const response = await tireApi.get(
        `/tires?category=${category}&page=${page}&perPage=${perPage}`
      );
      console.log("☘️ response:", { ...response.data.data });
      return { ...response.data.data, append };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//fetch Tire By Id
export const fetchTiresById = createAsyncThunk(
  "tire/fetchTiresById",
  async (id, thunkAPI) => {
    try {
      // console.log("Fetching tire with id:", id); // Дебаґ
      const response = await tireApi.get(`/tires/${id}`);
      // console.log("Response data:", response.data); // Перевірка структури
      return response.data;
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//fetch Tires By Filter

//----- ADD --------- content-type: form-data
export const addTire = createAsyncThunk(
  "tire/addTire",
  // body = newTire ?
  async (formData, thunkAPI) => {
    try {
      console.log("Add tire request with headers:", tireApi.defaults.headers);
      const response = await tireApi.post(`/tires`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data; //??? return response.data
    } catch (err) {
      console.error("Add tire error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//----- DELETE -------
export const deleteTire = createAsyncThunk(
  "tire/deleteTire",
  async (id, thunkAPI) => {
    try {
      console.log(
        "DELETE operation for id:",
        id,
        "Headers:",
        tireApi.defaults.headers
      );
      const response = await tireApi.delete(`/tires/${id}`);
      return id;
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//----- EDIT -------
export const editTire = createAsyncThunk(
  "tire/editTire",
  async ({ id, formData }, thunkAPI) => {
    const { dispatch } = thunkAPI; // ✅ дістаємо dispatch із thunkAPI

    console.log(
      "Starting editTire for id:",
      id,
      "Headers:",
      tireApi.defaults.headers
    );

    try {
      const response = await tireApi.patch(`/tires/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Відповідь від бекенду:", response.data);

      const updatedTire = response.data.data?.tire; // ✅ оновлена шина (якщо бек повертає { data: {...} })
      if (updatedTire) {
        // console.log("🟢 Оновлюємо favoriteTires:", updatedTire._id);
        dispatch(updateFavoriteTire(updatedTire));
      }

      return response.data;
    } catch (err) {
      console.log("Помилка в editTire:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
