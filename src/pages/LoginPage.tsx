import React from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { FiChevronRight, FiMapPin, FiUsers, FiCalendar, FiShield } from 'react-icons/fi';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode; gradient: string }[] = [
    { role: 'customer', label: 'Khách hàng', desc: 'Đặt chỗ, thanh toán, check-in', icon: <FiUsers className="h-6 w-6" />, gradient: 'from-blue-500 to-cyan-400' },
    { role: 'staff', label: 'Nhân viên', desc: 'Quản lý vận hành chi nhánh', icon: <FiCalendar className="h-6 w-6" />, gradient: 'from-emerald-500 to-teal-400' },
    { role: 'admin', label: 'Quản trị viên', desc: 'Quản trị toàn bộ hệ thống', icon: <FiShield className="h-6 w-6" />, gradient: 'from-violet-500 to-purple-400' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex-col justify-center p-16">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(59,130,246,0.3) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <FiMapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">WorkHub</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight">
            Không gian<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">co-working</span><br />
            thông minh
          </h1>
          <p className="mt-6 text-lg text-blue-200/80 max-w-md leading-relaxed">
            Đặt chỗ linh hoạt, thanh toán tiện lợi, kết nối cộng đồng. 
            Quản lý toàn bộ co-working space trên một nền tảng duy nhất.
          </p>
          <div className="mt-10 flex gap-8 text-sm text-blue-300/80">
            <div><p className="text-3xl font-bold text-white">3</p><p>Chi nhánh</p></div>
            <div><p className="text-3xl font-bold text-white">16+</p><p>Workspace</p></div>
            <div><p className="text-3xl font-bold text-white">24/7</p><p>Hỗ trợ</p></div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-[var(--bg-base)]">
        <div className="max-w-md mx-auto w-full">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <FiMapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">WorkHub</span>
          </div>

          <h2 className="text-2xl font-bold text-[var(--text-main)]">Chào mừng bạn trở lại!</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Chọn vai trò để đăng nhập vào hệ thống</p>

          {/* Google Auth Button */}
          <button className="mt-8 w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--brand-primary)] transition-all text-sm font-semibold">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Đăng nhập bằng Google
          </button>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            <span className="text-xs text-[var(--text-tertiary)]">HOẶC CHỌN VAI TRÒ (DEMO)</span>
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          </div>

          <div className="mt-6 space-y-3">
            {roles.map(r => (
              <button key={r.role} onClick={() => login(r.role)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)] hover:bg-[var(--bg-surface-hover)] transition-all group">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${r.gradient} text-white shrink-0`}>
                  {r.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-[var(--text-main)]">{r.label}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{r.desc}</p>
                </div>
                <FiChevronRight className="h-5 w-5 text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)] transition-colors" />
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-[var(--text-tertiary)]">
            © 2026 WorkHub. Hệ thống quản lý co-working space.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
