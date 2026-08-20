import apiClient from "./apiClient";
import type {
  LearnVideoCategory,
  LearnVideoDetailResponse,
  LearnVideoListResponse,
} from "../types/learnVideo";

export interface LearnVideoListParams {
  category: LearnVideoCategory;
  pageNumber?: number;
  pageSize?: number;
}

export const learnService = {
  getVideos: (params: LearnVideoListParams) =>
    apiClient
      .get<LearnVideoListResponse>("/learn/videos", { params })
      .then((res) => res.data),
  getVideoById: (id: number) =>
    apiClient
      .get<LearnVideoDetailResponse>(`/learn/videos/${id}`)
      .then((res) => res.data),
};
