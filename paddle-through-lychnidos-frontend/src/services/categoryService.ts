import apiClient from "./apiClient";
import type { AdminCategory, Category } from "../types";

export interface CategoryFields {
  name: string;
  iconUrl: string;
}

export const categoryService = {
  getAll: () =>
    apiClient.get<Category[]>("/categories").then((res) => res.data),
  getById: (id: number) =>
    apiClient.get<Category>(`/categories/${id}`).then((res) => res.data),

  // Admin-only below - apiClient's interceptor attaches the bearer token,
  // and the API requires the Administrator role. See CategoriesController.
  getAllForAdmin: () =>
    apiClient
      .get<AdminCategory[]>("/categories/admin")
      .then((res) => res.data),
  create: (fields: CategoryFields) =>
    apiClient
      .post<{ id: number; message: string }>("/categories", fields)
      .then((res) => res.data),
  update: (id: number, fields: CategoryFields) =>
    apiClient
      .put<{ id: number; message: string }>(`/categories/${id}`, fields)
      .then((res) => res.data),
  remove: (id: number) =>
    apiClient
      .delete<{ id: number; message: string }>(`/categories/${id}`)
      .then((res) => res.data),
};
