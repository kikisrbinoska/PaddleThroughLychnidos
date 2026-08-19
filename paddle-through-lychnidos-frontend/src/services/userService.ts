import apiClient from "./apiClient";
import type { User } from "../types";

export const userService = {
  getById: (id: number) =>
    apiClient.get<User>(`/users/${id}`).then((res) => res.data),
};
