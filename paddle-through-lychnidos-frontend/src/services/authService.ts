import apiClient from "./apiClient";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

export const authService = {
  login: (credentials: LoginRequest) =>
    apiClient
      .post<AuthResponse>("/auth/login", credentials)
      .then((res) => res.data),
  register: (data: RegisterRequest) =>
    apiClient
      .post<AuthResponse>("/auth/register", data)
      .then((res) => res.data),
  // NOTE: POST /api/auth/forgot-password does not exist on the backend yet.
  // Confirm the exact route/request shape before relying on this in production.
  forgotPassword: (email: string) =>
    apiClient.post<void>("/auth/forgot-password", { email }).then(() => undefined),
};
