import React from "react";

// Sử dụng mã màu chuẩn Tailwind kết hợp với màu theme để đảm bảo chạy mượt
const COLOR_MAP = {
  0: {
    name: "Red",
    bg: "bg-red-900/80",
    border: "border-red-500",
    text: "text-red-100",
    accent: "bg-red-500",
  }, // Dracula / Hearts
  1: {
    name: "Purple",
    bg: "bg-fuchsia-900/80",
    border: "border-fuchsia-500",
    text: "text-fuchsia-100",
    accent: "bg-fuchsia-500",
  }, // Spades
  2: {
    name: "Green",
    bg: "bg-emerald-900/80",
    border: "border-emerald-500",
    text: "text-emerald-100",
    accent: "bg-emerald-500",
  }, // Clubs
  3: {
    name: "Yellow",
    bg: "bg-amber-700/80",
    border: "border-amber-400",
    text: "text-amber-50",
    accent: "bg-amber-400",
  }, // Diamonds
};

const Card = ({
  cardData,
  isHidden = false,
  onClick,
  className = "",
  isOpponent = false,
}) => {
  // Thiết kế mặt úp của lá bài (Card Back)
  if (isHidden) {
    return (
      <div
        className={`w-full aspect-[2/3] rounded-md bg-black border border-white/10 flex items-center justify-center p-2 shadow-[0_5px_15px_rgba(0,0,0,0.8)] relative overflow-hidden ${className}`}
      >
        {/* Họa tiết mặt sau ma mị */}
        <div className="absolute inset-1 border border-white/5 rounded-sm flex items-center justify-center">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(225,85,37,0.15)_0%,_transparent_70%)]" />
          <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-game-dracula-orange/30 to-transparent" />
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-game-dracula-orange/30 to-transparent" />
        </div>
      </div>
    );
  }

  const theme = COLOR_MAP[cardData?.color] || COLOR_MAP[0];

  // Mặt trước của lá bài
  return (
    <div
      onClick={onClick}
      className={`w-full aspect-[2/3] rounded-md ${theme.bg} border ${theme.border} shadow-[0_5px_15px_rgba(0,0,0,0.6)] flex flex-col justify-between p-2 sm:p-3 relative cursor-pointer hover:-translate-y-4 hover:shadow-[0_10px_25px_rgba(255,255,255,0.15)] transition-all duration-300 group ${className}`}
    >
      {/* Nền Texture Vintage */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none mix-blend-overlay" />

      {/* Góc trên trái */}
      <div
        className={`text-lg sm:text-2xl font-black ${theme.text} leading-none font-['Playfair_Display'] z-10`}
      >
        {cardData?.value}
        <div
          className={`w-2 h-2 mt-1 rounded-full ${theme.accent} shadow-[0_0_5px_currentColor]`}
        />
      </div>

      {/* Trang trí ở giữa */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className={`text-6xl sm:text-8xl font-black font-['Playfair_Display'] opacity-20 ${theme.text} transform group-hover:scale-110 transition-transform duration-500`}
        >
          {cardData?.value}
        </span>
      </div>

      {/* Góc dưới phải (lộn ngược) */}
      <div
        className={`text-lg sm:text-2xl font-black ${theme.text} leading-none rotate-180 font-['Playfair_Display'] z-10 flex flex-col items-start`}
      >
        {cardData?.value}
        <div
          className={`w-2 h-2 mt-1 rounded-full ${theme.accent} shadow-[0_0_5px_currentColor]`}
        />
      </div>
    </div>
  );
};

export default Card;
