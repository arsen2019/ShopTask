import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";


const apiClient: AxiosInstance = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, 
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;

export const api = {
  get: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.get<T>(url, config),

  post: <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.post<T>(url, data, config),

  put: <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.put<T>(url, data, config),

  delete: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.delete<T>(url, config),

  patch: <T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => apiClient.patch<T>(url, data, config),
};
