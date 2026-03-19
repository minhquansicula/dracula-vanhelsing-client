import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import { ROUTES } from "../../constants/routes";

const Lobby = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const handleProtectedAction = (action) => {
    if (!user) {
      setIsTransitioning(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 600);
      return;
    }
    action();
  };

  const handleChange = (element, index) => {
    const value = element.value.toUpperCase();
    if (/[^A-Z0-9]/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newCode.every((char) => char !== "") && newCode.length === 6) {
      handleAutoJoin(newCode.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleAutoJoin = (finalCode) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(ROUTES.GAME_ROOM.replace(":roomCode", finalCode));
    }, 1200);
  };

  const onCreateRoom = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(ROUTES.GAME_ROOM.replace(":roomCode", "DEMO99"));
    }, 1000);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black pointer-events-none transition-opacity duration-700 ${isTransitioning ? "opacity-100" : "opacity-0"}`}
      />

      <div
        className={`min-h-screen bg-game-dark-teal text-game-bone-white relative overflow-hidden flex flex-col font-['Inter'] transition-all duration-700 ${isTransitioning ? "opacity-0 blur-md" : "opacity-100 blur-0"}`}
      >
        <header className="relative z-20 flex justify-between items-end p-8 md:px-16 border-b border-white/5 backdrop-blur-sm">
          <div className="flex flex-col">
            <h1 className="text-game-dracula-orange text-[10px] font-black uppercase tracking-[0.5em] mb-1">
              London 1888
            </h1>
            <h2 className="text-2xl font-bold uppercase tracking-tighter font-['Playfair_Display']">
              Sảnh <span className="italic font-black">Chờ</span>
            </h2>
          </div>

          <nav className="flex items-center gap-8">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">
                    Đã định danh
                  </p>
                  <p className="text-sm font-bold text-game-dracula-orange tracking-widest uppercase">
                    {user.username}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="h-10 px-6 border border-white/10 hover:border-game-vanhelsing-blood hover:text-game-vanhelsing-blood transition-all text-[10px] uppercase font-bold tracking-widest"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <div className="flex gap-8 items-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-[11px] uppercase tracking-[0.3em] font-bold hover:text-game-dracula-orange"
                >
                  Đăng nhập
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="text-[11px] uppercase tracking-[0.3em] font-bold px-6 py-2 border border-white/10 hover:bg-white/5 transition-all"
                >
                  Khởi tạo
                </Link>
              </div>
            )}
          </nav>
        </header>

        <main className="relative z-10 flex-grow flex items-center justify-center p-6">
          <div
            className={`w-full transition-all duration-700 ease-in-out ${user ? "max-w-5xl grid md:grid-cols-2" : "max-w-md grid-cols-1"} bg-white/[0.02] border border-white/5 shadow-2xl items-stretch`}
          >
            {/* CỘT 1: TRIỆU HỒI */}
            <div className="bg-game-dark-teal p-10 md:p-14 lg:p-16 flex flex-col items-center text-center group border-r border-white/5 h-full">
              {/* Vùng nội dung chữ (Tự động giãn ra để đẩy nút xuống đáy) */}
              <div className="flex-grow flex flex-col items-center justify-start">
                <div className="h-24 flex items-end mb-10">
                  <div className="w-px bg-game-dracula-orange opacity-40 group-hover:h-24 h-16 transition-all duration-500" />
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter font-['Playfair_Display'] mb-6">
                  Triệu Hồi
                </h3>
                <p className="text-game-bone-white/40 text-[11px] uppercase tracking-[0.2em] mb-12 max-w-[260px] leading-loose font-['Inter']">
                  Bắt đầu một hiệp ước máu mới và dẫn dắt quân đoàn bóng đêm.
                </p>
              </div>

              {/* Vùng Nút bấm: Cố định chiều cao bằng với ô nhập mã (h-14 md:h-16) */}
              <div className="w-full mt-auto h-14 md:h-16">
                <button
                  onClick={() => handleProtectedAction(onCreateRoom)}
                  disabled={isLoading}
                  className="w-full h-full flex items-center justify-center border border-white/10 bg-black/40 text-game-bone-white/60 hover:text-game-dracula-orange hover:border-game-dracula-orange hover:bg-white/[0.02] transition-all duration-500 uppercase tracking-[0.3em] font-bold font-['Playfair_Display'] text-xs shadow-none"
                >
                  {isLoading
                    ? "Đang tạo..."
                    : user
                      ? "Khởi Tạo Trận Đấu"
                      : "Đăng Nhập Để Chơi"}
                </button>
              </div>
            </div>

            {/* CỘT 2: GIA NHẬP */}
            {user && (
              <div className="bg-game-dark-teal p-10 md:p-14 lg:p-16 flex flex-col items-center text-center group relative animate-in fade-in slide-in-from-right-10 duration-700 h-full">
                {/* Vùng nội dung chữ */}
                <div className="flex-grow flex flex-col items-center justify-start">
                  <div className="h-24 flex items-end mb-10">
                    <div className="w-px bg-game-vanhelsing-blood opacity-40 group-hover:h-24 h-16 transition-all duration-500" />
                  </div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter font-['Playfair_Display'] mb-6">
                    Gia Nhập
                  </h3>
                  <p className="text-game-bone-white/40 text-[11px] uppercase tracking-[0.2em] mb-12 max-w-[260px] leading-loose font-['Inter']">
                    Nhập 6 ký tự mật mã để bước vào cuộc săn lùng.
                  </p>
                </div>

                {/* Vùng Ô nhập mã: Cố định chiều cao (h-14 md:h-16) ngang hàng nút Khởi tạo */}
                <div className="w-full mt-auto flex justify-center gap-2 h-14 md:h-16">
                  {code.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-10 md:w-12 h-full bg-black/40 border border-white/10 text-game-dracula-orange text-2xl font-black text-center focus:border-game-dracula-orange focus:outline-none transition-all duration-300 rounded-none font-['Playfair_Display']"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                {/* Text loading đặt ở absolute để không phá vỡ layout */}
                {isLoading && (
                  <p className="absolute bottom-6 left-0 right-0 text-[10px] uppercase tracking-[0.4em] text-game-dracula-orange animate-pulse mt-4">
                    Đang kiểm tra hiệp ước...
                  </p>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className="relative z-10 p-12 flex justify-center items-center gap-6 opacity-20">
          <div className="h-[1px] w-12 bg-white" />
          <p className="text-[9px] uppercase tracking-[0.8em]">Endless Night</p>
          <div className="h-[1px] w-12 bg-white" />
        </footer>
      </div>
    </>
  );
};

export default Lobby;
