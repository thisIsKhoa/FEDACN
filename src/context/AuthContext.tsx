import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
    branchId: "branch-0001",
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

const DEV_BRANCH_ADMIN_USER: AuthUser = {
  id: "dev-branch-admin-001",
  email: "branch.admin@dev.local",
  fullName: "Phạm Chi Nhánh Q1",
  avatarUrl: "",
  role: "admin",
  branchId: "branch-0001",
  branchName: "WorkHub Quận 1",
};

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendStatus: "idle" | "ok" | "error";
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, password: string, fullName: string, confirmPassword?: string) => Promise<void>;
  verifyEmailCode: (email: string, code: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfileFromBackend: () => Promise<void>;
  devLoginAs: (role: UserRole) => void;
  devLoginAsBranchAdmin: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const ROLE_LIST: UserRole[] = ["customer", "staff", "admin"];

const AuthContext = createContext<AuthContextValue | null>(null);

const normalizeRole = (role: unknown): UserRole => {
  if (typeof role !== "string") return "customer";
  const normalized = role.toLowerCase();
  return ROLE_LIST.includes(normalized as UserRole) ? (normalized as UserRole) : "customer";
};

const mapBackendUser = (dataUser: any): AuthUser => ({
  id: dataUser.id,
  email: dataUser.email,
  fullName: dataUser.fullName,
  avatarUrl: dataUser.avatarUrl || "",
  role: normalizeRole(dataUser.role),
  branchId: dataUser.branchId || null,
  branchName: dataUser.branchName || null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<"idle" | "ok" | "error">("idle");

  useEffect(() => {
    const bootstrap = () => {
      try {
        const storedUser = localStorage.getItem("workhub_user");
        const accessToken = localStorage.getItem("workhub_access_token");
        
        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser));
          setBackendStatus("ok");
        } else {
          setBackendStatus("idle");
        }
      } catch (error) {
        console.error("Failed to restore session from local storage", error);
        setBackendStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const refreshProfileFromBackend = useCallback(async () => {
    // Current backend doesn't have an endpoint for this. 
    // It will be updated when the backend adds /api/auth/me
  }, []);

  const loginWithGoogle = useCallback(async () => {
    throw new Error("Chức năng đăng nhập Google chưa được hỗ trợ trên hệ thống mới.");
  }, []);

  const registerWithEmail = useCallback(async (email: string, password: string, fullName: string, confirmPassword?: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        password, 
        fullName, 
        confirmPassword: confirmPassword || password,
        phone: "" 
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (data.fields) {
         const firstError = Object.values(data.fields)[0];
         throw new Error(firstError as string);
      }
      throw new Error(data.message || "Đăng ký thất bại");
    }

    if (data.data?.user && data.data?.accessToken) {
       const mappedUser = mapBackendUser(data.data.user);
       localStorage.setItem("workhub_user", JSON.stringify(mappedUser));
       localStorage.setItem("workhub_access_token", data.data.accessToken);
       if (data.data.refreshToken) {
         localStorage.setItem("workhub_refresh_token", data.data.refreshToken);
       }
       setUser(mappedUser);
       setBackendStatus("ok");
    }
  }, []);

  const verifyEmailCode = useCallback(async (email: string, code: string) => {
    throw new Error("Chức năng này không cần thiết trên hệ thống hiện tại.");
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }

    if (data.data?.user && data.data?.accessToken) {
       const mappedUser = mapBackendUser(data.data.user);
       localStorage.setItem("workhub_user", JSON.stringify(mappedUser));
       localStorage.setItem("workhub_access_token", data.data.accessToken);
       if (data.data.refreshToken) {
         localStorage.setItem("workhub_refresh_token", data.data.refreshToken);
       }
       setUser(mappedUser);
       setBackendStatus("ok");
    }
  }, []);

  const resetPasswordForEmail = useCallback(async (email: string) => {
    throw new Error("Chức năng quên mật khẩu chưa được hỗ trợ.");
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("workhub_user");
    localStorage.removeItem("workhub_access_token");
    localStorage.removeItem("workhub_refresh_token");
    setUser(null);
    setBackendStatus("idle");
  }, []);

  const devLoginAs = useCallback((role: UserRole) => {
    setUser(DEV_MOCK_USERS[role]);
    setBackendStatus("ok");
    setIsLoading(false);
  }, []);

  const devLoginAsBranchAdmin = useCallback(() => {
    setUser(DEV_BRANCH_ADMIN_USER);
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
      devLoginAsBranchAdmin,
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
      devLoginAsBranchAdmin,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
