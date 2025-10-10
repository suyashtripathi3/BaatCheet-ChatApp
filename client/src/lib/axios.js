import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    // import.meta.env.MODE === "development" ? "http://localhost:8080/api" : "/api",
    import.meta.env.MODE === "production" ? "https://baat-cheet-chat-app-backend.vercel.app/api" : "/api",
    withCredentials: true,
});
