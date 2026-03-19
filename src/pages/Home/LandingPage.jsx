import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import Button from "../../components/ui/Button";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartHunt = (e) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(ROUTES.LOBBY);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden font-['Inter']">
      {/* 1. Background Layer (Phóng to khi chuyển trang) */}
      <div
        className={`absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[1200ms] ease-in-out ${
          isTransitioning ? "scale-125 rotate-1" : "scale-105"
        }`}
        style={{ backgroundImage: `url('/assets/images/image_3.png')` }}
      />

      {/* 2. Overlay Layers (Tạo không khí mộng mị) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,_transparent_10%,_rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      <div
        className={`absolute inset-0 z-10 bg-black/50 transition-opacity duration-1000 ${isTransitioning ? "opacity-100" : "opacity-40"}`}
      />

      {/* 3. Transition Flash to Black */}
      <div
        className={`fixed inset-0 z-50 bg-black pointer-events-none transition-opacity duration-800 ${isTransitioning ? "opacity-100" : "opacity-0"}`}
      />

      {/* 4. Main Content Container */}
      <div
        className={`relative z-20 flex flex-col items-center justify-center min-h-screen px-6 transition-all duration-1000 ${
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* Logo Section - Phân bố đối xứng dọc */}
        <div className="mb-14 select-none relative group flex flex-col items-center">
          <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-[-0.04em] flex flex-col items-center font-['Playfair_Display'] leading-[0.85]">
            <span className="text-game-dracula-orange drop-shadow-[0_0_20px_rgba(225,85,37,0.5)]">
              Dracula
            </span>
            <span className="mt-4 text-game-vanhelsing-blood drop-shadow-[0_0_20px_rgba(154,27,31,0.5)]">
              Van Helsing
            </span>
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pt-4">
            <span className="text-4xl md:text-6xl text-white font-['Playfair_Display'] font-black italic opacity-90 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
              VS
            </span>
          </div>
        </div>

        {/* Tagline - Hiện đại & Tinh tế */}
        <p className="text-game-bone-white/70 text-sm md:text-lg uppercase tracking-[0.4em] mb-16 font-['Playfair_Display'] italic shadow-text-sm max-w-xl text-center">
          "Khi sương mù London nhuốm máu, kẻ săn sẽ trở thành con mồi"
        </p>

        {/* 5. PHẦN SỬA ĐỔI: Phân bố nút bấm đối xứng (Actions Section) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-3xl">
          {/* Nút chính: Bắt đầu cuộc săn */}
          <div className="w-full sm:w-auto order-1 sm:order-1">
            <Button
              variant="dracula"
              size="lg"
              className="w-full sm:w-80 text-xl py-6 font-bold uppercase tracking-[0.2em] 
                         bg-game-dracula-orange border-none 
                         shadow-[0_0_40px_rgba(225,85,37,0.3)] 
                         hover:shadow-[0_0_60px_rgba(225,85,37,0.6)] 
                         hover:scale-105 transition-all duration-300
                         font-['Playfair_Display'] rounded-none"
              onClick={handleStartHunt}
            >
              Bắt Đầu Cuộc Săn
            </Button>
          </div>

          {/* Nút phụ: Luật chơi - Thiết kế Minimalist hiện đại */}
          <div className="w-full sm:w-auto order-2 sm:order-2">
            <a
              href="https://boardgamegeek.com/boardgame/380695/dracula-vs-van-helsing"
              target="_blank"
              rel="noreferrer"
              className="block w-full"
            >
              <Button
                variant="vanhelsing"
                size="lg"
                className="w-full sm:w-80 text-xl py-6 font-bold uppercase tracking-[0.2em]
                           bg-transparent border border-white/20 text-white/80 
                           hover:bg-white/5 hover:border-white/60 hover:text-white
                           hover:scale-105 transition-all duration-300
                           font-['Playfair_Display'] rounded-none backdrop-blur-sm"
              >
                Xem Luật Chơi
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Footer trang trí cực đơn giản */}
      <footer className="absolute bottom-10 w-full text-center z-20 pointer-events-none">
        <div className="flex items-center justify-center gap-4 opacity-20">
          <div className="h-px w-12 bg-game-bone-white" />
          <span className="text-[10px] uppercase tracking-[0.5em] font-medium text-game-bone-white">
            London 1888
          </span>
          <div className="h-px w-12 bg-game-bone-white" />
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
