import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://100.127.64.22:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token หมดอายุ หรือ Invalid
//       // ลบ token และ user ออกจาก localStorage
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("user");

//       // redirect ไปหน้า login (หรือ dispatch action logout ถ้าใช้ Redux)
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
