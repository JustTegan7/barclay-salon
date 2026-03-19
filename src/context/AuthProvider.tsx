import { useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { apiPost } from "../api/client";
import { AuthContext } from "./AuthContext";
import type { AuthUser, LoginResult } from "./authTypes";

const INACTIVITY_MS = 5 * 60 * 1000;
const WARNING_BEFORE_MS = 60 * 1000;
const TIMEOUT_MS = INACTIVITY_MS - WARNING_BEFORE_MS;
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem("barclay_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("barclay_token"),
  );

  const [warningVisible, setWarningVisible] = useState(false);

  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    warningTimer.current = null;
    logoutTimer.current = null;
  }, []);

  const logout = useCallback(() => {
    clearTimers();
    sessionStorage.removeItem("barclay_token");
    sessionStorage.removeItem("barclay_user");
    setToken(null);
    setUser(null);
    setWarningVisible(false);
  }, [clearTimers]);

  const resetTimers = useCallback(() => {
    clearTimers();
    setWarningVisible(false);

    warningTimer.current = setTimeout(() => {
      setWarningVisible(true);
      logoutTimer.current = setTimeout(() => {
        logout();
      }, WARNING_BEFORE_MS);
    }, TIMEOUT_MS);
  }, [clearTimers, logout]);

  const extendSession = useCallback(() => {
    setWarningVisible(false);
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    if (!user) return;
    resetTimers();
    const handleActivity = () => resetTimers();
    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, handleActivity, { passive: true }),
    );
    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((e) =>
        window.removeEventListener(e, handleActivity),
      );
    };
  }, [user, resetTimers, clearTimers]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      try {
        const res = await apiPost<{
          ok: boolean;
          token: string;
          user: AuthUser;
        }>("/api/auth/login", { email, password });

        if (!res.ok) return { ok: false, error: "Invalid credentials" };

        sessionStorage.setItem("barclay_token", res.token);
        sessionStorage.setItem("barclay_user", JSON.stringify(res.user));
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

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin: user?.role === "ADMIN" || user?.role === "OWNER",
        isOwner: user?.role === "OWNER",
        warningVisible,
        extendSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
