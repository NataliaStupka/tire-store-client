import { createAsyncThunk } from "@reduxjs/toolkit";

import { tireApi } from "../auth/operations.js";
import { updateFavoriteProduct } from "./slice.js";

// axios.defaults.baseURL = "https://tire-store-server.onrender.com";

//ОСНОВНИЙ fetch Products
export const fetchProducts = createAsyncThunk(
  "catalog/fetchProducts",
  async (
    {
      category = "",
      size = "",
      diameter = null,
      page = 1,
      perPage = 12,
      target = "CATEGORY", // target = "куди покласти результат"
    },
    thunkAPI,
  ) => {
    console.log(
      `"PARAMS": category-${category}, size${size}, page-${page}, perPage-${perPage}, target-${target}`,
    ); // {size: '15', category: 'rims'}
    try {
      const query = new URLSearchParams();

      if (category) query.append("category", category);
      if (size) query.append("size", size);
      if (diameter) query.append("diameter", diameter);
      if (page) query.append("page", page);
      if (perPage) query.append("perPage", perPage);

      const response = await tireApi.get(`/tires?${query.toString()}`);
      console.log("🔹 - response.data:", response.data);

      return {
        data: response.data.data, //response.data ???
        target,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

//fetch Product By Id
export const fetchProductById = createAsyncThunk(
  "catalog/fetchProductById",
  async (id, thunkAPI) => {
    try {
      // console.log("Fetching product with id:", id); // Дебаґ
      const response = await tireApi.get(`/tires/${id}`);
      // console.log("Response data:", response.data); // Перевірка структури
      return response.data;
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

export const fetchRimsDiameters = createAsyncThunk(
  "filter/fetchRimsDiameters",
  async (_, thunkAPI) => {
    try {
      const response = await tireApi.get("/tires/rims/sizes");
      return response.data.data; //[]
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

//----- ADD --------- content-type: form-data
export const addProduct = createAsyncThunk(
  "catalog/addProduct",
  // body = newproduct ?
  async (formData, thunkAPI) => {
    try {
      console.log(
        "Add product request with headers:",
        tireApi.defaults.headers,
      );
      const response = await tireApi.post(`/tires`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data; //??? return response.data
    } catch (err) {
      console.error("Add product error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

//----- DELETE -------
export const deleteProduct = createAsyncThunk(
  "catalog/deleteProduct",
  async (id, thunkAPI) => {
    try {
      console.log(
        "DELETE operation for id:",
        id,
        "Headers:",
        tireApi.defaults.headers,
      );
      const response = await tireApi.delete(`/tires/${id}`);
      return id;
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

//----- EDIT -------
export const editProduct = createAsyncThunk(
  "catalog/editProduct",
  async ({ id, formData }, thunkAPI) => {
    const { dispatch } = thunkAPI; // ✅ дістаємо dispatch із thunkAPI

    console.log(
      "Starting editProduct for id:",
      id,
      "Headers:",
      tireApi.defaults.headers,
    );

    try {
      const response = await tireApi.patch(`/tires/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Відповідь від бекенду:", response.data);

      // ??? тут response.data.data? назва tire чи productc⁉️
      const updatedProduct = response.data.data?.tire; // ✅ оновлена шина (якщо бек повертає { data: {...} })
      if (updatedProduct) {
        // console.log("🟢 Оновлюємо favoriteTires:", updatedProduct._id);
        dispatch(updateFavoriteProduct(updatedProduct));
      }

      return response.data;
    } catch (err) {
      console.log("Помилка в editProduct:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);
