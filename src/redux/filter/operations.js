import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import { tireApi } from "../auth/operations";
// axios.defaults.baseURL = "https://tire-store-server.onrender.com";

export const fetchTiresBySize = createAsyncThunk(
  "filter/fetchTiresBySize",
  async ({ size, category, page = 1 }, thunkAPI) => {
    try {
      const perPage = thunkAPI.getState().filter.sizePerPage;

      const query = new URLSearchParams();
      if (size) query.append("size", size);
      if (category) query.append("category", category);
      if (page) query.append("page", page);
      if (perPage) query.append("perPage", perPage);

      //encodeURIComponent - захищає URL від помилок, якщо size містить пробіли чи інші символи
      const response = await tireApi.get(`/tires?${query.toString()}`);
      console.log("🍁 response-filter-size:", response.data.data);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
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
  }
);
