import apiClient from "./apiClient";
import type { PassportResponse } from "../types/passport";

// Requires auth - apiClient's interceptor attaches the bearer token, and
// the API derives the current user from it (see PassportController).
export const passportService = {
  getMine: () =>
    apiClient.get<PassportResponse>("/passport").then((res) => res.data),
};
