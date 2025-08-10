import axios from "axios";
import { showToast } from "@/components/common/toast";
import userStorage from "@/stores/userLocalStorage";
import PageUrls from "@/utilities/constants/common/pageUrls";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor để đính kèm access token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const accessToken = userStorage.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  async (error) => {
    await Promise.reject(new Error(error.message || "Request error"));
  },
);
let isTokenExpiredToastShown = false;

// Response interceptor để xử lý khi access token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { clearToken } = userStorage.getState();
      // if (refreshToken) {
      //   try {
      //     const { data } = await api.post<IBaseResponse<{ accessToken: string }>>("/auth/refresh-token", {
      //       refreshToken,
      //     });
      //     const newAccessToken = data.data.accessToken;
      //     setAccessToken(newAccessToken);
      //     setRefreshToken(refreshToken);
      //     originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      //     return api(originalRequest);
      //   } catch (err) {
      //     clearToken();
      //     window.location.href = "/login";
      //   }
      // }
      if (!isTokenExpiredToastShown) {
        isTokenExpiredToastShown = true;
        showToast({
          title: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          bgColor: "error",
          focus: "medium",
          size: "medium",
        });
        clearToken();
        window.location.href = PageUrls.AUTHENTICATION.LOGIN;
        setTimeout(() => {
          isTokenExpiredToastShown = false;
        }, 3000);
      }
    }
    await Promise.reject(new Error(error.message || "Response error"));
  },
);

export default api;
