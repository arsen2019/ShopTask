import { api } from "../client";
import type {
  AuthResponse,
  LoginCredentials,
  RegistrationData,
} from "../../types/api.types";

export const authApi = {
  register: async (data: RegistrationData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse, RegistrationData>(
      "/api/register",
      data
    );
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse, LoginCredentials>(
      "/api/login",
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post<void>("/api/logout");
  },

  getCurrentUser: async () => {
    const response = await api.get("/api/user");
    return response.data;
  },
};
