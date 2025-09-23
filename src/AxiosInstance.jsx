import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo } from "react";

export function useAxiosInstance() {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_BASE_URL;

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: apiBaseUrl,
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          navigate("/");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [apiBaseUrl, navigate]);

  return axiosInstance;
}
