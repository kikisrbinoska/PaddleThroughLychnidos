import apiClient from "./apiClient";
import type { DayPlanCreateResponse, DayPlanListResponse } from "../types";

export interface CreateDayPlanParams {
  title: string;
  date: string;
  shopIds: number[];
}

// Requires auth - apiClient's interceptor attaches the bearer token, and
// the API derives the current user from it (see DayPlansController).
export const dayPlanService = {
  getAll: () =>
    apiClient.get<DayPlanListResponse>("/dayplans").then((res) => res.data),
  create: (params: CreateDayPlanParams) =>
    apiClient
      .post<DayPlanCreateResponse>("/dayplans", params)
      .then((res) => res.data),
  remove: (id: number) =>
    apiClient.delete(`/dayplans/${id}`).then((res) => res.data),
};
