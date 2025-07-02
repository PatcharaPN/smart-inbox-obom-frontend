import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

const userFromStorage = localStorage.getItem("user");
const tokenFromStorage = localStorage.getItem("accessToken");

// function isTokenExpired(token: string): boolean {
//   if (!token) return true;
//   try {
//     const payloadBase64 = token.split(".")[1];
//     const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
//     const payloadJson = atob(base64);
//     const payload = JSON.parse(payloadJson);
//     const now = Math.floor(Date.now() / 1000);
//     return now >= payload.exp;
//   } catch {
//     return true;
//   }
// }

// const isExpired = tokenFromStorage ? isTokenExpired(tokenFromStorage) : true;

// if (isExpired) {
//   localStorage.removeItem("accessToken");
//   localStorage.removeItem("user");
// }

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  profilePic: string;
  categories: string;
  phoneNumber: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!userFromStorage && !!tokenFromStorage,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: tokenFromStorage || null,
  loading: false,
  error: null,
};
export interface RecentUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.post("auth/login", { email, password });
      const { user, token } = res.data.data;
      console.log(res.data.data);
      localStorage.setItem("accessToken", token);
      const recentUser = {
        id: user._id,
        email: user.email,
        displayName: `${user.name} ${user.surname}`,
        avatarUrl: user.profilePic,
      };
      const existing: RecentUser[] = JSON.parse(
        localStorage.getItem("recentUsers") || "[]"
      );
      const updated = [
        recentUser,
        ...existing
          .filter((u: RecentUser) => u.email !== recentUser.email)
          .slice(0, 5),
      ];
      localStorage.setItem("recentUsers", JSON.stringify(updated));
      // localStorage.setItem("recentUser", res.data.data);
      return res.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
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
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("accessToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
