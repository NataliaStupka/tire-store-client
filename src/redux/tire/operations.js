import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "https://tire-store-server.onrender.com";

//fetch All Tires
export const fetchAllTires = createAsyncThunk(
  "tire/fetchAllTires",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/tires");
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//fetch Tires By Category
export const fetchTiresByCategory = createAsyncThunk(
  "tire/fetchTiresByCategory",
  async (category, thunkAPI) => {
    try {
      const response = await axios.get(`/tires?category=${category}`);
      return response.data.data;
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
      const response = await axios.get(`/tires/${id}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//fetch Tires By Filter

//----- ADD --------- content-type: form-data
//add tire
export const addTire = createAsyncThunk(
  "tire/addTire",
  // body = newTire ?
  async (formData, thunkAPI) => {
    try {
      console.log("ADD", formData);
      const response = await axios.post(`/tires`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Add_Tire???", formData);
      return response.data.data; //??? return response.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//----- DELETE -------
//delete tire
export const deleteTire = createAsyncThunk(
  "tire/deleteTire",
  async (id, thunkAPI) => {
    try {
      console.log("DELETE_operations!!", id);
      const response = await axios.delete(`/tires/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

//edit tire

// ===================== content-type: application / json;
// //add tire
// export const addTire = createAsyncThunk(
//   "tire/addTire",
//   // body = newTire ?
//   async (body, thunkAPI) => {
//     try {
//       console.log("ADD");
//       const response = await axios.post(`/tires`, body);
//       console.log("Add_Tire-body", body);
//       console.log("Add_Tire???", body);
//       return response.data.data; //??? return response.data
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );
