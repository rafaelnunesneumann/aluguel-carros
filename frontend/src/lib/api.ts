import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        // ignore malformed stored value
      }
    }
  }
  return config;
});

// Redirect to /login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
