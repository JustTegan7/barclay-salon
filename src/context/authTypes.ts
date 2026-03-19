export type Role = "HAIRDRESSER" | "OWNER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
}

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isAdmin: boolean;
  isOwner: boolean;
  warningVisible: boolean;
  extendSession: () => void;
}
