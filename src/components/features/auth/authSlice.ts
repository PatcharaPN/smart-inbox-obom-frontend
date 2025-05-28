// authSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

const userFromStorage = localStorage.getItem("user");
interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!userFromStorage,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  loading: false,
  error: null,
};

// 🎯 Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        credentials
      );
      console.log("Response Data:", response.data);
      const { token, user } = response.data.data;
      console.log("Token:", token);
      console.log("User:", user);

      // บันทึกข้อมูล
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (err: any) {
      console.error("Login Error:", err); // ตรวจสอบ error
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// 🎯 Async thunk for logout (ตัวอย่างเบาๆ)
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  // ลบข้อมูลจาก localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Optional: ส่งคำขอ logout ไปยัง backend (ถ้าจำเป็น)
  // await axios.post("/api/logout");

  // คุณอาจจะสามารถคืนค่าอะไรบางอย่างได้ถ้าต้องการ
  return;
});
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
