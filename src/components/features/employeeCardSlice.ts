import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;
interface EmployeeCard {
  _id: string;
  firstName: string;
  nickname: string;
  lastName: string;
  employeeId: string;
  department: string;
  note?: string;
  employeeType: string;
  imagePath: string;
  photo: File[];
  cardType: "horizontal" | "vertical";
}
export interface EmployeeCardState {
  cards: EmployeeCard[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeCardState = {
  cards: [],
  loading: false,
  error: null,
};
export const fetchEmployeeCards = createAsyncThunk(
  "employeeCard/fetchCards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/employee-card/cards`);
      return response.data.data as EmployeeCard[];
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch employee cards";
      return rejectWithValue(message);
    }
  }
);

const employeeCardSlice = createSlice({
  name: "employeeCard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchEmployeeCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default employeeCardSlice.reducer;
