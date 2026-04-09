// src/components/ui/SettingsMenu.jsx
import React, { useState, useEffect, useRef } from "react";
import { audioManager } from "../../utils/AudioManager";

const SettingsMenu = ({
  onLeaveRoom,
  onSurrender,
  showSurrender = false,
  isFinished = false,
  isLobby = false,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Lấy giá trị âm lượng khởi tạo từ audioManager (nhân 100 để hiển thị dải 0-100)
  const [bgmVol, setBgmVol] = useState(audioManager.bgmVolume * 100);
  const [sfxVol, setSfxVol] = useState(audioManager.sfxVolume * 100);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý khi kéo thanh Nhạc Nền
  const handleBgmChange = (e) => {
    const val = e.target.value;
    setBgmVol(val);
    audioManager.setBgmVolume(val / 100);
  };

  // Xử lý khi kéo thanh Hiệu Ứng
  const handleSfxChange = (e) => {
    const val = e.target.value;
    setSfxVol(val);
    audioManager.setSfxVolume(val / 100);
  };

  // Phát tiếng test nhẹ khi nhả chuột khỏi thanh SFX để người dùng nghe thử âm lượng
  const handleSfxRelease = () => {
    audioManager.playSFX("draw");
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Nút Bánh Răng */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white/40 hover:text-white hover:rotate-90 transition-all duration-300 outline-none"
        title="Cài đặt"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Panel Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-4 right-0 w-64 bg-[#0d1316]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-5 py-4 border-b border-white/5 bg-black/40">
            <p className="text-xs text-white/60 uppercase tracking-[0.2em] font-bold">
              Cài đặt trò chơi
            </p>
          </div>

          <div className="p-4 space-y-5 border-b border-white/5">
            {/* Slider Nhạc Nền */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] uppercase tracking-widest text-white/80">
                  Nhạc Nền
                </span>
                <span className="text-[10px] text-game-dracula-orange font-bold">
                  {bgmVol}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bgmVol}
                onChange={handleBgmChange}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-game-dracula-orange"
              />
            </div>

            {/* Slider Hiệu Ứng */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] uppercase tracking-widest text-white/80">
                  Hiệu Ứng
                </span>
                <span className="text-[10px] text-game-dracula-orange font-bold">
                  {sfxVol}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVol}
                onChange={handleSfxChange}
                onMouseUp={handleSfxRelease} // Play test sound khi nhả chuột
                onTouchEnd={handleSfxRelease}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-game-dracula-orange"
              />
            </div>
          </div>

          {/* Các nút hành động */}
          {(onLeaveRoom || onLogout) && (
            <div className="p-2 flex flex-col gap-1">
              {!isLobby && onLeaveRoom && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLeaveRoom();
                  }}
                  disabled={showSurrender && !isFinished}
                  className="w-full text-left px-3 py-3 text-xs uppercase tracking-widest text-white/70 hover:bg-white/5 hover:text-white transition-colors rounded disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Về Sảnh Chờ
                </button>
              )}
              {!isLobby && showSurrender && !isFinished && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onSurrender();
                  }}
                  className="w-full text-left px-3 py-3 text-xs uppercase tracking-widest text-game-vanhelsing-blood hover:bg-game-vanhelsing-blood/10 transition-colors font-bold rounded"
                >
                  Đầu Hàng
                </button>
              )}
              {isLobby && onLogout && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-3 text-xs uppercase tracking-widest text-game-vanhelsing-blood hover:bg-game-vanhelsing-blood/10 transition-colors font-bold rounded"
                >
                  Đăng Xuất
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
