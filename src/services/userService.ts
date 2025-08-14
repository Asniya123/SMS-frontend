import Cookies from "js-cookie";
import API from "../api/studentInstance";
import { AxiosError } from "axios";

const COOKIE_EXPIRY_DAYS = 7;

export async function loginUser(email: string, password: string): Promise<{
    userId: string | null;
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    try {
        console.log("Sending request with:", { email, password });
        const response = await API.post("/login", { email, password });
        console.log("Login successful:", response.data);
        return {
            userId: response.data.userId || null,
            accessToken: response.data.accessToken || null,
            refreshToken: response.data.refreshToken || null,
          };
        } catch (error: any) {
          console.error("Login error:", error.response?.data || error.message);
          throw new Error(error.response?.data?.message || "Login failed. Please try again.");
        }
};