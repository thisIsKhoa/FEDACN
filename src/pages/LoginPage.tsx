import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { FiLoader, FiMapPin, FiMail, FiLock, FiArrowLeft, FiUser, FiShield, FiZap } from "react-icons/fi";

const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, verifyEmailCode, resetPasswordForEmail, isLoading, backendStatus, devLoginAs } = useAuth();
  const [view, setView] = useState<"login" | "forgot" | "register" | "verify_otp">("login");
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const backendStatusText = useMemo(() => {
    if (backendStatus === "ok") return "Backend đã kết nối";
    if (backendStatus === "error") return "Backend chưa kết nối";
    return "Đang chờ đăng nhập để kiểm tra backend";
  }, [backendStatus]);

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setIsSubmittingGoogle(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmittingGoogle(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) { setErrorMessage("Vui lòng điền đầy đủ thông tin."); return; }
    if (password !== confirmPassword) { setErrorMessage("Mật khẩu xác nhận không khớp."); return; }
    if (password.length < 6) { setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự."); return; }
    setErrorMessage(null); setSuccessMessage(null); setIsSubmittingRegister(true);
    try {
      await registerWithEmail(email, password, fullName);
      setSuccessMessage("Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác nhận.");
      setView("verify_otp");
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : "Đăng ký thất bại.");
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otpCode) { setErrorMessage("Vui lòng nhập mã xác nhận."); return; }
    setErrorMessage(null); setSuccessMessage(null); setIsSubmittingOtp(true);
    try {
      await verifyEmailCode(email, otpCode);
      setSuccessMessage("Xác thực thành công!");
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : "Mã xác nhận không hợp lệ hoặc đã hết hạn.");
    } finally {
      setIsSubmittingOtp(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setErrorMessage("Vui lòng nhập email và mật khẩu."); return; }
    setErrorMessage(null); setIsSubmittingEmail(true);
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : "Đăng nhập thất bại.");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setErrorMessage("Vui lòng nhập email của bạn."); return; }
    setErrorMessage(null); setSuccessMessage(null); setIsSubmittingForgot(true);
    try {
      await resetPasswordForEmail(email);
      setSuccessMessage("Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn.");
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message ? error.message : "Không thể gửi yêu cầu.");
    } finally {
      setIsSubmittingForgot(false);
    }
  };

  const switchView = (v: "login" | "forgot" | "register" | "verify_otp") => {
    setView(v); setErrorMessage(null); setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* ════════ Left panel ════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-center p-16">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />
        <div className="absolute inset-0 gradient-animate bg-gradient-to-r from-blue-600/20 via-indigo-600/10 to-purple-600/20" />

        {/* Decorative orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30">
              <FiMapPin className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">WorkHub</span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight font-heading">
            Không gian
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              co-working
            </span>
            <br />
            thông minh
          </h1>

          <p className="mt-6 text-lg text-blue-200/70 max-w-md leading-relaxed">
            Đặt chỗ linh hoạt, thanh toán tiện lợi, kết nối cộng đồng. Quản lý
            toàn bộ co-working space trên một nền tảng duy nhất.
          </p>

          {/* Stats */}
          <div className="mt-10 flex gap-8">
            {[
              { value: "3", label: "Chi nhánh" },
              { value: "16+", label: "Workspace" },
              { value: "24/7", label: "Hỗ trợ" },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <p className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">{stat.value}</p>
                <p className="text-sm text-blue-300/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ Right panel ════════ */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-background">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md shadow-blue-500/25">
              <FiMapPin className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">WorkHub</span>
          </div>

          {/* View headers */}
          {view === "forgot" ? (
            <>
              <button onClick={() => switchView("login")} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label="Quay lại đăng nhập">
                <FiArrowLeft className="h-4 w-4" /> Quay lại
              </button>
              <h2 className="text-2xl font-bold font-heading">Khôi phục mật khẩu</h2>
              <p className="mt-2 text-sm text-muted-foreground mb-8">Nhập email của bạn để nhận liên kết khôi phục</p>
            </>
          ) : view === "register" ? (
            <>
              <h2 className="text-2xl font-bold font-heading">Tạo tài khoản mới</h2>
              <p className="mt-2 text-sm text-muted-foreground mb-8">Đăng ký thành viên để tham gia không gian làm việc</p>
            </>
          ) : view === "verify_otp" ? (
            <>
              <button onClick={() => switchView("register")} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label="Quay lại đăng ký">
                <FiArrowLeft className="h-4 w-4" /> Quay lại
              </button>
              <h2 className="text-2xl font-bold font-heading">Xác nhận Email</h2>
              <p className="mt-2 text-sm text-muted-foreground mb-8">Nhập mã 8 số được gửi đến {email || "email của bạn"}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold font-heading">Chào mừng bạn trở lại!</h2>
              <p className="mt-2 text-sm text-muted-foreground mb-8">Đăng nhập để truy cập hệ thống</p>
            </>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400 animate-scale-in">
              {successMessage}
            </div>
          )}

          {/* ── Form views ── */}
          {view === "forgot" ? (
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground"><FiMail className="h-5 w-5" /></div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field !pl-10" placeholder="admin@example.com" required />
                </div>
              </div>
              <Button type="submit" disabled={isSubmittingForgot || isLoading} className="w-full mt-2">
                {isSubmittingForgot && <FiLoader className="h-5 w-5 animate-spin" />}
                {isSubmittingForgot ? "Đang gửi..." : "Gửi liên kết khôi phục"}
              </Button>
            </form>
          ) : view === "register" ? (
            <>
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Họ và Tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground"><FiUser className="h-5 w-5" /></div>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field !pl-10" placeholder="Nguyễn Văn A" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground"><FiMail className="h-5 w-5" /></div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field !pl-10" placeholder="admin@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Mật khẩu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground"><FiLock className="h-5 w-5" /></div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field !pl-10" placeholder="••••••••" required minLength={6} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground"><FiLock className="h-5 w-5" /></div>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field !pl-10" placeholder="••••••••" required minLength={6} />
                  </div>
                </div>
                <Button type="submit" disabled={isSubmittingRegister || isSubmittingGoogle || isLoading} className="w-full mt-2">
                  {isSubmittingRegister && <FiLoader className="h-5 w-5 animate-spin" />}
                  {isSubmittingRegister ? "Đang xử lý..." : "Đăng ký tài khoản"}
                </Button>
              </form>
              <div className="mt-4 flex justify-center text-sm">
                <span className="text-muted-foreground mr-1">Đã có tài khoản?</span>
                <button type="button" onClick={() => switchView("login")} className="font-medium text-primary hover:text-primary/80 transition-colors">Đăng nhập</button>
              </div>
            </>
          ) : view === "verify_otp" ? (
            <form onSubmit={handleVerifyOtpSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Mã xác nhận (8 chữ số)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground"><FiShield className="h-5 w-5" /></div>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 8))} className="input-field !pl-10 tracking-widest text-lg font-mono" placeholder="••••••••" maxLength={8} required />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Hãy kiểm tra hộp thư đến (hoặc thư rác) của bạn.</p>
              </div>
              <Button type="submit" disabled={isSubmittingOtp || isLoading || otpCode.length !== 8} className="w-full mt-2">
                {isSubmittingOtp && <FiLoader className="h-5 w-5 animate-spin" />}
                {isSubmittingOtp ? "Đang xác nhận..." : "Xác nhận mã"}
              </Button>
            </form>
          ) : (
            <>
              <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground"><FiMail className="h-5 w-5" /></div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field !pl-10" placeholder="admin@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Mật khẩu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground"><FiLock className="h-5 w-5" /></div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field !pl-10" placeholder="••••••••" required />
                  </div>
                </div>
                <div className="flex justify-end -mt-2 mb-1">
                  <button type="button" onClick={() => switchView("forgot")} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Quên mật khẩu?</button>
                </div>
                <Button type="submit" disabled={isSubmittingEmail || isSubmittingGoogle || isLoading} className="w-full mt-2">
                  {isSubmittingEmail && <FiLoader className="h-5 w-5 animate-spin" />}
                  {isSubmittingEmail ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>

              <div className="mt-4 flex justify-center text-sm">
                <span className="text-muted-foreground mr-1">Chưa có tài khoản?</span>
                <button type="button" onClick={() => switchView("register")} className="font-medium text-primary hover:text-primary/80 transition-colors">Đăng ký ngay</button>
              </div>

              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-border"></div>
                <span className="px-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Hoặc</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              {/* Google Auth Button */}
              <button
                type="button"
                onClick={() => void handleGoogleLogin()}
                disabled={isSubmittingGoogle || isSubmittingEmail || isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-6 rounded-xl border border-border bg-card hover:bg-muted hover:border-primary transition-all text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingGoogle ? (
                  <FiLoader className="h-5 w-5 animate-spin" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Tiếp tục với Google
              </button>
            </>
          )}

          {/* Backend status */}
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${
              backendStatus === "ok" ? "bg-green-500" : backendStatus === "error" ? "bg-red-500" : "bg-gray-400"
            }`} />
            {backendStatusText}
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400 animate-scale-in">
              {errorMessage}
            </div>
          )}

          {/* ── DEV: Quick role switcher ── */}
          <div className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/50">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-3 uppercase tracking-wider flex items-center gap-1.5"><FiZap className="h-3.5 w-3.5" /> Dev Quick Login</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => devLoginAs("customer")} className="flex-1 text-xs cursor-pointer"><FiUser className="h-3.5 w-3.5" /> Customer</Button>
              <Button variant="outline" size="sm" onClick={() => devLoginAs("staff")} className="flex-1 text-xs cursor-pointer"><FiShield className="h-3.5 w-3.5" /> Staff</Button>
              <Button variant="outline" size="sm" onClick={() => devLoginAs("admin")} className="flex-1 text-xs cursor-pointer"><FiLock className="h-3.5 w-3.5" /> Admin</Button>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            © 2026 WorkHub. Hệ thống quản lý co-working space.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
