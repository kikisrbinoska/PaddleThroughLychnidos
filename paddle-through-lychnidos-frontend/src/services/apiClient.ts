import axios, { type InternalAxiosRequestConfig } from "axios";

export const AUTH_TOKEN_STORAGE_KEY = "authToken";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // The client-wide default above forces application/json, which Axios
  // does NOT override just because the body is FormData - it only
  // auto-sets multipart/form-data (with the required boundary) when no
  // Content-Type is already present. Without this, every multipart
  // upload (shop images, product images, verification documents) gets
  // sent as JSON and the API's [FromForm] parameters bind as empty.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
