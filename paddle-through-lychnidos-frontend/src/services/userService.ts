import apiClient from "./apiClient";
import type { UserEditResponse, UserProfile } from "../types";

export interface EditProfileParams {
  name: string;
  username: string;
  email: string;
}

// Requires auth - apiClient's interceptor attaches the bearer token, and
// the API derives the current user from it (see UsersController).
export const userService = {
  getMe: () =>
    apiClient.get<UserProfile>("/users/me").then((res) => res.data),
  updateMe: (params: EditProfileParams) =>
    apiClient
      .put<UserEditResponse>("/users/me", params)
      .then((res) => res.data),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient
      .put<{ message: string }>("/users/me/password", {
        currentPassword,
        newPassword,
      })
      .then((res) => res.data),
};
