import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
import { tireApi } from "../auth/operations";
// axios.defaults.baseURL = "https://tire-store-server.onrender.com";

export const fetchTiresBySize = createAsyncThunk(
  "filter/fetchTiresBySize",
  async ({ size, category }, thunkAPI) => {
    try {
      const query = new URLSearchParams();
      if (size) query.append("size", size);
      if (category) query.append("category", category);

      //encodeURIComponent - захищає URL від помилок, якщо size містить пробіли чи інші символи
      const response = await tireApi.get(`/tires?${query.toString()}`);
      console.log("🟢 oper.size+category", response.data.data.data);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
