import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ROUTES } from "../../constants/routes";
import useGameStore from "../../store/useGameStore";
import RoomCodeInput from "../../components/ui/RoomCodeInput";
import { preloadGameAssets } from "../../utils/assetLoader";

const Lobby = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const { connect, createRoom, joinRoom, roomCode, error, clearError } =
    useGameStore();
  const navigate = useNavigate();

  const roomCodeInputRef = useRef(null);

  // 1. KẾT NỐI SIGNALR KHI VÀO SẢNH
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user && token) {
      connect(token);
    }
  }, [user, connect]);

  useEffect(() => {
    preloadGameAssets();
  }, []);

  // 2. LẮNG NGHE KHI BACKEND TRẢ VỀ ROOM CODE (TẠO/VÀO PHÒNG THÀNH CÔNG)
  useEffect(() => {
    if (roomCode) {
      setIsLoading(false);
      setIsTransitioning(true); // Bật hiệu ứng mờ dần
      setTimeout(() => {
        navigate(ROUTES.GAME_ROOM.replace(":roomCode", roomCode));
      }, 700); // Chuyển trang sau khi hiệu ứng mờ kết thúc
    }
  }, [roomCode, navigate]);

  // 3. LẮNG NGHE LỖI TỪ BACKEND (SAI CODE, PHÒNG ĐẦY...)
  useEffect(() => {
    if (error) {
      setIsLoading(false);
      alert(error); // Bạn có thể thay cái này bằng một Toast/Modal UI đẹp hơn sau
      clearError();

      // Xóa trắng ô nhập bằng ref thay vì state
      if (roomCodeInputRef.current) {
        roomCodeInputRef.current.clear();
      }
    }
  }, [error, clearError]);

  const handleProtectedAction = (action) => {
    if (!user) {
      setIsTransitioning(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 600);
      return;
    }
    action();
  };

  // GỌI HÀM VÀO PHÒNG TỪ BACKEND
  const handleAutoJoin = async (finalCode) => {
    setIsLoading(true);
    await joinRoom(finalCode);
  };

  // GỌI HÀM TẠO PHÒNG TỪ BACKEND
  const onCreateRoom = async () => {
    setIsLoading(true);
    await createRoom();
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

              <div className="w-full mt-auto h-14 md:h-16">
                <button
                  onClick={() => handleProtectedAction(onCreateRoom)}
                  disabled={isLoading}
                  className="w-full h-full flex items-center justify-center border border-white/10 bg-black/40 text-game-bone-white/60 hover:text-game-dracula-orange hover:border-game-dracula-orange hover:bg-white/[0.02] transition-all duration-500 uppercase tracking-[0.3em] font-bold font-['Playfair_Display'] text-xs shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* Tái sử dụng Component nhập mã PIN */}
                <RoomCodeInput
                  ref={roomCodeInputRef}
                  disabled={isLoading}
                  onComplete={handleAutoJoin}
                />

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
