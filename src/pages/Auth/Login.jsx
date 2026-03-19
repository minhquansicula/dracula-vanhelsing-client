import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
// import axiosClient from "../../api/axiosClient"; // Tạm thời tắt
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

// Một chuỗi JWT giả mạo để lừa hàm jwtDecode trong AuthContext
// Nó chứa thông tin: { "sub": "mock-user-1", "unique_name": "Kẻ Săn Máu", "exp": 9999999999 }
const MOCK_JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtb2NrLXVzZXItMSIsInVuaXF1ZV9uYW1lIjoiS+G6uyBTMqNuIE3DoXUiLCJleHAiOjk5OTk5OTk5OTl9.fake_signature_here";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Giả lập thời gian loading mạng
      await new Promise((res) => setTimeout(res, 1000));

      // ---- LOGIC GIẢ LẬP ----
      if (password !== "123456") {
        throw new Error("Để test giao diện, vui lòng nhập mật ngữ là: 123456");
      }

      // Gọi hàm login với token giả
      login(MOCK_JWT_TOKEN);

      // Kích hoạt hiệu ứng chuyển trang
      setIsTransitioning(true);
      setTimeout(() => {
        navigate(ROUTES.LOBBY);
      }, 700);
    } catch (err) {
      setError(
        err.message || "Lời nguyền thất bại. Sai danh tính hoặc mật ngữ.",
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black pointer-events-none transition-opacity duration-700 ${isTransitioning ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-game-dark-teal transition-all duration-700 ${isTransitioning ? "opacity-0 blur-md scale-95" : "opacity-100 blur-0 scale-100"}`}
      >
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-game-vanhelsing-blood rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-game-dracula-orange rounded-full blur-[150px] opacity-10"></div>

        <div className="bg-black/60 p-10 rounded-sm border border-game-bone-white/10 w-full max-w-md shadow-[0_0_60px_rgba(0,0,0,0.8)] relative z-10 backdrop-blur-sm">
          <header className="text-center mb-10">
            <h1 className="text-game-dracula-orange text-xs font-black uppercase tracking-[0.3em] mb-2 shadow-text-sm">
              Dracula vs Van Helsing
            </h1>
            <h2 className="text-4xl font-extrabold text-game-bone-white uppercase tracking-tighter shadow-text-lg">
              Đăng Nhập
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-game-dracula-orange to-transparent mx-auto mt-4"></div>
          </header>

          {error && (
            <div className="bg-game-vanhelsing-blood/20 border border-game-vanhelsing-blood text-game-bone-white px-4 py-3 rounded-sm mb-6 text-center text-sm italic shadow-[0_0_15px_rgba(154,27,31,0.5)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Danh tính (Username)"
              type="text"
              placeholder="Kẻ vô danh..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <Input
              label="Mật ngữ: 123456 (Để Test)"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 bg-black/40 border-game-dark-teal rounded-sm text-game-dracula-orange focus:ring-game-dracula-orange focus:ring-offset-0 focus:ring-offset-transparent bg-none"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-xs text-game-bone-white/70 uppercase tracking-widest"
                >
                  Ghi nhớ tôi
                </label>
              </div>
              <Link
                to="#"
                className="text-xs text-game-dracula-orange hover:text-white transition-colors uppercase tracking-widest hover:shadow-text-xs"
              >
                Quên mật ngữ?
              </Link>
            </div>

            <Button
              type="submit"
              variant="dracula"
              className="w-full"
              isLoading={isLoading}
            >
              Vào Đêm Tối
            </Button>
          </form>

          <footer className="text-center mt-8 pt-6 border-t border-game-bone-white/10">
            <p className="text-game-bone-white/70 text-xs uppercase tracking-widest">
              Chưa có hiệp ước?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="text-game-dracula-orange hover:text-white font-black transition-colors hover:shadow-text-sm"
              >
                Ký ngay
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Login;
