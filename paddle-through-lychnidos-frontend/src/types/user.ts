// Mirrors PaddleThroughLychnidos.Domain.Entities.UserRole.
// No JsonStringEnumConverter is registered in the API, so System.Text.Json
// serializes this enum as its underlying int value.
export const UserRole = {
  RegularUser: 0,
  Administrator: 1,
  Artisan: 2,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Mirrors PaddleThroughLychnidos.Application.User.Queries.GetByIdResponse,
// returned by GET /api/users/me.
export interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Mirrors PaddleThroughLychnidos.Application.User.Commands.EditResponse,
// returned by PUT /api/users/me.
export interface UserEditResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  message: string;
}
