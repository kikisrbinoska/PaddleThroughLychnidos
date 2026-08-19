import { createContext, useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { DecodedAuthToken, LoginRequest, RegisterRequest } from "../types/auth";
import { authService } from "../services/authService";
import { AUTH_TOKEN_STORAGE_KEY } from "../services/apiClient";

export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

function isTokenExpired(decoded: DecodedAuthToken): boolean {
  return decoded.exp * 1000 <= Date.now();
}

function userFromToken(
  token: string,
  fallback?: Partial<AuthUser>,
): AuthUser | null {
  try {
    const decoded = jwtDecode<DecodedAuthToken>(token);
    if (isTokenExpired(decoded)) {
      return null;
    }
    return {
      id: fallback?.id ?? Number(decoded.sub),
      name: fallback?.name ?? "",
      username: fallback?.username ?? decoded.unique_name,
      email: fallback?.email ?? "",
      role: fallback?.role ?? decoded.role,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    const restoredUser = userFromToken(storedToken);
    if (restoredUser) {
      setToken(storedToken);
      setUser(restoredUser);
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  async function login(credentials: LoginRequest) {
    const response = await authService.login(credentials);
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
    setToken(response.token);
    setUser({
      id: response.id,
      name: response.name,
      username: response.username,
      email: response.email,
      role: response.role,
    });
  }

  async function register(data: RegisterRequest) {
    const response = await authService.register(data);
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
    setToken(response.token);
    setUser({
      id: response.id,
      name: response.name,
      username: response.username,
      email: response.email,
      role: response.role,
    });
  }

  function logout() {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
