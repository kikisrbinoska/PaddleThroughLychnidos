import apiClient from "./apiClient";
import type { Category } from "../types";

export const categoryService = {
  getAll: () =>
    apiClient.get<Category[]>("/categories").then((res) => res.data),
  getById: (id: number) =>
    apiClient.get<Category>(`/categories/${id}`).then((res) => res.data),
};
