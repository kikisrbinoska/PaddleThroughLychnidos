import { isAxiosError } from "axios";

// The API's ExceptionHandlingMiddleware returns either a ProblemDetails-like
// body with `Detail` (custom errors) or `Title` (validation failures), with
// PascalCase keys since it's written via WriteAsJsonAsync outside the
// controller pipeline's camelCase JSON options.
export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { Detail?: string; Title?: string; detail?: string; title?: string }
      | undefined;
    return data?.Detail ?? data?.Title ?? data?.detail ?? data?.title ?? fallback;
  }
  return fallback;
}
