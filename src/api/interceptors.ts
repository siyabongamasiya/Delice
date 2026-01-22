import * as SecureStore from "expo-secure-store";
import client from "./client";

// Helper to get token from SecureStore
async function getToken() {
  return await SecureStore.getItemAsync("token");
}

// Request interceptor: attach JWT
client.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // TODO: Implement token refresh logic here
      // If refresh fails, logout user
    }
    // Optionally handle 400/422/5xx errors here
    return Promise.reject(error);
  },
);

export default client;
