import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth, UserRole } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import {
  FiMapPin, FiCalendar, FiCreditCard, FiUser, FiUsers, FiActivity,
  FiCheckCircle, FiDollarSign, FiTool, FiTag, FiShield, FiRefreshCw,
  FiCoffee, FiFileText, FiBarChart2, FiSun, FiMoon, FiLogOut, FiMenu,
  FiChevronLeft
} from 'react-icons/fi';

// ── Pages ──
import LoginPage from './pages/LoginPage';
import ExplorePage from './pages/customer/ExplorePage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import PaymentHistoryPage from './pages/customer/PaymentHistoryPage';
import ProfilePage from './pages/customer/ProfilePage';
import PartnerMatchPage from './pages/customer/PartnerMatchPage';
import OperationsDashboardPage from './pages/staff/OperationsDashboardPage';
import CheckInPage from './pages/staff/CheckInPage';
import PaymentConfirmPage from './pages/staff/PaymentConfirmPage';
import MaintenancePage from './pages/staff/MaintenancePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import BranchManagementPage from './pages/admin/BranchManagementPage';
import PricingPage from './pages/admin/PricingPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import CancellationPoliciesPage from './pages/admin/CancellationPoliciesPage';
import RefundApprovalPage from './pages/admin/RefundApprovalPage';
import ExtraServicesPage from './pages/admin/ExtraServicesPage';
import AuditLogPage from './pages/admin/AuditLogPage';
import ReportsPage from './pages/admin/ReportsPage';

// ── Navigation config ──
interface NavItem { to: string; label: string; icon: React.ReactNode; }

const customerNav: NavItem[] = [
  { to: '/customer/explore', label: 'Khám phá', icon: <FiMapPin className="h-4 w-4" /> },
  { to: '/customer/bookings', label: 'Đặt chỗ', icon: <FiCalendar className="h-4 w-4" /> },
  { to: '/customer/payments', label: 'Thanh toán', icon: <FiCreditCard className="h-4 w-4" /> },
  { to: '/customer/profile', label: 'Hồ sơ', icon: <FiUser className="h-4 w-4" /> },
  { to: '/customer/partners', label: 'Đối tác', icon: <FiUsers className="h-4 w-4" /> },
];

const staffNav: NavItem[] = [
  { to: '/staff/dashboard', label: 'Dashboard', icon: <FiActivity className="h-4 w-4" /> },
  { to: '/staff/checkin', label: 'Check-in', icon: <FiCheckCircle className="h-4 w-4" /> },
  { to: '/staff/payments', label: 'Thanh toán', icon: <FiDollarSign className="h-4 w-4" /> },
  { to: '/staff/maintenance', label: 'Bảo trì', icon: <FiTool className="h-4 w-4" /> },
];

const adminNav: NavItem[] = [
  { to: '/admin/dashboard', label: 'Tổng quan', icon: <FiActivity className="h-4 w-4" /> },
  { to: '/admin/branches', label: 'Chi nhánh', icon: <FiMapPin className="h-4 w-4" /> },
  { to: '/admin/pricing', label: 'Bảng giá', icon: <FiTag className="h-4 w-4" /> },
  { to: '/admin/users', label: 'Người dùng', icon: <FiUsers className="h-4 w-4" /> },
  { to: '/admin/cancellation', label: 'Chính sách hủy', icon: <FiShield className="h-4 w-4" /> },
  { to: '/admin/refunds', label: 'Hoàn tiền', icon: <FiRefreshCw className="h-4 w-4" /> },
  { to: '/admin/services', label: 'Dịch vụ thêm', icon: <FiCoffee className="h-4 w-4" /> },
  { to: '/admin/audit', label: 'Nhật ký', icon: <FiFileText className="h-4 w-4" /> },
  { to: '/admin/reports', label: 'Báo cáo', icon: <FiBarChart2 className="h-4 w-4" /> },
];

// ── Mobile Bottom Nav ──
const MobileBottomNav: React.FC<{ items: NavItem[] }> = ({ items }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Show max 5 items on bottom nav
  const visibleItems = items.slice(0, 5);

  return (
    <nav className="mobile-bottom-nav" aria-label="Điều hướng di động">
      {visibleItems.map(item => (
        <button
          key={item.to}
          onClick={() => navigate(item.to)}
          className={`nav-item ${location.pathname === item.to ? 'active' : ''}`}
          aria-label={item.label}
          aria-current={location.pathname === item.to ? 'page' : undefined}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ── Layout Shell ──
const AppShell: React.FC = () => {
  const { user, logout, switchRole, isAuthenticated } = useAuth();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  if (!isAuthenticated || !user) return <LoginPage />;

  const navItems = user.role === 'admin' ? adminNav : user.role === 'staff' ? staffNav : customerNav;
  const roleLabel: Record<UserRole, string> = { customer: 'Khách hàng', staff: 'Nhân viên', admin: 'Quản trị viên' };
  const defaultRoute = user.role === 'admin' ? '/admin/dashboard' : user.role === 'staff' ? '/staff/dashboard' : '/customer/explore';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Skip-to-content link (a11y) */}
      <a href="#main-content" className="skip-link">
        Bỏ qua điều hướng
      </a>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          role="button"
          aria-label="Đóng menu"
          tabIndex={-1}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 h-full flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-[68px]' : 'w-64'}`}
        aria-label="Điều hướng chính"
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 h-16 border-b border-[var(--border-subtle)] shrink-0 ${collapsed ? 'justify-center px-3' : ''}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shrink-0">
            <FiMapPin className="h-4.5 w-4.5 text-white" />
          </div>
          {!collapsed && <span className="text-lg font-bold tracking-tight">WorkHub</span>}
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Menu chính">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-3' : ''}`}
              title={item.label}
              aria-current={location.pathname === item.to ? 'page' : undefined}>
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse button (desktop) */}
        <div className="hidden lg:block px-3 py-2 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-link w-full justify-center"
            aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            <FiChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* User section */}
        <div className={`px-4 py-3 border-t border-[var(--border-subtle)] shrink-0 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed ? (
            <div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user.fullName}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">{roleLabel[user.role]}</p>
                </div>
              </div>
              {/* Role switcher (demo) */}
              <div className="mt-3 flex gap-1" role="group" aria-label="Chuyển vai trò">
                {(['customer', 'staff', 'admin'] as UserRole[]).map(r => (
                  <button key={r} onClick={() => switchRole(r)}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${user.role === r ? 'bg-[var(--brand-primary)] text-white' : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
                    aria-pressed={user.role === r}
                    aria-label={`Chuyển sang ${r === 'customer' ? 'Khách hàng' : r === 'staff' ? 'Nhân viên' : 'Quản trị viên'}`}>
                    {r === 'customer' ? 'KH' : r === 'staff' ? 'NV' : 'QTV'}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                {user.fullName.charAt(0)}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden btn btn-ghost btn-sm"
            aria-label="Mở menu điều hướng"
          >
            <FiMenu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block">
            {user.branchName && (
              <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                <FiMapPin className="h-3.5 w-3.5" /> {user.branchName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setDark(!dark)}
              className="btn btn-ghost btn-sm"
              aria-label={dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}>
              {dark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            </button>
            <button onClick={logout} className="btn btn-ghost btn-sm" aria-label="Đăng xuất">
              <FiLogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 overflow-y-auto px-6 py-6 bg-[var(--bg-base)] mobile-main-content">
          <ErrorBoundary>
            <Routes>
              {/* Customer */}
              <Route path="/customer/explore" element={<ExplorePage />} />
              <Route path="/customer/bookings" element={<MyBookingsPage />} />
              <Route path="/customer/payments" element={<PaymentHistoryPage />} />
              <Route path="/customer/profile" element={<ProfilePage />} />
              <Route path="/customer/partners" element={<PartnerMatchPage />} />

              {/* Staff */}
              <Route path="/staff/dashboard" element={<OperationsDashboardPage />} />
              <Route path="/staff/checkin" element={<CheckInPage />} />
              <Route path="/staff/payments" element={<PaymentConfirmPage />} />
              <Route path="/staff/maintenance" element={<MaintenancePage />} />

              {/* Admin */}
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/branches" element={<BranchManagementPage />} />
              <Route path="/admin/pricing" element={<PricingPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/cancellation" element={<CancellationPoliciesPage />} />
              <Route path="/admin/refunds" element={<RefundApprovalPage />} />
              <Route path="/admin/services" element={<ExtraServicesPage />} />
              <Route path="/admin/audit" element={<AuditLogPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />

              {/* Default redirect */}
              <Route path="*" element={<Navigate to={defaultRoute} replace />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Mobile Bottom Nav */}
        <MobileBottomNav items={navItems} />
      </div>
    </div>
  );
};

// ── Root App ──
const App: React.FC = () => (
  <AuthProvider>
    <ToastProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ToastProvider>
  </AuthProvider>
);

export default App;
