// Mirrors PaddleThroughLychnidos.Application.User.Commands.LoginRequest.
export interface LoginRequest {
  username: string;
  password: string;
}

// Mirrors PaddleThroughLychnidos.Application.User.Commands.RegisterRequest.
// `role` is the string name of the UserRole enum ("RegularUser" | "Artisan")
// - matches how AuthResponse.role and the JWT role claim are already typed.
export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  role: "RegularUser" | "Artisan";
}

// Mirrors the shape shared by LoginResponse and RegisterResponse
// (PaddleThroughLychnidos.Application.User.Commands). `role` is the string
// name of the UserRole enum (User.Role.ToString()), not the numeric value
// used elsewhere in the API - the enum is only serialized as an int on
// entities like User that go through the default JSON serializer.
export interface AuthResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  token: string;
}

// Shape of the custom claims embedded in the JWT payload, as written by
// AuthService.GenerateToken. JwtSecurityTokenHandler maps
// ClaimTypes.Role to the short claim name "role" in the raw token payload.
export interface DecodedAuthToken {
  sub: string;
  unique_name: string;
  role: string;
  exp: number;
  iss?: string;
  aud?: string;
}
