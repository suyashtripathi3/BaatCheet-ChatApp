import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.NODE === "development" ? "http://localhost:8080/api" : "api/",
    withCredentials: true,
});
