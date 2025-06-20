import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "https://tire-store-server.onrender.com";

export const fetchTiresBySize = createAsyncThunk(
  "filter/fetchTiresBySize",
  async (size, thunkAPI) => {
    try {
      //encodeURIComponent - захищає URL від помилок, якщо size містить пробіли чи інші символи
      const response = await axios.get(
        `/tires?size=${encodeURIComponent(size)}`
      );
      console.log("oper.size", response.data.data.data);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
