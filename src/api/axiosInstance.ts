import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest.retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/refresh");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
