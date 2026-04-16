import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FiLoader, FiMapPin, FiMail, FiLock, FiArrowLeft } from "react-icons/fi";

const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, resetPasswordForEmail, isLoading, backendStatus } = useAuth();
  const [view, setView] = useState<"login" | "forgot">("login");
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backendStatusText = useMemo(() => {
    if (backendStatus === "ok") {
      return "Backend đã kết nối";
    }
    if (backendStatus === "error") {
      return "Backend chưa kết nối";
    }
    return "Đang chờ đăng nhập để kiểm tra backend";
  }, [backendStatus]);

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsSubmittingGoogle(true);

    try {
      await loginWithGoogle();
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmittingGoogle(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setErrorMessage(null);
    setIsSubmittingEmail(true);

    try {
      await loginWithEmail(email, password);
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Đăng nhập thất bại. Kiểm tra lại thông tin.");
      }
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Vui lòng nhập email của bạn.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmittingForgot(true);

    try {
      await resetPasswordForEmail(email);
      setSuccessMessage("Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn.");
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Không thể gửi yêu cầu. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex-col justify-center p-16">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, rgba(59,130,246,0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <FiMapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              WorkHub
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight">
            Không gian
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              co-working
            </span>
            <br />
            thông minh
          </h1>
          <p className="mt-6 text-lg text-blue-200/80 max-w-md leading-relaxed">
            Đặt chỗ linh hoạt, thanh toán tiện lợi, kết nối cộng đồng. Quản lý
            toàn bộ co-working space trên một nền tảng duy nhất.
          </p>
          <div className="mt-10 flex gap-8 text-sm text-blue-300/80">
            <div>
              <p className="text-3xl font-bold text-white">3</p>
              <p>Chi nhánh</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">16+</p>
              <p>Workspace</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p>Hỗ trợ</p>
            </div>
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

          {view === "forgot" ? (
            <>
              <button 
                onClick={() => { setView("login"); setErrorMessage(null); setSuccessMessage(null); }} 
                className="mb-6 flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors"
                aria-label="Quay lại đăng nhập"
              >
                <FiArrowLeft className="h-4 w-4" /> Quay lại
              </button>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">
                Khôi phục mật khẩu
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)] mb-8">
                Nhập email của bạn để nhận liên kết khôi phục
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[var(--text-main)]">
                Chào mừng bạn trở lại!
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)] mb-8">
                Đăng nhập để truy cập hệ thống
              </p>
            </>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-[var(--state-success-border)] bg-[var(--state-success-bg)] px-4 py-3 text-sm text-[var(--state-success)]">
              {successMessage}
            </div>
          )}

          {view === "forgot" ? (
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-tertiary)]">
                    <FiMail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingForgot || isLoading}
                className="btn btn-primary w-full mt-2"
              >
                {isSubmittingForgot ? (
                  <FiLoader className="h-5 w-5 animate-spin" />
                ) : null}
                {isSubmittingForgot ? "Đang gửi..." : "Gửi liên kết khôi phục"}
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-tertiary)]">
                      <FiMail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-tertiary)]">
                      <FiLock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end -mt-2 mb-1">
                  <button
                    type="button"
                    onClick={() => { setView("forgot"); setErrorMessage(null); setSuccessMessage(null); }}
                    className="text-sm font-medium text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingEmail || isSubmittingGoogle || isLoading}
                  className="btn btn-primary w-full mt-2"
                >
                  {isSubmittingEmail ? (
                    <FiLoader className="h-5 w-5 animate-spin" />
                  ) : null}
                  {isSubmittingEmail ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-[var(--border-subtle)]"></div>
                <span className="px-3 text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-medium">Hoặc</span>
                <div className="flex-1 border-t border-[var(--border-subtle)]"></div>
              </div>

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={() => void handleGoogleLogin()}
                disabled={isSubmittingGoogle || isSubmittingEmail || isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--brand-primary)] transition-all text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed text-[var(--text-main)]"
              >
                {isSubmittingGoogle ? (
                  <FiLoader className="h-5 w-5 animate-spin" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Tiếp tục với Google
              </button>
            </>
          )}

          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            {backendStatusText}
          </p>

          {errorMessage && (
            <div className="mt-4 rounded-xl border border-[var(--state-danger-border)] bg-[var(--state-danger-bg)] px-4 py-3 text-sm text-[var(--state-danger)]">
              {errorMessage}
            </div>
          )}

          <p className="mt-8 text-center text-xs text-[var(--text-tertiary)]">
            © 2026 WorkHub. Hệ thống quản lý co-working space.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
