import { createContext, useState, useCallback, ReactNode } from "react";
import { apiPost } from "../api/client";

export type Role = "HAIRDRESSER" | "OWNER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

interface LoginResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isAdmin: boolean;
  isOwner: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("barclay_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("barclay_token"),
  );

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      try {
        const res = await apiPost<{
          ok: boolean;
          token: string;
          user: AuthUser;
        }>("/api/auth/login", { email, password });

        if (!res.ok) return { ok: false, error: "Invalid credentials" };

        localStorage.setItem("barclay_token", res.token);
        localStorage.setItem("barclay_user", JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);

        return { ok: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Login failed";
        return { ok: false, error: message };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("barclay_token");
    localStorage.removeItem("barclay_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin: user?.role === "ADMIN" || user?.role === "OWNER",
        isOwner: user?.role === "OWNER",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
