import apiClient from "./apiClient";
import type {
  NewsItemCategory,
  NewsItemDetailResponse,
  NewsItemListResponse,
} from "../types/newsItem";

export interface NewsListParams {
  category?: NewsItemCategory;
  pageNumber?: number;
  pageSize?: number;
}

export const newsService = {
  getAll: (params: NewsListParams = {}) =>
    apiClient
      .get<NewsItemListResponse>("/news", { params })
      .then((res) => res.data),
  getById: (id: number) =>
    apiClient
      .get<NewsItemDetailResponse>(`/news/${id}`)
      .then((res) => res.data),
};
