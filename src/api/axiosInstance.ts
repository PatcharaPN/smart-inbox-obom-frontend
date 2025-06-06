// src/axiosInstance.ts (หรือไฟล์ที่คุณกำหนด axios instance)
import axios from "axios";

// สร้าง axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // ตั้งค่า base URL ให้ตรงกับ API
  headers: {
    "Content-Type": "application/json", // ตั้งค่า content type เป็น JSON
  },
});

// Interceptor เพื่อเพิ่ม Authorization header ทุกครั้งที่ทำการ request
axiosInstance.interceptors.request.use(
  (config) => {
    // ดึง token จาก localStorage
    const token = localStorage.getItem("accessToken");

    // ถ้ามี token ให้แนบไปใน headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // คืนค่า config ที่ถูกแก้ไข
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
