import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { USER_URL } from "../constant/url";

const API = axios.create({
  baseURL: USER_URL,
  withCredentials: true,
});

const getToken = () => Cookies.get("userToken");

const clearCookies = () => {
  Cookies.remove("userToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
};

API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await API.post(
      "/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        withCredentials: true,
      }
    );
    Cookies.set("userToken", response.data.accessToken, { path: "/" });
    return response.data.accessToken;
  } catch (error) {
    console.error("Refresh token request failed:", error);
    clearCookies();
    window.location.href = "/login";
    return null;
  }
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh for login endpoint
    if (originalRequest.url.includes("/login")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      }
    }

    if (error.response?.status === 403) {
      console.warn("User is blocked. Logging out...");
      toast.error("User is blocked");
      clearCookies();
      window.location.href = "/login";
      return Promise.reject(new Error("User is blocked"));
    }

    return Promise.reject(error);
  }
);

export default API;