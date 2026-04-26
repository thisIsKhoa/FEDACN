import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export type UserRole = "customer" | "staff" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: UserRole;
  branchId: string | null;
  branchName: string | null;
}

/* ── DEV: Mock users for quick role testing ── */
const DEV_MOCK_USERS: Record<UserRole, AuthUser> = {
  customer: {
    id: "dev-customer-001",
    email: "customer@dev.local",
    fullName: "Nguyễn Khách Hàng",
    avatarUrl: "",
    role: "customer",
    branchId: null,
    branchName: null,
  },
  staff: {
    id: "dev-staff-001",
    email: "staff@dev.local",
    fullName: "Trần Nhân Viên",
    avatarUrl: "",
    role: "staff",
    branchId: "branch-001",
    branchName: "WorkHub Quận 1",
  },
  admin: {
    id: "dev-admin-001",
    email: "admin@dev.local",
    fullName: "Lê Quản Trị",
    avatarUrl: "",
    role: "admin",
    branchId: null,
    branchName: null,
  },
};

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendStatus: "idle" | "ok" | "error";
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  verifyEmailCode: (email: string, code: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfileFromBackend: () => Promise<void>;
  /** DEV ONLY: Instantly log in as a specific role without authentication */
  devLoginAs: (role: UserRole) => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const ROLE_LIST: UserRole[] = ["customer", "staff", "admin"];

const AuthContext = createContext<AuthContextValue | null>(null);

const normalizeRole = (role: unknown): UserRole => {
  if (typeof role !== "string") {
    return "customer";
  }
  const normalized = role.toLowerCase();
  return ROLE_LIST.includes(normalized as UserRole)
    ? (normalized as UserRole)
    : "customer";
};

const mapSupabaseUser = (supabaseUser: User | null): AuthUser | null => {
  if (!supabaseUser) {
    return null;
  }

  const fullName =
    (supabaseUser.user_metadata?.full_name as string | undefined) ||
    (supabaseUser.user_metadata?.name as string | undefined) ||
    supabaseUser.email ||
    "User";

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    fullName,
    avatarUrl:
      (supabaseUser.user_metadata?.avatar_url as string | undefined) ?? "",
    role: normalizeRole(supabaseUser.app_metadata?.role),
    branchId:
      (supabaseUser.app_metadata?.branch_id as string | undefined) ?? null,
    branchName:
      (supabaseUser.app_metadata?.branch_name as string | undefined) ?? null,
  };
};

const fetchBackendProfile = async (
  accessToken: string,
): Promise<Partial<AuthUser> | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Record<string, unknown>;

    return {
      id: typeof data.id === "string" ? data.id : undefined,
      email: typeof data.email === "string" ? data.email : undefined,
      fullName: typeof data.fullName === "string" ? data.fullName : undefined,
      avatarUrl:
        typeof data.avatarUrl === "string" ? data.avatarUrl : undefined,
      role: normalizeRole(data.role),
      branchId: typeof data.branchId === "string" ? data.branchId : null,
      branchName: typeof data.branchName === "string" ? data.branchName : null,
    };
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<"idle" | "ok" | "error">(
    "idle",
  );

  const syncSession = useCallback(async (session: Session | null) => {
    const mappedUser = mapSupabaseUser(session?.user ?? null);
    setUser(mappedUser);

    if (!mappedUser || !session?.access_token) {
      setBackendStatus("idle");
      return;
    }

    const backendProfile = await fetchBackendProfile(session.access_token);
    if (!backendProfile) {
      setBackendStatus("error");
      return;
    }

    setBackendStatus("ok");
    setUser((prevUser) => {
      if (!prevUser) {
        return null;
      }
      return {
        ...prevUser,
        ...backendProfile,
        role: normalizeRole(backendProfile.role ?? prevUser.role),
      };
    });
  }, []);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (error) {
        setUser(null);
        setBackendStatus("error");
        setIsLoading(false);
        return;
      }

      await syncSession(data.session ?? null);
      if (active) {
        setIsLoading(false);
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncSession(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [syncSession]);

  const refreshProfileFromBackend = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.access_token) {
      return;
    }

    const backendProfile = await fetchBackendProfile(data.session.access_token);
    if (!backendProfile) {
      setBackendStatus("error");
      return;
    }

    setBackendStatus("ok");
    setUser((prevUser) => {
      if (!prevUser) {
        return null;
      }
      return {
        ...prevUser,
        ...backendProfile,
        role: normalizeRole(backendProfile.role ?? prevUser.role),
      };
    });
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured) {
      throw new Error("Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY.");
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      throw error;
    }
  }, []);

  const registerWithEmail = useCallback(async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY.");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }
  }, []);

  const verifyEmailCode = useCallback(async (email: string, code: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY.");
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    });

    if (error) {
      throw error;
    }
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY.");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  }, []);

  const resetPasswordForEmail = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      throw new Error("Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY.");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      void fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    setUser(null);
    setBackendStatus("idle");
  }, []);

  /** DEV ONLY: skip auth, instantly set a mock user */
  const devLoginAs = useCallback((role: UserRole) => {
    setUser(DEV_MOCK_USERS[role]);
    setBackendStatus("ok");
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      backendStatus,
      loginWithGoogle,
      registerWithEmail,
      verifyEmailCode,
      loginWithEmail,
      resetPasswordForEmail,
      logout,
      refreshProfileFromBackend,
      devLoginAs,
    }),
    [
      user,
      isLoading,
      backendStatus,
      loginWithGoogle,
      registerWithEmail,
      verifyEmailCode,
      loginWithEmail,
      resetPasswordForEmail,
      logout,
      refreshProfileFromBackend,
      devLoginAs,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
