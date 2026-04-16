import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'customer' | 'staff' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: UserRole;
  branchId: string | null;
  branchName: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const MOCK_USERS: Record<UserRole, AuthUser> = {
  customer: {
    id: 'user-0001',
    email: 'linh.nguyen@example.com',
    fullName: 'Linh Nguyễn',
    avatarUrl: '',
    role: 'customer',
    branchId: null,
    branchName: null,
  },
  staff: {
    id: 'user-0003',
    email: 'staff.frontdesk@example.com',
    fullName: 'Bảo Phạm',
    avatarUrl: '',
    role: 'staff',
    branchId: 'branch-0001',
    branchName: 'WorkHub Quận 1',
  },
  admin: {
    id: 'user-0004',
    email: 'admin@workhub.vn',
    fullName: 'Admin WorkHub',
    avatarUrl: '',
    role: 'admin',
    branchId: null,
    branchName: null,
  },
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(MOCK_USERS.customer);

  const login = useCallback((role: UserRole) => {
    setUser(MOCK_USERS[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser(MOCK_USERS[role]);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
